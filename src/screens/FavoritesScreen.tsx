// /src/screens/FavoritesScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Platform,
  useWindowDimensions,
  Pressable
} from 'react-native';
import {
  useFavorites
} from '@/contexts/FavoritesContext';
import ChannelCard from '@/components/ChannelCard';
import {
  Star,
  ArrowLeft
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

const FavoritesScreen = () => {
  const {
    favorites
  } = useFavorites();
  const navigation = useNavigation < any > ();
  const {
    width
  } = useWindowDimensions();

  // Sort by most recently added
  const sortedFavorites = [...favorites].sort((a, b) => b.addedAt - a.addedAt);

  // Determine number of columns
  const getNumColumns = () => {
    if (!isTV) {
      return 1; // 1 column list for phones
    }
    // For TV, use a grid
    if (width > 1500) return 4;
    if (width > 1000) return 3;
    return 2;
  };

  const numColumns = getNumColumns();

  const Header = () => (
    <View className="flex-row items-center justify-between mb-6">
      <Pressable
        onPress={() => navigation.goBack()}
        className={cn(
          "flex-row items-center gap-2 p-2 -ml-2",
          isTV && "p-3 bg-card rounded-lg focus:bg-accent"
        )}>
        <ArrowLeft size={24} className="text-foreground" />
        {isTV && <Text className="text-lg text-foreground">Back</Text>}
      </Pressable>
      <View className="flex-row items-center gap-2">
        <Star size={28} className="text-yellow-500" fill="#facc15" />
        <Text className="text-3xl font-bold text-foreground">
          Favorites
        </Text>
      </View>
      <View style={{
        width: 80
      }} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={sortedFavorites}
        key={numColumns}
        numColumns={numColumns}
        ListHeaderComponent={Header}
        renderItem={({
          item
        }) => (
          <View style={{
            flex: 1 / numColumns,
            padding: isTV ? 8 : 4
          }}>
            <ChannelCard channel={item} />
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          padding: isTV ? 24 : 16
        }}
        ListEmptyComponent={
          <View className="items-center py-24">
            <Star size={48} className="text-muted-foreground mb-4" />
            <Text className="text-lg font-semibold mb-2 text-foreground">
              No Favorites Yet
            </Text>
            <Text className="text-muted-foreground text-center">
              Add channels to your favorites to see them here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default FavoritesScreen;
