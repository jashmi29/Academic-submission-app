/**
 * FavoritesScreen.js
 * Screen displaying saved favorite posts
 * Loads favorites from AsyncStorage and displays them in a FlatList
 * Enhanced with premium aesthetic UI
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { getFavorites, removeFromFavorites } from '../utils/storage';

// Premium color palette
const cardColors = ['#6C63FF', '#FF6584', '#4A47A3', '#00C9A7', '#FF8C42', '#845EC2'];

const FavoritesScreen = ({ navigation }) => {
  // State for favorites
  const [favorites, setFavorites] = useState([]);
  
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // State for refreshing
  const [refreshing, setRefreshing] = useState(false);

  // Get app context for dark mode
  const { darkMode } = useApp();

  // Load favorites on mount
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  /**
   * Load favorites from AsyncStorage
   */
  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle pull to refresh
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites();
  }, []);

  /**
   * Navigate to detail screen
   */
  const handlePostPress = (post) => {
    navigation.navigate('Detail', { post });
  };

  /**
   * Handle remove from favorites
   */
  const handleRemove = (postId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this post from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeFromFavorites(postId);
            loadFavorites();
          },
        },
      ]
    );
  };

  /**
   * Get card color based on index
   */
  const getCardColor = (index) => {
    return cardColors[index % cardColors.length];
  };

  /**
   * Render individual favorite item
   */
  const renderItem = ({ item, index }) => {
    const cardColor = getCardColor(index);
    
    return (
      <TouchableOpacity
        style={styles.postItem}
        onPress={() => handlePostPress(item)}
        onLongPress={() => handleRemove(item.id)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[cardColor, cardColor + 'CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Text style={styles.postTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.postBody} numberOfLines={2}>
              {item.body}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.readMore}>Read more</Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemove(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  /**
   * Render list header
   */
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
        My Favorites
      </Text>
      <Text style={styles.headerSubtitle}>
        {favorites.length} saved posts
      </Text>
    </View>
  );

  /**
   * Render empty list
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>No Favorites</Text>
      <Text style={styles.emptyTitle}>
        No Favorites Yet
      </Text>
      <Text style={styles.emptyText}>
        Posts you favorite will appear here
      </Text>
    </View>
  );

  const backgroundColor = '#F4F6FA';

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={favorites.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6C63FF']}
            tintColor="#6C63FF"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FA',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F1F1F',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  postItem: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: {
    padding: 18,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  cardContent: {
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readMore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  removeButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    color: '#D1D5DB',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FavoritesScreen;
