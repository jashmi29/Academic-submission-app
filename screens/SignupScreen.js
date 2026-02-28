/**
 * SignupScreen.js
 * Screen for user registration with premium aesthetic UI
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { saveUserData } from '../utils/storage';

const SignupScreen = ({ navigation }) => {
  // State for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for loading
  const [loading, setLoading] = useState(false);
  
  // State for error messages
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Get app context
  const { setUserData } = useApp();

  /**
   * Validate form input
   * @returns {boolean} True if valid, false otherwise
   */
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
    };

    // Validate username
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handle signup button press
   */
  const handleSignup = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create user data object
      const userData = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      // Save user data to AsyncStorage
      const result = await saveUserData(userData);

      if (result.success) {
        // Set user in app context
        setUserData(userData);
        
        Alert.alert(
          'Success',
          'Account created successfully!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6C63FF', '#4A47A3']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>A</Text>
              </View>
              <Text style={styles.appTitle}>ACADEMIC</Text>
              <Text style={styles.appSubtitle}>Create your account</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Create Account</Text>
              <Text style={styles.formSubtitle}>Sign up to get started</Text>

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholder="Enter your username"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.username ? (
                  <Text style={styles.errorText}>{errors.username}</Text>
                ) : null}
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              {/* Signup Button */}
              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleSignup}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#6C63FF', '#4A47A3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F1F1F',
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: 10,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1F1F1F',
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 5,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 15,
    marginBottom: 22,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    color: '#6B7280',
    fontSize: 14,
  },
  link: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
