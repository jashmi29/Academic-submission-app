/**
 * App Context Module
 * Provides global state management for the application
 * Handles theme, notifications settings, and user authentication state
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSettings, saveSettings, checkLoginStatus, getUserData } from '../utils/storage';

// Create the context
const AppContext = createContext();

// App Provider component that wraps the app
export const AppProvider = ({ children }) => {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // State for notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // State for user authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State for user data
  const [user, setUser] = useState(null);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);

  // Load settings and check login status on app start
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Load initial data from AsyncStorage
   */
  const loadInitialData = async () => {
    try {
      // Load settings
      const settings = await getSettings();
      setDarkMode(settings.darkMode || false);
      setNotificationsEnabled(settings.notifications !== false);

      // Check login status
      const loggedIn = await checkLoginStatus();
      setIsLoggedIn(loggedIn);

      // Load user data if logged in
      if (loggedIn) {
        const userData = await getUserData();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await saveSettings({ darkMode: newValue, notifications: notificationsEnabled });
  };

  /**
   * Toggle notifications
   */
  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await saveSettings({ darkMode: darkMode, notifications: newValue });
  };

  /**
   * Set user data after login/signup
   */
  const setUserData = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  /**
   * Clear user data on logout
   */
  const clearUserData = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // Value object to be provided to consumers
  const value = {
    // State
    darkMode,
    notificationsEnabled,
    isLoggedIn,
    user,
    isLoading,
    
    // Actions
    toggleDarkMode,
    toggleNotifications,
    setUserData,
    clearUserData,
    loadInitialData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
