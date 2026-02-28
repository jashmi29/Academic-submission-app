/**
 * SettingsScreen.js
 * Screen for app settings
 * Includes dark mode toggle, notifications toggle, and test notification button
 * Enhanced with premium aesthetic UI
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { useApp } from '../context/AppContext';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SettingsScreen = ({ navigation }) => {
  // Get app context
  const { 
    darkMode, 
    notificationsEnabled, 
    toggleDarkMode, 
    toggleNotifications,
    clearUserData,
  } = useApp();

  // State for notification permission
  const [notificationPermission, setNotificationPermission] = useState(null);

  // Check notification permission on mount
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  /**
   * Check if notification permission is granted
   */
  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationPermission(status);
  };

  /**
   * Request notification permission
   */
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermission(status);
    return status === 'granted';
  };

  /**
   * Send a test notification
   */
  const sendTestNotification = async () => {
    try {
      let hasPermission = notificationPermission === 'granted';
      
      if (!hasPermission) {
        hasPermission = await requestNotificationPermission();
      }

      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive notifications.'
        );
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Academic App',
          body: 'This is a test notification from the Academic Submission App!',
          data: { screen: 'Home' },
        },
        trigger: null,
      });

      Alert.alert('Success', 'Test notification sent successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
      console.error('Notification error:', error);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearUserData();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const backgroundColor = '#F4F6FA';
  const cardBackground = '#FFFFFF';
  const textColor = '#1F1F1F';
  const textSecondary = '#6B7280';
  const primaryColor = '#6C63FF';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            App Settings
          </Text>
          
          <View style={[styles.settingCard, { backgroundColor: cardBackground }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: primaryColor + '20' }]}>
                  <Text style={[styles.iconText, { color: primaryColor }]}>Dark</Text>
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
                  <Text style={[styles.settingDescription, { color: textSecondary }]}>
                    Enable dark theme
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#E5E7EB', true: primaryColor + '80' }}
                thumbColor={darkMode ? primaryColor : '#F9FAFB'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF658420' }]}>
                  <Text style={[styles.iconText, { color: '#FF6584' }]}>Notif</Text>
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: textColor }]}>Notifications</Text>
                  <Text style={[styles.settingDescription, { color: textSecondary }]}>
                    Enable push notifications
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#E5E7EB', true: primaryColor + '80' }}
                thumbColor={notificationsEnabled ? primaryColor : '#F9FAFB'}
              />
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Notifications
          </Text>
          
          <View style={[styles.settingCard, { backgroundColor: cardBackground }]}>
            <TouchableOpacity
              style={styles.buttonItem}
              onPress={sendTestNotification}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#00C9A720' }]}>
                  <Text style={[styles.iconText, { color: '#00C9A7' }]}>Test</Text>
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: textColor }]}>Test Notification</Text>
                  <Text style={[styles.settingDescription, { color: textSecondary }]}>
                    Send a test notification
                  </Text>
                </View>
              </View>
              <Text style={styles.chevron}>{'>'}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF8C4220' }]}>
                  <Text style={[styles.iconText, { color: '#FF8C42' }]}>Status</Text>
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: textColor }]}>Permission Status</Text>
                </View>
              </View>
              <Text style={[styles.infoValue, { color: textSecondary }]}>
                {notificationPermission === 'granted' ? 'Granted' : 
                 notificationPermission === 'denied' ? 'Denied' : 'Not Requested'}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Account
          </Text>
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutGradient}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: textSecondary }]}>
            Academic Submission App v1.0.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingCard: {
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 10,
    fontWeight: '700',
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  buttonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  chevron: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    padding: 18,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  appVersion: {
    fontSize: 12,
  },
});

export default SettingsScreen;
