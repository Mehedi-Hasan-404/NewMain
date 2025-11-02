// /src/navigation/MainTabNavigator.tsx
import React from 'react';
import {
  Platform,
  Pressable,
} from 'react-native';
import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import {
  Home,
  Star
} from 'lucide-react-native';
import HomeScreen from '@/screens/HomeScreen';
import FavoritesScreen from '@/screens/FavoritesScreen';

const Tab = createBottomTabNavigator();
const isTV = Platform.isTV;

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({
        route
      }) => ({
        headerShown: false,
        tabBarIcon: ({
          color,
          size,
          focused
        }) => {
          let IconComponent = Home;
          if (route.name === 'Home') {
            IconComponent = Home;
          } else if (route.name === 'Favorites') {
            IconComponent = Star;
          }
          return <IconComponent color={color} size={size} fill={focused ? color : 'none'} />;
        },
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: '#71717a',
        tabBarStyle: {
          backgroundColor: '#18181b',
          borderTopColor: '#27272a',
          display: isTV ? 'none' : 'flex', // Hide bottom tabs on TV
        },
        // TV-specific focus styling for tabs
        tabBarButton: isTV ? (props) => (
          <Pressable 
            {...props} 
            style={({ focused }: any) => [
              props.style, 
              {
                backgroundColor: focused ? '#27272a' : 'transparent',
                borderRadius: 8,
                margin: 4,
                padding: 8
              }
            ]} 
          />
        ) : undefined,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
};
