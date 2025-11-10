import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorNotice from '../components/ErrorNotice';
import { registerSchema } from '../lib/validators';
import { useAuth } from '../state/AuthStore';
import { toast } from '../lib/toast';

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

  // refs for hopping
  const lastRef = useRef(null);
  const emailRef = useRef(null);
  const userRef = useRef(null);
  const passRef = useRef(null);
  const cpassRef = useRef(null);

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
      const msg = firstIssue?.message || 'Please check your inputs.';
      setErr(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    try {
      console.log(parsed);
      await register(parsed.data);
      // Success: auth store will set user & nav will flip; toast is optional here
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
      <Text className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        Create your account
      </Text>
      {/* <ErrorNotice message={err} /> */}

      <View className="flex-row gap-x-4">
        <View className="flex-1">
          <TextField
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
            returnKeyType="next"
            onSubmitEditing={() => lastRef.current?.focus()}
            textContentType="givenName"
          />
        </View>
        <View className="flex-1">
          <TextField
            ref={lastRef}
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Doe"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            textContentType="familyName"
          />
        </View>
      </View>

      <TextField
        ref={emailRef}
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => userRef.current?.focus()}
        autoCapitalize="none"
        textContentType="emailAddress"
      />
      <TextField
        ref={userRef}
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="yourname"
        returnKeyType="next"
        onSubmitEditing={() => passRef.current?.focus()}
        autoCapitalize="none"
        textContentType="username"
      />
      <TextField
        ref={passRef}
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        returnKeyType="next"
        onSubmitEditing={() => cpassRef.current?.focus()}
        textContentType="newPassword"
      />
      <Text className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
        Password must have 8+ chars, 1 uppercase, 1 number, 1 special char
      </Text>
      <TextField
        ref={cpassRef}
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        textContentType="oneTimeCode" // avoids iOS auto-fill weirdness; can omit
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
    </KeyboardAwareScrollView>
  );
};

export default RegisterScreen;
