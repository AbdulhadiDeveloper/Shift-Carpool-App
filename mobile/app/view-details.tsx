import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, leaveRide } from '../src/store/store';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ViewDetailsModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isCancelling, setIsCancelling] = useState(false);

  const ride = useSelector((state: RootState) => state.rides.myRidesList.find(r => r._id === id));

  if (!ride) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <Text className="text-on-surface">Ride not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-2">
          <Text className="text-primary font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleLeaveRide = () => {
    Alert.alert(
      "Cancel Seat?",
      "Are you sure you want to cancel your seat on this ride?",
      [
        { text: "Keep Seat", style: "cancel" },
        { 
          text: "Cancel Seat", 
          style: "destructive",
          onPress: async () => {
            setIsCancelling(true);
            try {
              const resultAction = await dispatch(leaveRide(ride._id));
              if (leaveRide.fulfilled.match(resultAction)) {
                Alert.alert("Seat Cancelled", "Your seat has been successfully cancelled.");
                router.back();
              } else {
                Alert.alert("Error", resultAction.payload as string || "Failed to cancel seat");
              }
            } catch {
              Alert.alert("Error", "An unexpected error occurred.");
            } finally {
              setIsCancelling(false);
            }
          }
        }
      ]
    );
  };

  const timeString = typeof ride.departureTime === 'string' && ride.departureTime.includes('T') 
    ? new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : ride.departureTime;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-surface-container-high bg-surface">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="close" size={24} color="#e5e2e1" />
        </TouchableOpacity>
        <Text className="text-on-surface font-display text-lg font-semibold">Journey Details</Text>
        <View className="w-8" />
      </View>

      <View className="flex-1 px-5 pt-6">
        {/* Bento Box */}
        <View className="w-full bg-surface-container border border-surface-variant rounded-xl p-5 flex-col mb-8">
           {/* Driver Info */}
           <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-surface-variant">
             <View className="flex-row items-center">
               <View className="w-12 h-12 rounded-full border border-surface-variant items-center justify-center bg-surface-variant overflow-hidden mr-3">
                  <Ionicons name="person" size={24} color="#8f9194" />
               </View>
               <View className="flex-col">
                 <Text className="font-body-sm text-sm text-on-surface-variant">Driver</Text>
                 <Text className="font-title-md text-lg font-semibold text-primary">{ride.driverName}</Text>
               </View>
             </View>
             <View className="flex-col items-end">
               <Text className="font-body-sm text-sm text-on-surface-variant">Pickup</Text>
               <Text className="font-title-md text-lg font-semibold text-primary">{timeString}</Text>
             </View>
           </View>

           {/* Route Vector */}
           <View className="flex-row items-center">
               <View className="flex-col items-center mr-4">
                   <View className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                   <View className="w-0.5 h-8 bg-surface-variant my-1.5" />
                   <View className="w-2.5 h-2.5 rounded-full bg-primary" />
               </View>
               <View className="flex-col flex-1 justify-between h-[4.5rem]">
                   <Text className="font-body-sm text-base text-on-surface-variant truncate" numberOfLines={1}>{ride.origin}</Text>
                   <Text className="font-body-sm text-base text-primary truncate" numberOfLines={1}>{ride.destination}</Text>
               </View>
           </View>
        </View>

        {/* Spacer to push actions to bottom */}
        <View className="flex-1" />

        <TouchableOpacity 
          className={`w-full flex-row items-center justify-center py-4 mb-6 border border-error rounded-xl ${isCancelling ? 'opacity-50' : 'bg-error/10'}`}
          onPress={handleLeaveRide}
          disabled={isCancelling}
          activeOpacity={0.7}
        >
          {isCancelling ? (
            <ActivityIndicator color="#ffb4ab" size="small" />
          ) : (
            <>
              <Ionicons name="close-circle-outline" size={20} color="#ffb4ab" className="mr-2" />
              <Text className="text-error font-semibold text-base">Cancel My Seat</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}