// App.tsx
import React from 'react';
import {
  StatusBar,
  useColorScheme
} from 'react-native';
import {
  NavigationContainer
} from '@react-navigation/native';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import {
  FavoritesProvider
} from '@/contexts/FavoritesContext';
import {
  RecentsProvider
} from '@/contexts/RecentsContext';
import {
  AppNavigator
} from '@/navigation/AppNavigator';
import {
  ThemeProvider
} from '@/components/ui/theme-provider';

const queryClient = new QueryClient();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="iptv-ui-theme">
        <FavoritesProvider>
          <RecentsProvider>
            <NavigationContainer>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent={true}
              />
              <AppNavigator />
              {/* Add your native Toaster provider here if needed */}
            </NavigationContainer>
          </RecentsProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
