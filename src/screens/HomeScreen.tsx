// /src/screens/HomeScreen.tsx
import React, {
  useState,
  useEffect
} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
  Pressable
} from 'react-native';
import {
  collection,
  getDocs
} from 'firebase/firestore';
import {
  db
} from '@/lib/firebase';
import {
  Category
} from '@/types';
import CategoryCard from '@/components/CategoryCard';
import {
  AlertCircle,
  Tv,
  Sparkles,
  Star
} from 'lucide-react-native';
import {
  SafeAreaView
} from 'react-native-safe-area-context';
import {
  useNavigation
} from '@react-navigation/native';
import {
  cn
} from '@/lib/utils';

const isTV = Platform.isTV;

const HomeScreen = () => {
  const [categories, setCategories] = useState < Category[] > ([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState < string | null > (null);
  const {
    width
  } = useWindowDimensions();
  const navigation = useNavigation < any > ();

  // Determine number of columns
  const getNumColumns = () => {
    if (!isTV) {
      return 2; // 2 columns for phones
    }
    // For TV, calculate columns based on width
    if (width > 1500) return 5;
    if (width > 1000) return 4;
    return 3;
  };

  const numColumns = getNumColumns();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesCol = collection(db, 'categories');
      const snapshot = await getDocs(categoriesCol);
      let categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      categoriesData.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return a.name.localeCompare(b.name);
      });
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="hsl(var(--primary))" />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background p-4 justify-center items-center">
        <View className="p-4 bg-destructive/10 rounded-lg flex-row items-center">
          <AlertCircle className="text-destructive mr-2" />
          <Text className="text-destructive">{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const Header = () => (
    <View>
      {/* TV-only Header Bar */}
      {isTV && (
        <View className="w-full flex-row justify-between items-center mb-6 p-4 bg-card rounded-lg">
          <View className="flex-row items-center gap-3">
            <Tv size={28} className="text-primary" />
            <Text className="text-3xl font-bold text-foreground">
              Live TV Pro
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Favorites')}
            className="flex-row items-center gap-2 p-3 bg-accent rounded-lg focus:bg-primary focus:scale-105">
            <Star size={20} className="text-foreground focus:text-primary-foreground" />
            <Text className="text-lg text-foreground focus:text-primary-foreground">Favorites</Text>
          </Pressable>
        </View>
      )}
      {/* Phone-only Header */}
      {!isTV && (
        <View className="items-center space-y-4 mb-6">
          <View className="flex-row items-center justify-center gap-3">
            <Tv size={28} className="text-accent" />
            <Text className="text-3xl font-bold text-foreground">
              Live TV Pro
            </Text>
            <Sparkles size={24} className="text-yellow-500" />
          </View>
        </View>
      )}

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-semibold text-foreground">
          Browse Categories
        </Text>
        <Text className="text-sm text-muted-foreground">
          {categories.length} {categories.length !== 1 ? 'categories' : 'category'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={categories}
        key={numColumns} // Re-renders the list if numColumns changes
        numColumns={numColumns}
        ListHeaderComponent={Header}
        renderItem={({
          item
        }) => (
          <View style={{
            flex: 1 / numColumns,
            padding: isTV ? 8 : 4
          }}>
            <CategoryCard category={item} />
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          padding: isTV ? 24 : 16
        }}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Tv size={48} className="text-muted-foreground mb-4" />
            <Text className="text-lg font-semibold mb-2 text-foreground">
              No Categories Available
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
