// /src/contexts/FavoritesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import {
  FavoriteChannel
} from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { toast } from 'sonner-react-native'; // Use a native toast library

interface FavoritesContextType {
  favorites: FavoriteChannel[];
  addFavorite: (channel: Omit < FavoriteChannel, 'addedAt' > ) => void;
  removeFavorite: (channelId: string) => void;
  isFavorite: (channelId: string) => boolean;
}

const FavoritesContext = createContext < FavoritesContextType | undefined > (undefined);

const STORAGE_KEY = 'iptv-favorites';

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC < {
  children: ReactNode
} > = ({
  children
}) => {
  const [favorites, setFavorites] = useState < FavoriteChannel[] > ([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(error =>
        console.error('Error saving favorites:', error),
      );
    }
  }, [favorites, isLoading]);

  const addFavorite = (channel: Omit < FavoriteChannel, 'addedAt' > ) => {
    const newFavorite: FavoriteChannel = {
      ...channel,
      addedAt: Date.now(),
    };
    setFavorites(prev => [...prev.filter(fav => fav.id !== channel.id), newFavorite]);
    // toast.success("Added to favorites");
  };

  const removeFavorite = (channelId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== channelId));
    // toast.info("Removed from favorites");
  };

  const isFavorite = (channelId: string) => {
    return favorites.some(fav => fav.id === channelId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}>
      {!isLoading && children}
    </FavoritesContext.Provider>
  );
};
