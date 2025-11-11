import { Pressable, Text } from 'react-native';

export default function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-1.5 rounded-full border ${
        selected
          ? 'bg-emerald-500 border-emerald-500'
          : 'bg-transparent border-neutral-300 dark:border-neutral-700'
      }`}
    >
      <Text className={`${selected ? 'text-white' : 'text-neutral-800 dark:text-neutral-100'} text-xs font-semibold`}>
        {label}
      </Text>
    </Pressable>
  );
}
