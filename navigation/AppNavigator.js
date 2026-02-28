/**
 * AppNavigator.js
 * Main navigation configuration for the application
 * Sets up Stack Navigator and Drawer Navigator
 */

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import custom drawer
import DrawerContent from '../components/DrawerContent';

// Import context
import { useApp } from '../context/AppContext';

// Create navigators
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * Auth Stack Navigator
 * Handles authentication screens (Login, Signup)
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

/**
 * Custom header component
 */
const CustomHeader = ({ navigation, title, showDrawerButton = true }) => {
  const { darkMode } = useApp();
  
  const backgroundColor = darkMode ? '#2d2d2d' : '#4CAF50';
  const textColor = '#fff';

  return (
    <View style={[styles.header, { backgroundColor }]}>
      {showDrawerButton && (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

/**
 * Home Stack Navigator
 * Handles Home, Detail screens with drawer access
 */
const HomeStack = () => {
  const { darkMode } = useApp();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain">
        {({ navigation }) => (
          <HomeScreen navigation={navigation} />
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <CustomHeader 
              navigation={navigation} 
              title="Post Detail" 
              showDrawerButton={false}
            />
          ),
          headerStyle: {
            backgroundColor: darkMode ? '#2d2d2d' : '#4CAF50',
          },
          headerTintColor: '#fff',
        })}
      />
    </Stack.Navigator>
  );
};

/**
 * Main Drawer Navigator
 * Handles all main app screens through drawer
 */
const MainDrawer = () => {
  const { darkMode } = useApp();
  
  const screenOptions = ({ navigation }) => ({
    headerShown: true,
    header: () => (
      <CustomHeader 
        navigation={navigation} 
        title="Academic App"
        showDrawerButton={true}
      />
    ),
    headerStyle: {
      backgroundColor: darkMode ? '#2d2d2d' : '#4CAF50',
    },
    headerTintColor: '#fff',
    drawerActiveBackgroundColor: darkMode ? '#3d3d3d' : '#e8f5e9',
    drawerActiveTintColor: '#4CAF50',
    drawerInactiveTintColor: darkMode ? '#fff' : '#333',
    drawerLabelStyle: {
      marginLeft: -20,
      fontSize: 16,
    },
    drawerStyle: {
      backgroundColor: darkMode ? '#1a1a1a' : '#fff',
    },
  });

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={screenOptions}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Drawer.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          drawerLabel: 'Favorites',
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>❤️</Text>
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>⚙️</Text>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

/**
 * Main App Navigator
 * Determines which navigator to show based on login status
 */
const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useApp();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 15,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
});

export default AppNavigator;
