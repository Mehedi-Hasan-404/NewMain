// /src/components/ui/theme-provider.tsx
// This is a native-compatible provider
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
import {
  useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext < ThemeProviderState > (initialState);

export const ThemeProvider = ({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState < Theme > (defaultTheme);

  useEffect(() => {
    const getTheme = async () => {
      try {
        const storedTheme = (await AsyncStorage.getItem(storageKey)) as Theme | null;
        if (storedTheme) {
          setTheme(storedTheme);
        } else {
          setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        }
      } catch (e) {
        // ignore
      }
    };
    getTheme();
  }, [colorScheme, storageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      AsyncStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
