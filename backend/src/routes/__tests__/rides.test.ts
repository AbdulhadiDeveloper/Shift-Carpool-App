import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import rideRoutes from '../rides';
import User from '../../models/User';
import Ride from '../../models/Ride';

const app = express();
app.use(express.json());
app.use('/api/rides', rideRoutes);

let mongoServer: MongoMemoryServer;
let token: string;
let userId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  
  // Set JWT_SECRET for test
  process.env.JWT_SECRET = 'test_secret';

  // Create test user
  const user = await User.create({
    fullName: 'Test Driver',
    email: 'driver@test.com',
    passwordHash: 'hashed_pw',
    phone: '1234567890'
  });
  userId = user._id.toString();
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Ride.deleteMany({});
});

describe('POST /api/rides (Broadcast Route)', () => {
  it('should create a new ride when valid data is provided', async () => {
    // The frontend sends: origin, destination, departureTime, totalSeats
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // tomorrow
    
    const payload = {
      origin: 'San Francisco',
      destination: 'Los Angeles',
      departureTime: futureDate.toISOString(),
      totalSeats: 3
    };

    const response = await request(app)
      .post('/api/rides')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    if (response.status !== 201) {
      console.error('Test failed with response:', response.body);
    }
    
    expect(response.status).toBe(201);
    expect(response.body.origin).toBe('San Francisco');
    expect(response.body.driverName).toBe('Test Driver');
  });
});
