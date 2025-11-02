// /src/components/ChannelCard.tsx
import React, {
  useState
} from 'react';
import {
  Text,
  View,
  Image,
  Pressable,
  Platform
} from 'react-native';
import {
  Channel
} from '@/types';
import {
  Tv2
} from 'lucide-react-native';
import {
  useNavigation
} from '@react-navigation/native';
import {
  cn
} from '@/lib/utils';

interface ChannelCardProps {
  channel: Channel;
}

const isTV = Platform.isTV;

const ChannelCard: React.FC < ChannelCardProps > = ({
  channel
}) => {
  const navigation = useNavigation < any > ();
  const [hasError, setHasError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    navigation.navigate('ChannelPlayer', {
      channel: channel
    });
  };

  const placeholderLogo =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXR2LTIiPjxwYXRoIGQ9Ik03IDcgMTcgMTciLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHg9IjIiIHk9IjQiIHJ4PSIyIiByeT0iMiIvPjwvc3ZnPg==';

  return (
    <Pressable
      onPress={handlePress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "w-full mb-4 rounded-lg bg-card border border-border p-3 transition-transform duration-200",
        isFocused && "bg-accent scale-105 border-primary", // TV focus style
        !isTV && "active:opacity-80 active:scale-95" // Phone touch style
      )}>
      <View className="flex-row items-center gap-4">
        <View className="w-16 h-16 rounded-md bg-accent/10 justify-center items-center overflow-hidden">
          {channel.logoUrl && !hasError ? (
            <Image
              source={{
                uri: channel.logoUrl
              }}
              className="w-full h-full"
              onError={() => setHasError(true)}
              resizeMode="contain"
            />
          ) : (
            <Tv2 size={24} className={cn("text-accent", isFocused && "text-primary-foreground")} />
          )}
        </View>
        <Text
          className={cn("text-base font-medium text-foreground flex-1", isFocused && "text-primary-foreground")}
          numberOfLines={2}>
          {channel.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default ChannelCard;
