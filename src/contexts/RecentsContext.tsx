// /src/contexts/RecentsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import {
  RecentChannel
} from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecentsContextType {
  recents: RecentChannel[];
  addRecent: (channel: Omit < RecentChannel, 'watchedAt' > ) => void;
  clearRecents: () => void;
}

const RecentsContext = createContext < RecentsContextType | undefined > (undefined);

const STORAGE_KEY = 'iptv-recents';

export const useRecents = () => {
  const context = useContext(RecentsContext);
  if (!context) {
    throw new Error('useRecents must be used within a RecentsProvider');
  }
  return context;
};

export const RecentsProvider: React.FC < {
  children: ReactNode
} > = ({
  children
}) => {
  const [recents, setRecents] =useState < RecentChannel[] > ([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recents from AsyncStorage on mount
  useEffect(() => {
    const loadRecents = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setRecents(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading recents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecents();
  }, []);

  // Save recents to AsyncStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recents)).catch(error =>
        console.error('Error saving recents:', error),
      );
    }
  }, [recents, isLoading]);

  const addRecent = (channel: Omit < RecentChannel, 'watchedAt' > ) => {
    const newRecent: RecentChannel = {
      ...channel,
      watchedAt: Date.now(),
    };

    setRecents(prev => {
      const filtered = prev.filter(recent => recent.id !== channel.id);
      return [newRecent, ...filtered].slice(0, 20);
    });
  };

  const clearRecents = () => {
    setRecents([]);
  };

  return (
    <RecentsContext.Provider
      value={{
        recents,
        addRecent,
        clearRecents,
      }}>
      {!isLoading && children}
    </RecentsContext.Provider>
  );
};
