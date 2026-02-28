/**
 * DrawerContent.js
 * Custom drawer content component for navigation
 * Enhanced with premium aesthetic UI
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';

const DrawerContent = (props) => {
  const { userData, darkMode } = useApp();

  const primaryColor = '#6C63FF';
  const secondaryColor = '#4A47A3';
  const backgroundColor = '#F4F6FA';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header Gradient */}
      <LinearGradient
        colors={[primaryColor, secondaryColor]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData?.username ? userData.username.charAt(0).toUpperCase() : 'A'}
              </Text>
            </View>
          </View>
          
          {/* User Info */}
          <Text style={styles.userName}>
            {userData?.username || 'Academic User'}
          </Text>
          <Text style={styles.userEmail}>
            {userData?.email || 'user@academic.com'}
          </Text>
        </View>
      </LinearGradient>

      {/* Drawer Items */}
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>Academic Submission App</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
  },
  drawerContent: {
    paddingTop: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  footerVersion: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 4,
  },
});

export default DrawerContent;
