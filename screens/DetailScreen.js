/**
 * DetailScreen.js
 * Screen for displaying full post details
 * Allows users to add/remove posts from favorites
 * Enhanced with premium aesthetic UI
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { addToFavorites, removeFromFavorites, isInFavorites } from '../utils/storage';

// Premium color palette
const cardColors = ['#6C63FF', '#FF6584', '#4A47A3', '#00C9A7', '#FF8C42', '#845EC2'];

const DetailScreen = ({ route, navigation }) => {
  // Get post from route params
  const { post } = route.params;
  
  // State for favorite status
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Get app context for dark mode
  const { darkMode } = useApp();

  // Get avatar color based on userId
  const cardColor = cardColors[post.userId % cardColors.length];

  // Check if post is in favorites on mount
  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  /**
   * Check if post is in favorites
   */
  const checkFavoriteStatus = async () => {
    const status = await isInFavorites(post.id);
    setIsFavorite(status);
  };

  /**
   * Handle add/remove from favorites
   */
  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(post.id);
        setIsFavorite(false);
        Alert.alert('Removed', 'Post removed from favorites');
      } else {
        await addToFavorites(post);
        setIsFavorite(true);
        Alert.alert('Added', 'Post added to favorites!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
      console.error('Error toggling favorite:', error);
    }
  };

  const backgroundColor = '#F4F6FA';
  const cardBackground = '#FFFFFF';
  const textColor = '#1F1F1F';
  const textSecondary = '#6B7280';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Gradient */}
        <LinearGradient
          colors={[cardColor, cardColor + 'CC']}
          style={styles.headerGradient}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>#{post.id}</Text>
          </View>

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.userId}</Text>
            </View>
            <Text style={styles.userLabel}>User {post.userId}</Text>
          </View>
        </LinearGradient>

        {/* Content Card */}
        <View style={[styles.contentCard, { backgroundColor: cardBackground }]}>
          <Text style={[styles.title, { color: textColor }]}>
            {post.title}
          </Text>
          
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: cardColor + '20' }]}>
              <Text style={[styles.badgeText, { color: cardColor }]}>Academic</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#00C9A720' }]}>
              <Text style={[styles.badgeText, { color: '#00C9A7' }]}>Verified</Text>
            </View>
          </View>
          
          <Text style={[styles.body, { color: textSecondary }]}>
            {post.body}
          </Text>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: textSecondary }]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
              consequat.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Conclusion
            </Text>
            <Text style={[styles.description, { color: textSecondary }]}>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
              deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste 
              natus error sit voluptatem accusantium doloremque laudantium.
            </Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isFavorite 
                ? ['#EF4444', '#DC2626'] 
                : [cardColor, cardColor + 'CC']}
              style={styles.buttonGradient}
            >
              <Text style={styles.favoriteButtonText}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.shareButton}
            activeOpacity={0.8}
          >
            <Text style={styles.shareButtonText}>Share Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 70,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  idBadge: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  idBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 10,
    fontWeight: '500',
  },
  contentCard: {
    margin: 16,
    marginTop: -25,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
    lineHeight: 32,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  favoriteButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  shareButtonText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailScreen;
