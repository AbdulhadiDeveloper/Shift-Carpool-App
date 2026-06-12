import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch, fetchMyRides, Ride } from '../../src/store/store';

export default function MyJourneysScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const { myRidesList, loading } = useSelector((state: RootState) => state.rides);

  useEffect(() => {
    dispatch(fetchMyRides());
  }, [dispatch]);

  const upcomingRides = myRidesList.filter(r => new Date(r.departureTime) >= new Date() || r.status === 'active');
  const historyRides = myRidesList.filter(r => new Date(r.departureTime) < new Date() && r.status !== 'active');

  const renderRideCard = (ride: Ride, isDriver: boolean) => {
    const timeString = typeof ride.departureTime === 'string' && ride.departureTime.includes('T') 
              ? new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : ride.departureTime;

    return (
      <View key={ride._id} className="bg-surface-container rounded-xl p-5 border border-surface-container-high mb-4">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-row items-center space-x-2">
            <Ionicons name={isDriver ? "car" : "walk"} size={20} color="#ffffff" className="mr-2" />
            <Text className="text-primary text-xs font-bold tracking-widest uppercase">{isDriver ? "Driving" : "Riding"}</Text>
          </View>
          <Text className="text-on-surface-variant text-xs font-bold uppercase">Upcoming</Text>
        </View>

        <View className="mb-6 relative">
          <View className="flex-row items-center mb-4">
            <Text className="text-on-surface text-base font-medium w-20">{timeString}</Text>
            <View className="flex-1 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-outline mr-3"></View>
              <Text className="text-on-surface-variant text-base">{ride.origin}</Text>
            </View>
          </View>

          <View className="absolute left-[5.4rem] top-3 bottom-5 w-0.5 bg-surface-container-high z-0"></View>

          <View className="flex-row items-center">
            <Text className="text-on-surface text-base font-medium w-20">Est.</Text>
            <View className="flex-1 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-primary mr-3"></View>
              <Text className="text-on-surface text-base">{ride.destination}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between pt-4 border-t border-surface-container-high">
          <View className="flex-row items-center">
            {isDriver ? (
              <>
                <Ionicons name="people" size={16} color="#8f9194" className="mr-2" />
                <Text className="text-on-surface-variant text-sm">{ride.totalSeats - ride.availableSeats} Passengers</Text>
              </>
            ) : (
              <>
                <View className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden mr-3">
                   <View className="w-full h-full items-center justify-center bg-surface-variant">
                     <Ionicons name="person" size={16} color="#8f9194" />
                   </View>
                </View>
                <Text className="text-on-surface-variant text-sm">Driver: {ride.driverName}</Text>
              </>
            )}
          </View>
          <TouchableOpacity 
            className={isDriver ? "bg-primary px-4 py-2 rounded-lg" : "bg-surface-container-high border border-outline-variant px-4 py-2 rounded-lg"}
            onPress={() => {
              if (isDriver) {
                router.push(`/manage-route?id=${ride._id}`);
              } else {
                router.push(`/view-details?id=${ride._id}`);
              }
            }}
          >
            <Text className={isDriver ? "text-on-primary font-semibold" : "text-on-surface font-semibold"}>{isDriver ? "Manage Route" : "View Details"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top App Bar */}
      <View className="w-full flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity activeOpacity={0.8}>
          <Ionicons name="menu-outline" size={28} color="#e5e2e1" />
        </TouchableOpacity>
        <Text className="text-primary text-2xl font-bold tracking-tight">Shift</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Ionicons name="settings-outline" size={24} color="#8f9194" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Page Title */}
        <Text className="text-on-surface text-3xl font-bold mb-6">My Journeys</Text>

        {/* Tabs */}
        <View className="flex-row bg-surface-container-high p-1 rounded-xl mb-8">
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg items-center justify-center transition-all ${activeTab === 'upcoming' ? 'bg-surface shadow-sm' : ''}`}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text className={`font-semibold text-base ${activeTab === 'upcoming' ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg items-center justify-center transition-all ${activeTab === 'history' ? 'bg-surface shadow-sm' : ''}`}
            onPress={() => setActiveTab('history')}
          >
            <Text className={`font-semibold text-base ${activeTab === 'history' ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
          <>
            {/* Upcoming Content */}
            {activeTab === 'upcoming' && (
              <View className="space-y-4">
                {upcomingRides.length === 0 ? (
                  <View className="py-10 items-center">
                    <Ionicons name="calendar-outline" size={48} color="#2a2a2a" />
                    <Text className="text-outline mt-4 text-center">You have no upcoming journeys.</Text>
                  </View>
                ) : (
                  upcomingRides.map(ride => renderRideCard(ride, ride.driverId === user?._id))
                )}
              </View>
            )}

            {/* History Content */}
            {activeTab === 'history' && (
              <View className="space-y-2">
                {historyRides.length === 0 ? (
                  <View className="py-10 items-center">
                    <Ionicons name="time-outline" size={48} color="#2a2a2a" />
                    <Text className="text-outline mt-4 text-center">No past journeys found.</Text>
                  </View>
                ) : (
                  historyRides.map(ride => (
                    <View key={ride._id} className="p-5 bg-surface-container-lowest rounded-xl opacity-70 mb-3">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-on-surface-variant text-xs font-bold uppercase">
                           {typeof ride.departureTime === 'string' && ride.departureTime.includes('T') ? new Date(ride.departureTime).toLocaleDateString() : ride.departureTime}
                        </Text>
                        <Text className="text-xs font-bold uppercase text-on-surface-variant">Completed</Text>
                      </View>
                      <Text className="text-on-surface text-base">{ride.origin} to {ride.destination}</Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}