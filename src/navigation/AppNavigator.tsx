// /src/navigation/AppNavigator.tsx
import React from 'react';
import {
  createStackNavigator
} from '@react-navigation/stack';
import {
  MainTabNavigator
} from './MainTabNavigator';
import CategoryChannelsScreen from '@/screens/CategoryChannelsScreen';
import ChannelPlayerScreen from '@/screens/ChannelPlayerScreen';
import NotFoundScreen from '@/screens/NotFoundScreen';
import {
  Channel
} from '@/types';

// Define stack param types
export type RootStackParamList = {
  MainTabs: undefined;
  CategoryChannels: {
    slug: string;
    title: string;
  };
  ChannelPlayer: {
    channel: Channel
  };
  NotFound: undefined;
};


const Stack = createStackNavigator < RootStackParamList > ();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="CategoryChannels" component={CategoryChannelsScreen} />
      <Stack.Screen name="ChannelPlayer" component={ChannelPlayerScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
};
