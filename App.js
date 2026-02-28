/**
 * App.js
 * Main entry point for the Academic Submission App
 * Sets up the App Provider and renders the main navigator
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Import App Provider (context)
import { AppProvider, useApp } from './src/context/AppContext';

// Import main navigator
import AppNavigator from './src/navigation/AppNavigator';

/**
 * App Content Component
 * Contains the main app logic and dark mode handling
 */
const AppContent = () => {
  const { darkMode } = useApp();
  
  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

/**
 * Main App Component
 * Wraps the app with necessary providers
 */
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
