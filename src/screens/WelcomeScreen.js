import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import TextField from '../components/TextField';
import ErrorNotice from '../components/ErrorNotice';
import { loginSchema } from '../lib/validators';
import { useAuth } from '../state/AuthStore';

const WelcomeScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [emailOrUsername, setIdent] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit = async () => {
    setErr(null);
    const parsed = loginSchema.safeParse({ emailOrUsername, password });
    if (!parsed.success)
      return setErr('Please enter your email/username and password.');
    setSubmitting(true);
    try {
      await login(parsed.data);
    } catch (e) {
      setErr(e.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 px-6 py-6 justify-center bg-white dark:bg-neutral-900">
      {/* Header */}
      <Text className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
        Music App
      </Text>
      <Text className="text-base text-neutral-600 dark:text-neutral-300 mb-8">
        Discover music across languages. Log in to continue.
      </Text>

      {/* Error */}
      {/* <ErrorNotice message={err} /> */}

      {/* Login Form */}
      <TextField
        label="Email or username"
        value={emailOrUsername}
        onChangeText={setIdent}
        placeholder="you@example.com or yourname"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      <Button
        title="Log in"
        onPress={onSubmit}
        loading={submitting}
        className="mt-3"
      />

      {/* Divider */}
      <View className="flex-row justify-center mt-6">
        <Text className="text-neutral-600 dark:text-neutral-300 mr-1">
          Don’t have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-emerald-500 font-semibold">Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
