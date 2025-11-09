import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import TextField from '../components/TextField';
import ErrorNotice from '../components/ErrorNotice';
import { registerSchema } from '../lib/validators';
import { useAuth } from '../state/AuthStore';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit = async () => {
    setErr(null);
    console.log('password', password);
    console.log('confirm pass', confirmPassword);
    const parsed = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return setErr(firstIssue?.message || 'Please check your inputs.');
    }

    setSubmitting(true);
    try {
      console.log(parsed);
      await register(parsed.data);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e.message ||
        'Registration failed. Please try again.';
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 px-6 py-6 bg-white dark:bg-neutral-900 justify-center">
      <Text className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        Create your account
      </Text>
      <ErrorNotice message={err} />
      <View className="flex-row gap-x-4">
        <View className="flex-1">
          <TextField
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
          />
        </View>
        <View className="flex-1">
          <TextField
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Doe"
          />
        </View>
      </View>
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
      />
      <TextField
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="yourname"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
      />
      <Text className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
        Password must have 8+ chars, 1 uppercase, 1 number, 1 special char
      </Text>
      <TextField
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        secureTextEntry
      />
      <Button
        title="Create account"
        onPress={onSubmit}
        loading={submitting}
        className="mt-2"
      />
      <View className="flex-row justify-center mt-6">
        <Text className="text-neutral-600 dark:text-neutral-300 mr-1">
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
          <Text className="text-emerald-500 font-semibold">Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
