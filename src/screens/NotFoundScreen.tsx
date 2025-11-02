// /src/screens/NotFoundScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Pressable
} from 'react-native';
import {
  SafeAreaView
} from 'react-native-safe-area-context';
import {
  useNavigation
} from '@react-navigation/native';
import {
  AlertTriangle,
  Home
} from 'lucide-react-native';
import {
  cn
} from '@/lib/utils';

const NotFoundScreen = () => {
  const navigation = useNavigation < any > ();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center p-4">
        <View className="items-center">
          <AlertTriangle size={64} className="text-destructive mb-6" />
          <Text className="text-4xl font-bold text-foreground mb-2">
            404
          </Text>
          <Text className="text-xl font-semibold text-foreground mb-4">
            Page Not Found
          </Text>
          <Text className="text-lg text-muted-foreground text-center mb-8">
            Sorry, the page you are looking for does not exist.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Home')}
            className={cn(
              "flex-row items-center justify-center gap-2 h-12 px-6 rounded-md bg-primary",
              "focus:bg-accent focus:scale-105",
              "active:scale-95"
            )}>
            <Home size={18} className="text-primary-foreground" />
            <Text className="text-lg font-medium text-primary-foreground">
              Go to Homepage
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotFoundScreen;
