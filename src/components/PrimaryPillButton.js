// components/PrimaryPillButton.js
import React from 'react';
import { Pressable, Text, ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

export default function PrimaryPillButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  left = null, // optional icon element
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: 'rgba(0,0,0,0.12)', borderless: false }}
      style={({ pressed }) => [
        styles.base,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.row}>
          {left ? <View style={styles.left}>{left}</View> : null}
          <Text style={[styles.text, textStyle]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: '#10B981', // emerald-500
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  pressed: {
    opacity: Platform.OS === 'ios' ? 0.85 : 1,
    transform: [{ scale: Platform.OS === 'ios' ? 0.998 : 1 }],
  },
  disabled: { opacity: 0.5 },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  left: { marginRight: 8 },
});
