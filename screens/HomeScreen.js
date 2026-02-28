/**
 * HomeScreen.js
 * Main screen displaying list of posts from API
 * Uses FlatList to display posts, navigates to Detail on item press
 * Enhanced with premium aesthetic UI
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { fetchPosts } from '../utils/api';

// Premium color palette
const cardColors = ['#6C63FF', '#FF6584', '#4A47A3', '#00C9A7', '#FF8C42', '#845EC2'];

const HomeScreen = ({ navigation }) => {
  // State for posts data
  const [posts, setPosts] = useState([]);
  
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // State for refreshing
  const [refreshing, setRefreshing] = useState(false);
  
  // State for error
  const [error, setError] = useState(null);

  // Get app context for dark mode
  const { darkMode } = useApp();

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  /**
   * Load posts from API
   */
  const loadPosts = async () => {
    try {
      setError(null);
      const result = await fetchPosts();
      
      if (result.success) {
        setPosts(result.data.slice(0, 20));
      } else {
        setError(result.error || 'Failed to load posts');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading posts:', err);
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
    loadPosts();
  }, []);

  /**
   * Navigate to detail screen
   */
  const handlePostPress = (post) => {
    navigation.navigate('Detail', { post });
  };

  /**
   * Get card color based on index
   */
  const getCardColor = (index) => {
    return cardColors[index % cardColors.length];
  };

  /**
   * Render individual post item
   */
  const renderItem = ({ item, index }) => {
    const cardColor = getCardColor(index);
    
    return (
      <TouchableOpacity
        style={styles.postItem}
        onPress={() => handlePostPress(item)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[cardColor, cardColor + 'CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>#{item.id}</Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.postTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.postBody} numberOfLines={3}>
              {item.body}
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <Text style={styles.readMore}>
              Read more
            </Text>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>User {item.userId}</Text>
            </View>
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
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>
            Academic Posts
          </Text>
          <Text style={styles.headerSubtitle}>
            Browse latest submissions
          </Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>Search</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1.2k</Text>
          <Text style={styles.statLabel}>Reads</Text>
        </View>
      </View>
    </View>
  );

  /**
   * Render empty list
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {error ? (
        <>
          <Text style={styles.errorIcon}>!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPosts}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.emptyIcon}>No Posts</Text>
          <Text style={styles.emptyTitle}>
            No Posts Available
          </Text>
          <Text style={styles.emptyText}>
            Pull down to refresh
          </Text>
        </>
      )}
    </View>
  );

  const backgroundColor = '#F4F6FA';

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>
          Loading posts...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
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
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#6C63FF',
    borderRadius: 20,
  },
  searchIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  postItem: {
    marginBottom: 18,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  idBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  idBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  cardContent: {
    marginVertical: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  postBody: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  readMore: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  userBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
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
  },
  errorIcon: {
    fontSize: 40,
    color: '#EF4444',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
