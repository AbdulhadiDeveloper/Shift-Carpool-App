import express from 'express';
import mongoose from 'mongoose';
import Ride from '../models/Ride';
import User from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { rideSchema } from '../utils/schemas';

const router = express.Router();

// GET: Retrieve all active routes with available seats
router.get('/', protect, async (req, res) => {
  try {
    const rides = await Ride.find({ availableSeats: { $gt: 0 }, status: 'active' })
                            .populate('passengers', 'fullName phone')
                            .sort({ createdAt: -1 });
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active routes.' });
  }
});

// GET: Retrieve user's specific journeys (driving or riding)
router.get('/my', protect, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const rides = await Ride.find({
      $or: [
        { driverId: userObjectId },
        { passengers: userObjectId }
      ]
    })
    .populate('passengers', 'fullName phone')
    .sort({ departureTime: 1 }); // Sort by upcoming
    
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user journeys.' });
  }
});

// POST: Broadcast a new route (Driver Mode)
router.post('/', protect, validate(rideSchema), async (req: AuthRequest, res) => {
  try {
    const { origin, destination, departureTime, totalSeats } = req.body;
    
    // driverId should come from the authenticated user
    const driverId = req.user?.id;
    if (!driverId) {
       return res.status(401).json({ error: 'User not authenticated' });
    }

    // Fetch user to get their registered phone number for WhatsApp integration
    const user = await User.findById(driverId);
    if (!user) {
       return res.status(404).json({ error: 'Driver profile not found' });
    }
    
    // Ensure departure time is in the future
    if (new Date(departureTime) < new Date()) {
      return res.status(400).json({ error: 'Departure time must be in the future.' });
    }
    
    const newRide = new Ride({
      driverId,
      driverName: user.fullName,
      driverPhone: user.phone,
      origin,
      destination,
      departureTime,
      totalSeats,
      availableSeats: totalSeats // Inherits initial capacity
    });
    
    const savedRide = await newRide.save();
    res.status(201).json(savedRide);
  } catch (error) {
    res.status(400).json({ error: 'Invalid route specifications.' });
  }
});

// PATCH: Atomic Reservation Engine (Rider Mode)
router.patch('/:id/join', protect, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id; // Authenticated passenger ID

  if (!userId) {
     return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // Atomic update: only decrement IF availableSeats is greater than 0, user is not already a passenger, AND user is not the driver
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: id, availableSeats: { $gt: 0 }, passengers: { $ne: userId }, driverId: { $ne: userId } },
      { 
        $inc: { availableSeats: -1 }, // Decreases available seats by 1
        $push: { passengers: userId } // Adds user to passenger list
      },
      { returnDocument: 'after' } // Returns the updated document
    );

    if (!updatedRide) {
      return res.status(409).json({ error: 'Seat no longer available, you already joined, or ride not found.' });
    }

    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(500).json({ error: 'Transaction failed.' });
  }
});

// PATCH: Leave a ride (Rider relinquishes seat)
router.patch('/:id/leave', protect, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'User not authenticated' });

  try {
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: id, passengers: userId },
      { 
        $inc: { availableSeats: 1 },
        $pull: { passengers: userId }
      },
      { returnDocument: 'after' }
    );

    if (!updatedRide) {
      return res.status(400).json({ error: 'Not a passenger or ride not found.' });
    }

    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(500).json({ error: 'Transaction failed.' });
  }
});

// PATCH: Update a route (Driver mode)
router.patch('/:id', protect, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const { destination, departureTime, totalSeats } = req.body;

  if (!userId) return res.status(401).json({ error: 'User not authenticated' });

  try {
    const ride = await Ride.findOne({ _id: id, driverId: userId, status: 'active' });
    if (!ride) return res.status(404).json({ error: 'Not authorized or ride not found.' });

    // Handle seat logic carefully
    if (totalSeats !== undefined) {
      const reservedSeats = ride.totalSeats - ride.availableSeats;
      if (totalSeats < reservedSeats) {
        return res.status(400).json({ error: `Cannot reduce seats below ${reservedSeats} currently booked.` });
      }
      ride.totalSeats = totalSeats;
      ride.availableSeats = totalSeats - reservedSeats;
    }

    if (destination) ride.destination = destination;
    if (departureTime) ride.departureTime = departureTime;

    const updatedRide = await ride.save();
    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ride.' });
  }
});

// PATCH: Cancel a route (Driver mode)
router.patch('/:id/cancel', protect, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'User not authenticated' });

  try {
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: id, driverId: userId, status: 'active' },
      { status: 'cancelled' },
      { returnDocument: 'after' }
    );

    if (!updatedRide) {
      return res.status(400).json({ error: 'Not authorized or ride already completed/cancelled.' });
    }

    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(500).json({ error: 'Transaction failed.' });
  }
});

// PATCH: Mark a route as completed (Driver mode)
router.patch('/:id/complete', protect, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'User not authenticated' });

  try {
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: id, driverId: userId, status: 'active' },
      { status: 'completed' },
      { returnDocument: 'after' }
    );

    if (!updatedRide) {
      return res.status(400).json({ error: 'Not authorized or ride already completed/cancelled.' });
    }

    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(500).json({ error: 'Transaction failed.' });
  }
});

// POST: Rate a driver (Passenger mode)
router.post('/:id/rate', protect, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const { rating } = req.body;

  if (!userId) return res.status(401).json({ error: 'User not authenticated' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });

  try {
    const ride = await Ride.findOne({ _id: id, status: 'completed', passengers: userId });
    if (!ride) {
      return res.status(400).json({ error: 'You can only rate completed rides you were a passenger on.' });
    }

    const driver = await User.findById(ride.driverId);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found.' });
    }

    const newTotalRatings = driver.totalRatings + 1;
    const newRating = ((driver.rating * driver.totalRatings) + rating) / newTotalRatings;

    driver.rating = Number(newRating.toFixed(2));
    driver.totalRatings = newTotalRatings;
    await driver.save();

    res.status(200).json({ message: 'Rating submitted successfully', driverRating: driver.rating });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit rating.' });
  }
});

export default router;