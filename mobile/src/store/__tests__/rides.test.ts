import { store, fetchRides, joinRide, createRide } from '../store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Rides Redux State Tests', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('should handle fetching rides', async () => {
    const mockRides = [
      {
        _id: '1',
        driverName: 'Alice',
        origin: 'Home',
        destination: 'Work',
        departureTime: new Date().toISOString(),
        estimatedDuration: '30 mins',
        availableSeats: 3,
        totalSeats: 4,
        passengers: [],
        status: 'active'
      }
    ];

    mock.onGet(/\/api\/rides$/).reply(200, mockRides);

    await store.dispatch(fetchRides() as any);
    const state = store.getState().rides;

    expect(state.activeRidesList.length).toBe(1);
    expect(state.activeRidesList[0].driverName).toEqual('Alice');
    expect(state.loading).toBe(false);
  });

  it('should handle creating a new ride', async () => {
    const newRideData = {
      driverName: 'Bob',
      origin: 'City',
      destination: 'Airport',
      departureTime: new Date().toISOString(),
      totalSeats: 2
    };

    const mockResponse = {
      _id: '2',
      ...newRideData,
      availableSeats: 2,
      passengers: [],
      status: 'active'
    };

    mock.onPost(/\/api\/rides/).reply(201, mockResponse);

    await store.dispatch(createRide(newRideData) as any);
    const state = store.getState().rides;

    // It should add the new ride to both activeRidesList and myRidesList
    expect(state.activeRidesList[0].driverName).toEqual('Bob');
    expect(state.myRidesList[0].driverName).toEqual('Bob');
  });

  it('should handle joining a ride', async () => {
    const mockJoinedRide = {
      _id: '1',
      driverName: 'Alice',
      origin: 'Home',
      destination: 'Work',
      departureTime: new Date().toISOString(),
      estimatedDuration: '30 mins',
      availableSeats: 2, // decreased from 3
      totalSeats: 4,
      passengers: ['user_id_1'], // passenger added
      status: 'active'
    };

    // Ensure there is a ride in the state to update
    mock.onPatch(/\/api\/rides\/1\/join/).reply(200, mockJoinedRide);

    await store.dispatch(joinRide('1') as any);
    const state = store.getState().rides;

    // Verify it was updated in myRidesList (since the slice logic adds it there when joined)
    const myRide = state.myRidesList.find(r => r._id === '1');
    expect(myRide).toBeDefined();
    expect(myRide?.availableSeats).toEqual(2);
    expect(myRide?.passengers).toContain('user_id_1');
  });
});