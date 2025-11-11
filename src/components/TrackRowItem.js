// components/TrackRowItem.js
import React, { memo } from 'react';
import { Pressable, View, Text, Platform, StyleSheet } from 'react-native';
import { formatDuration } from '../lib/format';

function Item({ index, title, subtitle, durationMs, onPress, onLongPress }) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
      style={styles.row}
    >
      <Text style={styles.index}>{index}.</Text>
      <View style={styles.texts}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        {!!subtitle && (
          <Text numberOfLines={1} style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
      {!!durationMs && (
        <Text style={styles.duration}>{formatDuration(durationMs)}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  index: {
    width: 28,
    color: '#9CA3AF', // neutral-400
    fontVariant: ['tabular-nums'],
  },
  texts: { flex: 1, paddingRight: 8 },
  title: { color: '#F5F5F5', fontWeight: '600' },
  subtitle: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  duration: {
    color: '#9CA3AF',
    fontVariant: ['tabular-nums'],
    marginLeft: 8,
  },
});

export default memo(Item);
