/**
 * Storage Utility Module
 * Handles all AsyncStorage operations for the application
 * Stores user credentials, favorites, and app settings
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const KEYS = {
  USER: '@user_data',
  FAVORITES: '@favorites',
  SETTINGS: '@settings',
  IS_LOGGED_IN: '@is_logged_in',
};

/**
 * Save user data to AsyncStorage
 * @param {Object} userData - User object containing username, email, password
 */
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(userData));
    await AsyncStorage.setItem(KEYS.IS_LOGGED_IN, 'true');
    return { success: true };
  } catch (error) {
    console.error('Error saving user data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user data from AsyncStorage
 * @returns {Object|null} User data object or null
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Validate user credentials during login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Result object with success status and user data if valid
 */
export const validateUser = async (email, password) => {
  try {
    const userData = await getUserData();
    if (userData && userData.email === email && userData.password === password) {
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid email or password' };
  } catch (error) {
    console.error('Error validating user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user is logged in
 * @returns {boolean} True if logged in, false otherwise
 */
export const checkLoginStatus = async () => {
  try {
    const isLoggedIn = await AsyncStorage.getItem(KEYS.IS_LOGGED_IN);
    return isLoggedIn === 'true';
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

/**
 * Logout user - clear login status
 */
export const logoutUser = async () => {
  try {
    await AsyncStorage.setItem(KEYS.IS_LOGGED_IN, 'false');
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save favorite posts to AsyncStorage
 * @param {Array} favorites - Array of favorite posts
 */
export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    return { success: true };
  } catch (error) {
    console.error('Error saving favorites:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get favorite posts from AsyncStorage
 * @returns {Array} Array of favorite posts
 */
export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Add a single post to favorites
 * @param {Object} post - Post object to add to favorites
 */
export const addToFavorites = async (post) => {
  try {
    const favorites = await getFavorites();
    // Check if already in favorites
    const exists = favorites.find((item) => item.id === post.id);
    if (!exists) {
      favorites.push(post);
      await saveFavorites(favorites);
    }
    return { success: true };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a post from favorites
 * @param {number} postId - ID of the post to remove
 */
export const removeFromFavorites = async (postId) => {
  try {
    const favorites = await getFavorites();
    const filtered = favorites.filter((item) => item.id !== postId);
    await saveFavorites(filtered);
    return { success: true };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if a post is in favorites
 * @param {number} postId - ID of the post to check
 * @returns {boolean} True if in favorites, false otherwise
 */
export const isInFavorites = async (postId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some((item) => item.id === postId);
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};

/**
 * Save app settings to AsyncStorage
 * @param {Object} settings - Settings object with darkMode, notifications
 */
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get app settings from AsyncStorage
 * @returns {Object} Settings object
 */
export const getSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : { darkMode: false, notifications: true };
  } catch (error) {
    console.error('Error getting settings:', error);
    return { darkMode: false, notifications: true };
  }
};

/**
 * Clear all app data (for logout/reset)
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return { success: true };
  } catch (error) {
    console.error('Error clearing data:', error);
    return { success: false, error: error.message };
  }
};
