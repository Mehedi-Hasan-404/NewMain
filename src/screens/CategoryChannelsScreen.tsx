// /src/screens/CategoryChannelsScreen.tsx
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
  query,
  where,
  getDocs
} from 'firebase/firestore';
import {
  db
} from '@/lib/firebase';
import {
  Channel
} from '@/types';
import ChannelCard from '@/components/ChannelCard';
import {
  AlertCircle,
  ArrowLeft,
  Tv
} from 'lucide-react-native';
import {
  SafeAreaView
} from 'react-native-safe-area-context';
import {
  useRoute,
  useNavigation
} from '@react-navigation/native';
import {
  RootStackParamList
} from '@/navigation/AppNavigator';
import {
  StackScreenProps
} from '@react-navigation/stack';
import {
  cn
} from '@/lib/utils';

type Props = StackScreenProps < RootStackParamList, 'CategoryChannels' > ;

const isTV = Platform.isTV;

const CategoryChannelsScreen = () => {
  const route = useRoute < Props['route'] > ();
  const navigation = useNavigation < any > ();
  const {
    slug,
    title
  } = route.params;

  const [channels, setChannels] = useState < Channel[] > ([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState < string | null > (null);
  const {
    width
  } = useWindowDimensions();

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

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        setError(null);
        const q = query(collection(db, 'channels'), where('categorySlug', '==', slug));
        const snapshot = await getDocs(q);
        const channelsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Channel[];
        setChannels(channelsData);
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError('Failed to load channels.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [slug]);

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

      <Text className="text-3xl font-bold text-foreground" numberOfLines={1}>
        {title}
      </Text>

      <View style={{
        width: 80
      }} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={channels}
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
            <Tv size={48} className="text-muted-foreground mb-4" />
            <Text className="text-lg font-semibold mb-2 text-foreground">
              No Channels Found
            </Text>
            <Text className="text-muted-foreground text-center">
              There are no channels in this category yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CategoryChannelsScreen;
