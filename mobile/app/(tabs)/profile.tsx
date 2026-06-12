import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, logoutUser } from '../../src/store/store';

export default function ProfileScreen() {
  const [isQuietMode, setIsQuietMode] = useState(true);
  const dispatch = useDispatch<any>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Get initials for avatar placeholder
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      
      {/* 1. Standard Header */}
      <View className="px-5 pt-4 pb-6 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full border border-surface-container-high items-center justify-center mr-3">
             <Text className="text-on-surface font-semibold">{getInitials(user?.fullName)}</Text>
          </View>
          <Text className="text-on-surface text-2xl font-semibold tracking-tight">Shift Carpool</Text>
        </View>
        <Ionicons name="settings-outline" size={24} color="#e5e2e1" />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        
        {/* 2. Avatar & Rating */}
        <View className="items-center mb-8 mt-2">
          <View className="w-24 h-24 rounded-full border-2 border-surface-container-high items-center justify-center overflow-hidden mb-4 bg-surface-variant">
            {/* Using a placeholder icon since we don't have uploaded avatars yet */}
            <Ionicons name="person" size={48} color="#e5e2e1" />
          </View>
          <Text className="text-on-surface text-2xl font-semibold tracking-tight mb-2">{user?.fullName || 'User'}</Text>
          <View className="bg-surface-container border border-surface-container-high rounded-full px-4 py-1.5 flex-row items-center">
            <Ionicons name="star" size={14} color="#8f9194" className="mr-2" />
            <Text className="text-outline text-sm font-medium">5.0 Rider Rating</Text>
          </View>
        </View>

        {/* 3. Personal Details Card */}
        <View className="bg-surface border border-surface-container-high rounded-[16px] p-5 mb-5">
          <Text className="text-on-surface font-bold text-sm mb-5">Personal Details</Text>
          
          <View className="flex-row items-center mb-6">
            <Ionicons name="mail-outline" size={20} color="#e5e2e1" className="mr-4" />
            <Text className="text-on-surface text-base">{user?.email || 'email@example.com'}</Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="phone-portrait-outline" size={20} color="#e5e2e1" className="mr-4" />
            <Text className="text-on-surface text-base">{user?.phone || '+1 (***) ***-****'}</Text>
          </View>
        </View>

        {/* 4. Ride Preferences Card */}
        <View className="bg-surface border border-surface-container-high rounded-[16px] p-5 mb-5">
          <Text className="text-on-surface font-bold text-sm mb-5">Ride Preferences</Text>
          
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center flex-1">
              <Ionicons name={isQuietMode ? "volume-mute-outline" : "volume-high-outline"} size={22} color="#e5e2e1" className="mr-4" />
              <View>
                <Text className="text-on-surface text-base font-medium">Quiet Mode</Text>
                <Text className="text-outline text-sm mt-1">Prefer minimal conversation</Text>
              </View>
            </View>
            <Switch 
              value={isQuietMode} 
              onValueChange={setIsQuietMode}
              trackColor={{ false: '#2a2a2a', true: '#ffffff' }}
              thumbColor={isQuietMode ? '#1c1b1b' : '#8f9194'}
              ios_backgroundColor="#2a2a2a"
            />
          </View>

          <View className="w-full h-[1px] bg-surface-container-high mb-6" />
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="snow-outline" size={20} color="#e5e2e1" className="mr-4" />
              <View>
                <Text className="text-on-surface text-base font-medium">Climate Control</Text>
                <Text className="text-outline text-sm mt-1">Cool (68°F - 70°F)</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text className="text-on-surface font-semibold text-base">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Account Settings Card */}
        <View className="bg-surface border border-surface-container-high rounded-[16px] p-5 mb-10">
          <Text className="text-on-surface font-bold text-sm mb-5">Account Settings</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={22} color="#e5e2e1" className="mr-4" />
              <Text className="text-on-surface text-base">Payment Methods</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#8f9194" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark-outline" size={22} color="#e5e2e1" className="mr-4" />
              <Text className="text-on-surface text-base">Security & Privacy</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#8f9194" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center" onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#ffb4ab" className="mr-4" />
            <Text className="text-[#ffb4ab] text-base font-medium">Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}