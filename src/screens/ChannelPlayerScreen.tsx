// /src/screens/ChannelPlayerScreen.tsx
import React, {
  useEffect,
  useState
} from 'react';
import {
  View,
  Text,
  Platform,
  Pressable
} from 'react-native';
import VideoPlayer from '@/components/VideoPlayer';
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
  SafeAreaView
} from 'react-native-safe-area-context';
import {
  useRecents
} from '@/contexts/RecentsContext';
import {
  useFavorites
} from '@/contexts/FavoritesContext';
import {
  ArrowLeft,
  Star
} from 'lucide-react-native';
import {
  cn
} from '@/lib/utils';

type Props = StackScreenProps < RootStackParamList, 'ChannelPlayer' > ;
const isTV = Platform.isTV;

const ChannelPlayerScreen = () => {
  const route = useRoute < Props['route'] > ();
  const navigation = useNavigation < any > ();
  const {
    channel
  } = route.params;

  const {
    addRecent
  } = useRecents();
  const {
    addFavorite,
    removeFavorite,
    isFavorite
  } = useFavorites();
  const [showControls, setShowControls] = useState(true);

  const isFav = isFavorite(channel.id);

  // Add to recents on mount
  useEffect(() => {
    addRecent(channel);
  }, [channel, addRecent]);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(channel.id);
    } else {
      addFavorite(channel);
    }
  };

  // Hide controls on TV after a delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTV) {
      timer = setTimeout(() => setShowControls(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showControls]);

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1">
        <View className="w-full h-full">
          {/* Video Player takes up the whole screen */}
          <VideoPlayer streamUrl={channel.streamUrl} channelName={channel.name} />

          {/* Custom Controls Overlay */}
          <View
            className="absolute top-0 left-0 right-0 p-4"
            style={{
              opacity: isTV ? (showControls ? 1 : 0) : 1
            }}>
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => navigation.goBack()}
                className={cn(
                  "flex-row items-center gap-2 p-2",
                  isTV && "p-3 bg-black/50 rounded-lg focus:bg-accent"
                )}>
                <ArrowLeft size={24} className="text-white" />
                <Text className="text-white text-lg font-bold" numberOfLines={1}>
                  {channel.name}
                </Text>
              </Pressable>

              <Pressable
                onPress={toggleFavorite}
                className={cn(
                  "p-2",
                  isTV && "p-3 bg-black/50 rounded-lg focus:bg-accent"
                )}>
                <Star
                  size={28}
                  className={isFav ? "text-yellow-500" : "text-white"}
                  fill={isFav ? "#facc15" : "none"}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ChannelPlayerScreen;
