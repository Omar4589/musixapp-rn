// components/TrackRow.js
import { View, Text, FlatList } from 'react-native';
import TrackCard from './TrackCard';

export default function TrackRow({ title, items = [], onPress, onLongPress }) {
  if (!items?.length) return null;

  return (
    <View className="mb-8">
      <Text className="text-xl font-extrabold mb-4 tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={t => t.id}
        contentContainerStyle={{ paddingRight: 24 }}
        renderItem={({ item }) => (
          <TrackCard item={item} onPress={onPress} onLongPress={onLongPress} />
        )}
      />
    </View>
  );
}
