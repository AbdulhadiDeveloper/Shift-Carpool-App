import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { Ride, AppDispatch, leaveRide } from '../store/store';

interface Props {
  ride: Ride;
  onClose: () => void;
}

export default function SeatReservedModal({ ride, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [isCancelling, setIsCancelling] = useState(false);
  
  // This function formats the text and opens the WhatsApp app!
  const openWhatsApp = () => {
    const timeString = typeof ride.departureTime === 'string' && ride.departureTime.includes('T') 
              ? new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : ride.departureTime;

    const message = `Hi ${ride.driverName}, I just secured a seat on Shift! See you at ${ride.origin} for the ${timeString} departure.`;
    const rawPhone = ride.driverPhone || '15551234567';
    // WhatsApp requires a purely numeric string without spaces, dashes, or plus signs
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url).catch(() => {
      alert('Make sure WhatsApp is installed on your phone!');
    });
  };

  const handleCancelSeat = async () => {
    setIsCancelling(true);
    try {
      const resultAction = await dispatch(leaveRide(ride._id));
      if (leaveRide.fulfilled.match(resultAction)) {
        alert("Your seat has been successfully cancelled.");
        onClose();
      } else {
        alert(resultAction.payload || "Failed to cancel seat");
      }
    } catch {
      alert("An unexpected error occurred.");
    } finally {
      setIsCancelling(false);
    }
  };

  const timeString = typeof ride.departureTime === 'string' && ride.departureTime.includes('T') 
              ? new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : ride.departureTime;

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
      {/* Dark semi-transparent background overlay with glassmorphism feel */}
      <View className="flex-1 justify-end bg-background/60">
        
        {/* The Bottom Sheet */}
        <View className="bg-surface-container-low rounded-t-[24px] pt-4 pb-10 px-5 border border-surface-variant border-b-0 shadow-lg items-center">
          
          {/* Subtle drag handle at the top */}
          <View className="w-12 h-1 bg-outline-variant rounded-full mb-6 opacity-50" />
          
          {/* Header */}
          <View className="items-center text-center mb-8 w-full">
            <View className="w-16 h-16 rounded-full bg-surface-container-high border border-surface-variant flex items-center justify-center mb-3">
              <Ionicons name="checkmark-circle" size={32} color="#ffffff" />
            </View>
            <Text className="font-display text-2xl font-bold text-primary">Seat Reserved Successfully</Text>
          </View>

          {/* Ride Details Summary Bento Box */}
          <View className="w-full bg-surface-container border border-surface-variant rounded-xl p-4 flex-col mb-8">
             {/* Driver Info */}
             <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-surface-variant">
               <View className="flex-row items-center">
                 <View className="w-10 h-10 rounded-full border border-surface-variant items-center justify-center bg-surface-variant overflow-hidden mr-3">
                    <Ionicons name="person" size={20} color="#8f9194" />
                 </View>
                 <View className="flex-col">
                   <Text className="font-body-sm text-sm text-on-surface-variant">Driver</Text>
                   <Text className="font-title-md text-base font-semibold text-primary">{ride.driverName}</Text>
                 </View>
               </View>
               <View className="flex-col items-end">
                 <Text className="font-body-sm text-sm text-on-surface-variant">Pickup</Text>
                 <Text className="font-title-md text-base font-semibold text-primary">{timeString}</Text>
               </View>
             </View>

             {/* Route Vector */}
             <View className="flex-row items-center pt-1">
                 <View className="flex-col items-center mr-3">
                     <View className="w-2 h-2 rounded-full bg-outline-variant" />
                     <View className="w-0.5 h-6 bg-surface-variant my-1" />
                     <View className="w-2 h-2 rounded-full bg-primary" />
                 </View>
                 <View className="flex-col flex-1 h-14 justify-between py-0.5">
                     <Text className="font-body-sm text-sm text-on-surface-variant truncate" numberOfLines={1}>{ride.origin}</Text>
                     <Text className="font-body-sm text-sm text-primary truncate" numberOfLines={1}>{ride.destination}</Text>
                 </View>
             </View>
          </View>

          {/* Call to Action Buttons */}
          <View className="w-full flex-col mb-6">
            <TouchableOpacity 
              className="w-full bg-primary flex-row justify-center items-center rounded-lg py-4 mb-2"
              activeOpacity={0.8}
              onPress={openWhatsApp}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#2f3132" className="mr-2" />
              <Text className="text-on-primary font-semibold text-lg ml-1">Open WhatsApp Coordinator</Text>
            </TouchableOpacity>
            
            <Text className="font-body-sm text-sm text-on-surface-variant text-center opacity-70 px-6">
              This will open a direct text thread with pre-filled pickup coordinates.
            </Text>
          </View>

          {/* Secondary Actions */}
          <TouchableOpacity 
            className={`w-full flex-row items-center justify-center py-2 mb-3 ${isCancelling ? 'opacity-50' : ''}`}
            onPress={handleCancelSeat}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <ActivityIndicator color="#c5c7c9" size="small" />
            ) : (
              <>
                <Ionicons name="close" size={20} color="#c5c7c9" className="mr-1" />
                <Text className="text-on-surface-variant font-medium text-sm">Cancel My Seat</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="py-2">
            <Text className="text-primary font-medium text-sm underline">Return to Dashboard</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );
}