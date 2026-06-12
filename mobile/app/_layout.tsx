import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState, restoreSession } from '../src/store/store';

// A component to safely watch the token and handle routing
function AppNavigator() {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<any>();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    dispatch(restoreSession()).finally(() => {
      setIsReady(true);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!isReady) return;

    // Check if the user is currently navigating within the auth screens
    const inAuthGroup = segments[0] === 'auth';

    if (!token && !inAuthGroup) {
      // If user has no token and is NOT on the auth screen, send them there
      router.replace('/auth');
    } else if (token && inAuthGroup) {
      // If user HAS a token and is ON the auth screen, send them to the app
      router.replace('/(tabs)');
    }
  }, [token, segments, isReady, router]);

  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#141313' } }}>
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="auth" options={{ animation: 'fade' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="manage-route" options={{ presentation: 'modal', title: 'Manage Route' }} />
      <Stack.Screen name="view-details" options={{ presentation: 'modal', title: 'View Details' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}