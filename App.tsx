import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface User {
  name: string;
  email: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'home'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Registered users map (seeded with demo user)
  const [users, setUsers] = useState<Record<string, { name: string; password: string }>>({
    'user@test.com': {
      name: 'Default User',
      password: 'Password123!',
    },
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleLogin = () => {
    setLoginError('');
    const trimmedEmail = loginEmail.trim().toLowerCase();

    if (!trimmedEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    const existingUser = users[trimmedEmail];
    if (!existingUser || existingUser.password !== loginPassword) {
      setLoginError('Invalid email or password.');
      return;
    }

    setCurrentUser({
      name: existingUser.name,
      email: trimmedEmail,
    });
    setLoginEmail('');
    setLoginPassword('');
    setCurrentScreen('home');
  };

  const handleSignup = () => {
    setSignupError('');
    const trimmedName = signupName.trim();
    const trimmedEmail = signupEmail.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !signupPassword) {
      setSignupError('Please fill in all fields.');
      return;
    }

    if (users[trimmedEmail]) {
      setSignupError('An account with this email already exists.');
      return;
    }

    // Save user
    setUsers((prev) => ({
      ...prev,
      [trimmedEmail]: {
        name: trimmedName,
        password: signupPassword,
      },
    }));

    setCurrentUser({
      name: trimmedName,
      email: trimmedEmail,
    });
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    setLoginError('');
    setSignupError('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {currentScreen === 'login' && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            testID="login-screen"
            accessibilityLabel="login-screen"
          >
            <View style={styles.card}>
              <Text
                style={styles.title}
                testID="login-title"
                accessibilityLabel="login-title"
              >
                Welcome Back
              </Text>
              <Text style={styles.subtitle}>Sign in to continue to your account</Text>

              {!!loginError && (
                <Text
                  style={styles.errorText}
                  testID="login-error-text"
                >
                  {loginError}
                </Text>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  placeholderTextColor="#94a3b8"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  testID="login-email-input"
                  accessibilityLabel="login-email-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor="#94a3b8"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry
                  textContentType="oneTimeCode"
                  autoComplete="off"
                  testID="login-password-input"
                  accessibilityLabel="login-password-input"
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLogin}
                testID="login-submit-button"
                accessibilityLabel="login-submit-button"
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    setLoginError('');
                    setCurrentScreen('signup');
                  }}
                  testID="goto-signup-button"
                  accessibilityLabel="goto-signup-button"
                >
                  <Text style={styles.linkText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {currentScreen === 'signup' && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            testID="signup-screen"
            accessibilityLabel="signup-screen"
          >
            <View style={styles.card}>
              <Text
                style={styles.title}
                testID="signup-title"
                accessibilityLabel="signup-title"
              >
                Create Account
              </Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>

              {!!signupError && (
                <Text
                  style={styles.errorText}
                  testID="signup-error-text"
                >
                  {signupError}
                </Text>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  placeholderTextColor="#94a3b8"
                  value={signupName}
                  onChangeText={setSignupName}
                  autoCorrect={false}
                  autoCapitalize="words"
                  testID="signup-name-input"
                  accessibilityLabel="signup-name-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  placeholderTextColor="#94a3b8"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  testID="signup-email-input"
                  accessibilityLabel="signup-email-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create password"
                  placeholderTextColor="#94a3b8"
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                  secureTextEntry
                  textContentType="oneTimeCode"
                  autoComplete="off"
                  testID="signup-password-input"
                  accessibilityLabel="signup-password-input"
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignup}
                testID="signup-submit-button"
                accessibilityLabel="signup-submit-button"
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSignupError('');
                    setCurrentScreen('login');
                  }}
                  testID="goto-login-button"
                  accessibilityLabel="goto-login-button"
                >
                  <Text style={styles.linkText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {currentScreen === 'home' && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            testID="home-screen"
            accessibilityLabel="home-screen"
          >
            <View style={styles.card}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>

              <Text
                style={styles.title}
                testID="home-welcome-title"
                accessibilityLabel="home-welcome-title"
              >
                Welcome Home!
              </Text>
              <Text style={styles.subtitle}>You are successfully authenticated</Text>

              <View style={styles.profileSection}>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Name</Text>
                  <Text
                    style={styles.profileValue}
                    testID="home-user-name"
                  >
                    {currentUser?.name || ''}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Email</Text>
                  <Text
                    style={styles.profileValue}
                    testID="home-user-email"
                  >
                    {currentUser?.email || ''}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                testID="logout-button"
                accessibilityLabel="logout-button"
                activeOpacity={0.8}
              >
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#fee2e2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  linkText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },
  profileSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  profileRow: {
    paddingVertical: 6,
  },
  profileLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
});
