import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from '../components/Button';
import TextField from '../components/TextField';
import ErrorNotice from '../components/ErrorNotice';
import { loginSchema } from '../lib/validators';
import { useAuth } from '../state/AuthStore';
import { toast } from '../lib/toast';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [emailOrUsername, setIdent] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passRef = useRef(null);

  const onSubmit = async () => {
    const parsed = loginSchema.safeParse({ emailOrUsername, password });
    if (!parsed.success) {
      toast.error('Please enter your email/username and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(parsed.data);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Login failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white dark:bg-neutral-900"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingVertical: 24,
        paddingBottom: 40,
      }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      enableAutomaticScroll
      extraScrollHeight={Platform.select({ ios: 20, android: 32 })}
      extraHeight={Platform.select({ ios: 0, android: 80 })}
    >
      <SafeAreaView className="flex-col justify-center h-screen">
        <Text className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
          Music App
        </Text>
        <Text className="text-base text-neutral-600 dark:text-neutral-300 mb-8">
          Discover music across languages. Log in to continue.
        </Text>
        {/* Optional inline error */}
        {/* <ErrorNotice message={err} /> */}
        <TextField
          label="Email or username"
          value={emailOrUsername}
          onChangeText={setIdent}
          placeholder="you@example.com or yourname"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passRef.current?.focus()}
          textContentType="username"
        />
        <TextField
          ref={passRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          textContentType="password"
        />
        <Button
          title="Log in"
          onPress={onSubmit}
          loading={submitting}
          className="mt-3"
        />
        <View className="flex-row justify-center mt-6">
          <Text className="text-neutral-600 dark:text-neutral-300 mr-1">
            Don’t have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-emerald-500 font-semibold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default WelcomeScreen;
