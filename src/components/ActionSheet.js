// components/ActionSheet.js
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { useColorScheme } from 'react-native';

export default function ActionSheet({ visible, item, onClose }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  if (!visible || !item) return null;

  const actions = [
    { label: 'Play', icon: '▶️' },
    { label: 'Add to Playlist', icon: '➕' },
    { label: 'Play Next', icon: '⏭️' },
    { label: 'Add to Library', icon: '❤️' },
    { label: 'Delete', icon: '🗑️' },
  ];

  const bg = isDark ? '#1c1c1e' : '#f8f8f8';

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40" />
      </TouchableWithoutFeedback>

      <View
        style={{
          backgroundColor: bg,
          padding: 16,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Text className="text-lg font-bold mb-3 text-center">
          {item.name}
        </Text>

        {actions.map(a => (
          <Pressable
            key={a.label}
            onPress={() => {
              console.log(`${a.label} -> ${item.name}`);
              onClose?.();
            }}
            className="py-3 border-b border-neutral-300 dark:border-neutral-700"
          >
            <Text
              className={`text-base ${
                a.label === 'Delete'
                  ? 'text-red-500'
                  : 'text-neutral-900 dark:text-neutral-100'
              }`}
            >
              {a.icon} {a.label}
            </Text>
          </Pressable>
        ))}

        <Pressable onPress={onClose} className="py-4">
          <Text className="text-center text-neutral-500">Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
