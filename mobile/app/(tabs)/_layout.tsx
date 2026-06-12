import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false, // Hides the default top header
      tabBarStyle: { 
        backgroundColor: '#1c1b1b', // Dark surface color
        borderTopColor: '#2a2a2a', // Subtle top border
        height: 85,
        paddingBottom: 25,
        paddingTop: 10,
      },
      tabBarActiveTintColor: '#ffffff', // White when selected
      tabBarInactiveTintColor: '#8f9194', // Gray when unselected
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons name="compass" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'My Route',
          tabBarIcon: ({ color }) => <Ionicons name="car" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}