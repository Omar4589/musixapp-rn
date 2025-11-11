import { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Button from '../components/Button';
import Chip from '../components/Chip';
import { useAuth } from '../state/AuthStore';
import { toast } from '../lib/toast';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'ja', label: 'Japanese' },
];

const GENRES = [
  'pop',
  'hiphop',
  'rock',
  'rnb',
  'latin',
  'jpop',
  'kpop',
  'edm',
  'indie',
];

export default function PreferencesScreen({ navigation }) {
  const { user, updatePreferences } = useAuth();
  const [langs, setLangs] = useState(
    user?.preferences?.preferredLanguages ?? [],
  );
  const [genres, setGenres] = useState(user?.preferences?.genres ?? []);
  const [saving, setSaving] = useState(false);

  const deviceLangDefault = useMemo(() => {
    const device =
      (typeof navigator !== 'undefined' && navigator?.language) || '';
    if (!langs?.length && device) {
      const lc = device.toLowerCase().startsWith('es')
        ? 'es'
        : device.toLowerCase().startsWith('ja')
        ? 'ja'
        : device.toLowerCase().startsWith('en')
        ? 'en'
        : null;
      return LANGS.find(l => l.code === lc) ? lc : null;
    }
    return null;
  }, [langs]);

  const currentLangs =
    langs.length === 0 && deviceLangDefault ? [deviceLangDefault] : langs;

  const toggleLang = code => {
    const set = new Set(currentLangs);
    if (set.has(code)) {
      set.delete(code);
      setLangs([...set]);
    } else {
      if (set.size >= 3) {
        toast.info('Pick up to 3 languages.');
        return;
      }
      set.add(code);
      setLangs([...set]);
    }
  };

  const toggleGenre = g => {
    const set = new Set(genres);
    if (set.has(g)) set.delete(g);
    else set.add(g);
    setGenres([...set]);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await updatePreferences({ preferredLanguages: currentLangs, genres });
      toast.success('Preferences saved.');
      navigation.goBack();
    } catch (e) {
      toast.error('Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-900 px-6 py-6">
      <Text className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        Preferences
      </Text>

      <Text className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        Preferred Languages (max 3)
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {LANGS.map(l => (
          <Chip
            key={l.code}
            label={l.label}
            selected={currentLangs.includes(l.code)}
            onPress={() => toggleLang(l.code)}
          />
        ))}
      </View>

      <Text className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
        Genres (optional)
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {GENRES.map(g => (
          <Chip
            key={g}
            label={g.toUpperCase()}
            selected={genres.includes(g)}
            onPress={() => toggleGenre(g)}
          />
        ))}
      </View>

      <Button title="Save" onPress={onSave} loading={saving} />
    </ScrollView>
  );
}
