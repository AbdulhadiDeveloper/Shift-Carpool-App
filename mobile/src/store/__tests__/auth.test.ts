import { store, registerUser } from '../store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

describe('Auth Redux State Tests', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('should handle successful registration', async () => {
    const mockUser = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password123'
    };

    const mockResponse = {
      _id: '123',
      fullName: 'John Doe',
      email: 'john@example.com',
      token: 'fake-jwt-token'
    };

    mock.onPost(/\/api\/auth\/register/).reply(201, mockResponse);

    await store.dispatch(registerUser(mockUser) as any);
    const state = store.getState().auth;

    expect(state.token).toEqual('fake-jwt-token');
    expect(state.error).toBeNull();
  });

  it('should handle failed registration (User already exists)', async () => {
    const mockUser = {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0987654321',
      password: 'password123'
    };

    mock.onPost(/\/api\/auth\/register/).reply(400, { error: 'User already exists' });

    await store.dispatch(registerUser(mockUser) as any);
    const state = store.getState().auth;

    expect(state.error).toEqual('User already exists');
  });
});