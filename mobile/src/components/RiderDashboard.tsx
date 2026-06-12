import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, joinRide, Ride } from '../store/store';
import { Ionicons } from '@expo/vector-icons';
import SeatReservedModal from './SeatReservedModal';

export default function RiderDashboard() {
  const rides = useSelector((state: RootState) => state.rides.activeRidesList);
  const loading = useSelector((state: RootState) => state.rides.loading);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const handleSecureSeat = useCallback(async (ride: Ride) => {
    const resultAction = await dispatch(joinRide(ride._id));
    
    if (joinRide.fulfilled.match(resultAction)) {
      setSelectedRide(resultAction.payload); 
    } else {
      alert(resultAction.payload || "Sorry, this seat was just taken!");
    }
  }, [dispatch]);

  const renderRideCard = useCallback(({ item }: { item: Ride }) => {
    const timeString = typeof item.departureTime === 'string' && item.departureTime.includes('T') 
              ? new Date(item.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : item.departureTime;

    return (
      <View className="bg-surface-container-low rounded-[16px] border border-outline-variant p-5 flex flex-col mb-4">
        {/* Top Row */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden mr-3">
              <Ionicons name="person" size={20} color="#c5c7c9" />
            </View>
            <View>
              <View className="flex-row items-center mb-0.5">
                <Text className="font-semibold text-lg text-primary mr-1">{item.driverName}</Text>
                <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
              </View>
              <View className="flex-row items-center">
                <Ionicons name="star" size={12} color="#c5c7c9" className="mr-1" />
                <Text className="text-on-surface-variant text-sm">4.9</Text>
              </View>
            </View>
          </View>
          <View className="items-end">
            <Text className="font-semibold text-xl text-primary">{timeString}</Text>
            <Text className="text-on-surface-variant text-sm">Est. {item.estimatedDuration}</Text>
          </View>
        </View>

        {/* Middle Row (Route) */}
        <View className="flex-row items-center bg-background p-3 rounded-lg border border-outline-variant mb-4">
          <Text className="text-on-surface text-sm flex-1" numberOfLines={1}>{item.origin}</Text>
          <Ionicons name="arrow-forward" size={16} color="#c5c7c9" className="mx-2" />
          <Text className="text-on-surface text-sm flex-1 text-right" numberOfLines={1}>{item.destination}</Text>
        </View>

        {/* Bottom Row (Action) */}
        <View className="flex-row justify-between items-center">
          <View className="bg-surface-variant px-3 py-1.5 rounded-full border border-outline-variant flex-row items-center">
            <Ionicons name="people" size={14} color="#c5c7c9" className="mr-1.5" />
            <Text className="text-on-surface text-xs font-bold uppercase tracking-widest">{item.availableSeats} Available</Text>
          </View>
          <TouchableOpacity 
            className="bg-primary px-6 py-3 rounded-full"
            activeOpacity={0.8}
            onPress={() => handleSecureSeat(item)}
          >
            <Text className="text-on-primary font-semibold text-base">Secure Seat</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [handleSecureSeat]);

  // Format today's date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  return (
    <View className="flex-1">
      {/* Section Title */}
      <View className="flex-row justify-between items-end mb-6">
        <Text className="text-primary text-2xl font-bold tracking-tight">Available Routes</Text>
        <Text className="text-on-surface-variant text-sm pb-1">{formattedDate}</Text>
      </View>
      
      {loading && rides.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : rides.length === 0 ? (
        <View className="flex-1 justify-center items-center opacity-70 mt-10">
          <Ionicons name="car-outline" size={48} color="#8f9194" />
          <Text className="text-on-surface-variant mt-4 font-semibold text-lg">No active routes right now.</Text>
          <Text className="text-outline text-sm mt-2 text-center px-10">Check back later or switch to Driver Mode to broadcast your own route.</Text>
        </View>
      ) : (
        <FlatList 
          data={rides}
          keyExtractor={(item) => item._id}
          renderItem={renderRideCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Seat Reserved Modal */}
      {selectedRide && (
        <SeatReservedModal 
          ride={selectedRide} 
          onClose={() => setSelectedRide(null)} 
        />
      )}
    </View>
  );
}