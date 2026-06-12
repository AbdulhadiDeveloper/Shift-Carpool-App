import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, AppDispatch, RootState } from '../store/store';
import { Ionicons } from '@expo/vector-icons';
import QuietTextInput from './QuietTextInput';

export default function AuthScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert("Authentication Failed", error);
    }
  }, [error]);

  const handleSubmit = () => {
    if (isLogin) {
      if (!email || !password) return Alert.alert("Error", "Please fill in all fields.");
      dispatch(loginUser({ email, password }));
    } else {
      if (!fullName || !email || !phone || !password) return Alert.alert("Error", "Please fill in all fields.");
      dispatch(registerUser({ fullName, email, phone: `${countryCode} ${phone}`, password }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          
          <View className="items-center mb-10 mt-10">
            <Text className="font-display text-5xl font-bold tracking-tight text-primary mb-3">Shift</Text>
            <Text className="font-body-lg text-on-surface-variant text-base">
              {isLogin ? 'Quiet Luxury Travel' : 'Request access to quiet luxury travel.'}
            </Text>
          </View>

          <View className="bg-surface-container border border-surface-variant rounded-[16px] p-5 mb-8">
            
            {!isLogin && (
              <View className="mb-4">
                <Text className="font-label-caps text-xs font-bold tracking-wider text-on-surface-variant mb-2">FULL NAME</Text>
                <QuietTextInput 
                  iconName="person-outline"
                  placeholder="Jane Doe" 
                  value={fullName} 
                  onChangeText={setFullName} 
                />
              </View>
            )}

            <View className="mb-4">
              <Text className="font-label-caps text-xs font-bold tracking-wider text-on-surface-variant mb-2">EMAIL ADDRESS</Text>
              <QuietTextInput 
                iconName="mail-outline"
                placeholder="name@example.com" 
                autoCapitalize="none" 
                keyboardType="email-address" 
                value={email} 
                onChangeText={setEmail} 
              />
            </View>

            {!isLogin && (
              <View className="mb-4">
                <Text className="font-label-caps text-xs font-bold tracking-wider text-on-surface-variant mb-2">PHONE NUMBER</Text>
                <View className="flex-row items-center gap-2">
                  <View className="w-24">
                    <QuietTextInput 
                      value={countryCode} 
                      onChangeText={setCountryCode} 
                      keyboardType="phone-pad" 
                    />
                  </View>
                  <View className="flex-1">
                    <QuietTextInput 
                      iconName="call-outline"
                      placeholder="(555) 000-0000" 
                      keyboardType="phone-pad" 
                      value={phone} 
                      onChangeText={setPhone} 
                    />
                  </View>
                </View>
              </View>
            )}

            <View className="mb-6">
              <Text className="font-label-caps text-xs font-bold tracking-wider text-on-surface-variant mb-2">PASSWORD</Text>
              <QuietTextInput 
                iconName="lock-closed-outline"
                placeholder="••••••••" 
                secureTextEntry 
                value={password} 
                onChangeText={setPassword} 
              />
            </View>

            <TouchableOpacity 
              className="bg-primary rounded-lg py-4 items-center justify-center flex-row"
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#1c1b1b" /> : (
                <>
                  <Text className="text-on-primary font-semibold text-lg">{isLogin ? 'Sign In' : 'Join Shift'}</Text>
                  {!isLogin && <Ionicons name="arrow-forward" size={18} color="#1c1b1b" className="ml-2 mt-0.5" />}
                </>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="font-body-sm text-on-surface-variant mr-1">{isLogin ? "Don't have an account?" : "Already have an account?"}</Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text className="font-body-sm text-primary font-semibold underline">{isLogin ? "Create an Account" : "Log in"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}