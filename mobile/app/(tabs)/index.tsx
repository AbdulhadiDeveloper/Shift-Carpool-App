import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, toggleMode, fetchRides } from '../../src/store/store'; // Notice the ../../ path update!
import RiderDashboard from '../../src/components/RiderDashboard';
import DriverDashboard from '../../src/components/DriverDashboard';
import { Ionicons } from '@expo/vector-icons'; 

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const isDriverView = useSelector((state: RootState) => state.ui.isDriverView);

  useEffect(() => {
    dispatch(fetchRides());
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-4 pb-6 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full border border-surface-container-high items-center justify-center mr-3">
             <Text className="text-on-surface font-semibold">JD</Text>
          </View>
          <Text className="text-on-surface text-2xl font-semibold tracking-tight">Shift Carpool</Text>
        </View>
        <Ionicons name="settings-outline" size={24} color="#e5e2e1" />
      </View>

      <View className="px-5 mb-6">
        <View className="bg-surface-container flex-row rounded-full p-1 border border-surface-container-high">
          <TouchableOpacity 
            className={`flex-1 rounded-full py-3 items-center ${!isDriverView ? 'bg-primary' : 'bg-transparent'}`}
            onPress={() => isDriverView && dispatch(toggleMode())}
            activeOpacity={0.8}
          >
            <Text className={`font-semibold ${!isDriverView ? 'text-on-primary' : 'text-on-surface'}`}>Rider Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 rounded-full py-3 items-center ${isDriverView ? 'bg-primary' : 'bg-transparent'}`}
            onPress={() => !isDriverView && dispatch(toggleMode())}
            activeOpacity={0.8}
          >
            <Text className={`font-semibold ${isDriverView ? 'text-on-primary' : 'text-on-surface'}`}>Driver Mode</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 px-5">
        {isDriverView ? <DriverDashboard /> : <RiderDashboard />}
      </View>
    </SafeAreaView>
  );
}