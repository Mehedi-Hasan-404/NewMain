// /src/components/CategoryCard.tsx
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
  Category
} from '@/types';
import {
  Tv
} from 'lucide-react-native';
import {
  useNavigation
} from '@react-navigation/native';
import {
  cn
} from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
}

const isTV = Platform.isTV;

const CategoryCard: React.FC < CategoryCardProps > = ({
  category
}) => {
  const navigation = useNavigation < any > ();
  const [hasError, setHasError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    navigation.navigate('CategoryChannels', {
      slug: category.slug,
      title: category.name
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "w-full mb-4 rounded-xl bg-card border border-border p-4 transition-transform duration-200",
        isFocused && "bg-accent scale-105 border-primary", // TV focus style
        !isTV && "active:opacity-80 active:scale-95" // Phone touch style
      )}>
      <View className="flex-col items-center gap-3">
        <View className="w-20 h-20 rounded-full bg-accent/10 justify-center items-center">
          {category.iconUrl && !hasError ? (
            <Image
              source={{
                uri: category.iconUrl
              }}
              className="w-16 h-16 object-contain rounded-full"
              onError={() => setHasError(true)}
              resizeMode="contain"
            />
          ) : (
            <Tv size={32} className={cn("text-accent", isFocused && "text-primary-foreground")} />
          )}
        </View>
        <Text
          className={cn("text-sm font-semibold text-center text-foreground", isFocused && "text-primary-foreground")}
          numberOfLines={1}>
          {category.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default CategoryCard;
