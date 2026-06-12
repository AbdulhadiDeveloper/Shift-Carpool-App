import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createRide, AppDispatch, RootState } from '../store/store';
import { Ionicons } from '@expo/vector-icons';
import QuietTextInput from './QuietTextInput';

export default function DriverDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Local state to hold form inputs
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('08:30 AM');
  const [seats, setSeats] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseTime = (timeStr: string) => {
    try {
      const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/;
      const match = timeStr.match(timeRegex);
      
      if (!match) throw new Error("Invalid time format");
      
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const modifier = match[3]?.toUpperCase();

      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date.toISOString();
    } catch {
      return new Date().toISOString(); // Fallback if parsing fails
    }
  };

  const handleBroadcast = async () => {
    if (!origin || !destination) {
      Alert.alert('Missing Info', 'Please enter an origin and destination.');
      return;
    }

    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(createRide({
        driverName: user?.fullName || "Shift Driver",
        origin,
        destination,
        departureTime: parseTime(departureTime),
        totalSeats: seats
      }));

      if (createRide.fulfilled.match(resultAction)) {
        Alert.alert('Success!', 'Your route is now live.');
        // Clear the form
        setOrigin('');
        setDestination('');
      } else {
        // Show the error from the backend
        Alert.alert('Error', `Could not broadcast: ${resultAction.payload}`);
      }
      
    } catch {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="font-display text-2xl font-bold text-primary mb-6">Publish Morning Route</Text>

        <View className="bg-surface-container-low rounded-[16px] border border-surface-variant p-5 flex-col mb-8">
          
          {/* Origin Input */}
          <View className="flex-col mb-4">
            <Text className="font-label-caps text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Starting Point / Origin</Text>
            <QuietTextInput 
              iconName="location-sharp"
              placeholder="Enter pickup location"
              value={origin}
              onChangeText={setOrigin}
            />
          </View>

          {/* Vertical Connector (Visual only) */}
          <View className="w-full flex-row px-4 py-1 mb-2">
            <View className="w-[1px] h-6 bg-surface-variant ml-1"></View>
          </View>

          {/* Destination Input */}
          <View className="flex-col mb-6">
            <Text className="font-label-caps text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Drop-off Destination</Text>
            <QuietTextInput 
              iconName="flag"
              placeholder="Enter destination"
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          {/* Departure Time Input */}
          <View className="flex-col mb-6">
            <Text className="font-label-caps text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Departure Window</Text>
            <QuietTextInput 
              iconName="time-outline"
              value={departureTime}
              onChangeText={setDepartureTime}
            />
          </View>

          {/* Seat Stepper */}
          <View className="flex-col mb-2">
            <Text className="font-label-caps text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Available Passenger Seats</Text>
            <View className="flex-row items-center justify-between bg-background rounded-lg border border-surface-variant p-3">
              <View className="flex-row items-center">
                 <Ionicons name="car-sport" size={20} color="#8f9194" className="mr-3" />
                 <Text className="text-on-surface text-base">Seats</Text>
              </View>
              
              <View className="flex-row items-center">
                <TouchableOpacity 
                  className="w-8 h-8 rounded-full border border-surface-variant flex items-center justify-center bg-transparent"
                  onPress={() => seats > 1 && setSeats(seats - 1)}
                >
                  <Ionicons name="remove" size={16} color="#e5e2e1" />
                </TouchableOpacity>
                
                <Text className="text-primary text-lg font-semibold w-8 text-center">{seats}</Text>
                
                <TouchableOpacity 
                  className="w-8 h-8 rounded-full border border-surface-variant flex items-center justify-center bg-transparent"
                  onPress={() => seats < 4 && setSeats(seats + 1)}
                >
                  <Ionicons name="add" size={16} color="#e5e2e1" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>

        {/* Broadcast Button */}
        <TouchableOpacity 
          className={`bg-primary rounded-lg py-4 items-center flex-row justify-center mt-auto ${isSubmitting ? 'opacity-50' : ''}`}
          activeOpacity={0.8}
          onPress={handleBroadcast}
          disabled={isSubmitting}
        >
          <Ionicons name="radio-outline" size={20} color="#1c1b1b" className="mr-2" />
          <Text className="text-on-primary font-semibold text-lg tracking-tight">
            {isSubmitting ? 'Broadcasting...' : 'Broadcast Route Live'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}