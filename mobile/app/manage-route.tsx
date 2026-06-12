import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, cancelRideRoute, updateRideRoute } from '../src/store/store';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ManageRouteModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const ride = useSelector((state: RootState) => state.rides.myRidesList.find(r => r._id === id));

  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [totalSeats, setTotalSeats] = useState(0);

  React.useEffect(() => {
    if (ride) {
      setDestination(ride.destination);
      const timeStr = typeof ride.departureTime === 'string' && ride.departureTime.includes('T') 
        ? new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : ride.departureTime;
      setDepartureTime(timeStr);
      setTotalSeats(ride.totalSeats);
    }
  }, [ride]);

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

  const parseTime = (timeStr: string) => {
    try {
      // If it's already an ISO string, return it
      if (timeStr.includes('T')) return timeStr;

      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date.toISOString();
    } catch {
      return new Date().toISOString(); 
    }
  };

  const handleUpdateRoute = async () => {
    setIsUpdating(true);
    try {
      const resultAction = await dispatch(updateRideRoute({
        id: ride._id,
        destination,
        departureTime: parseTime(departureTime),
        totalSeats
      }));
      if (updateRideRoute.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Your route has been updated.");
        setIsEditing(false);
      } else {
        Alert.alert("Error", resultAction.payload as string || "Failed to update route");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelRoute = () => {
    Alert.alert(
      "Cancel Route?",
      "Are you sure you want to cancel this route? All passengers will be notified.",
      [
        { text: "Keep Route", style: "cancel" },
        { 
          text: "Cancel Route", 
          style: "destructive",
          onPress: async () => {
            setIsCancelling(true);
            try {
              const resultAction = await dispatch(cancelRideRoute(ride._id));
              if (cancelRideRoute.fulfilled.match(resultAction)) {
                Alert.alert("Route Cancelled", "Your route has been successfully cancelled.");
                router.back();
              } else {
                Alert.alert("Error", resultAction.payload as string || "Failed to cancel route");
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
        <Text className="text-on-surface font-display text-lg font-semibold">Manage Route</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} className="p-2 -mr-2">
          <Text className="text-primary font-semibold">{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-5 pt-6">
        <Text className="text-on-surface text-2xl font-bold mb-6">{isEditing ? 'Edit Journey' : 'Route Details'}</Text>

        {/* Bento Box */}
        <View className="w-full bg-surface-container border border-surface-variant rounded-xl p-5 flex-col mb-8">
           <View className="flex-col pb-4 mb-4 border-b border-surface-variant">
             <Text className="font-body-sm text-sm text-on-surface-variant mb-1">Departure</Text>
             {isEditing ? (
                <View className="bg-background border border-surface-variant rounded-lg px-3 py-2 mt-1">
                  <TextInput 
                    className="text-primary font-semibold text-lg"
                    value={departureTime}
                    onChangeText={setDepartureTime}
                  />
                </View>
             ) : (
                <Text className="font-title-md text-lg font-semibold text-primary">{timeString}</Text>
             )}
           </View>

           {/* Route Vector */}
           <View className="flex-row items-center">
               <View className="flex-col items-center mr-4">
                   <View className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                   <View className="w-0.5 h-8 bg-surface-variant my-1.5" />
                   <View className="w-2.5 h-2.5 rounded-full bg-primary" />
               </View>
               <View className="flex-col flex-1 justify-between h-[4.5rem]">
                   <View>
                     <Text className="font-body-sm text-sm text-on-surface-variant mb-0.5">Origin</Text>
                     <Text className="font-body-sm text-base text-on-surface-variant truncate" numberOfLines={1}>{ride.origin}</Text>
                   </View>
                   <View>
                     <Text className="font-body-sm text-sm text-primary mb-0.5">Destination</Text>
                     {isEditing ? (
                        <View className="bg-background border border-surface-variant rounded-lg px-3 py-1">
                           <TextInput 
                             className="text-primary text-base"
                             value={destination}
                             onChangeText={setDestination}
                           />
                        </View>
                     ) : (
                        <Text className="font-body-sm text-base text-primary truncate" numberOfLines={1}>{ride.destination}</Text>
                     )}
                   </View>
               </View>
           </View>
        </View>

        <View className="mb-8">
          <Text className="text-on-surface font-bold text-lg mb-4">Passengers & Seats</Text>
          <View className="bg-surface-container-low border border-surface-variant rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="people" size={20} color="#8f9194" className="mr-3" />
                <Text className="text-on-surface text-base">
                  {isEditing ? `Already booked: ${ride.totalSeats - ride.availableSeats}` : `${ride.totalSeats - ride.availableSeats} of ${ride.totalSeats} seats filled`}
                </Text>
              </View>
              {isEditing && (
                <View className="flex-row items-center">
                  <TouchableOpacity 
                    className="w-8 h-8 rounded-full border border-surface-variant flex items-center justify-center"
                    onPress={() => totalSeats > (ride.totalSeats - ride.availableSeats) && setTotalSeats(totalSeats - 1)}
                  >
                    <Ionicons name="remove" size={16} color="#e5e2e1" />
                  </TouchableOpacity>
                  <Text className="text-primary text-lg font-semibold w-8 text-center">{totalSeats}</Text>
                  <TouchableOpacity 
                    className="w-8 h-8 rounded-full border border-surface-variant flex items-center justify-center"
                    onPress={() => totalSeats < 4 && setTotalSeats(totalSeats + 1)}
                  >
                    <Ionicons name="add" size={16} color="#e5e2e1" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-auto">
          {isEditing ? (
            <TouchableOpacity 
              className={`w-full bg-primary rounded-xl py-4 items-center justify-center mb-4 ${isUpdating ? 'opacity-50' : ''}`}
              onPress={handleUpdateRoute}
              disabled={isUpdating}
            >
              {isUpdating ? <ActivityIndicator color="#1c1b1b" /> : <Text className="text-on-primary font-bold text-lg">Save Changes</Text>}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              className={`w-full flex-row items-center justify-center py-4 mb-6 border border-error rounded-xl ${isCancelling ? 'opacity-50' : 'bg-error/10'}`}
              onPress={handleCancelRoute}
              disabled={isCancelling}
              activeOpacity={0.7}
            >
              {isCancelling ? (
                <ActivityIndicator color="#ffb4ab" size="small" />
              ) : (
                <>
                  <Ionicons name="warning-outline" size={20} color="#ffb4ab" className="mr-2" />
                  <Text className="text-error font-semibold text-base">Cancel Route</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}