import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch } from '../store';
import { removeFromFavorites } from '../store/moviesSlice';
import MovieCard from '../components/MovieCard';
import { FavoriteMovie } from '../types/movie';
import { RootStackParamList } from '../navigation/AppNavigator';
import { favoritesStorage } from '../utils/storage';

type FavoritesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Main'
>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const storedFavorites = await favoritesStorage.getFavorites();

      const sortedFavorites = storedFavorites.sort(
        (a, b) =>
          new Date(b.favoriteDate).getTime() -
          new Date(a.favoriteDate).getTime(),
      );
      setFavorites(sortedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: FavoriteMovie) => {
    navigation.navigate('MovieDetails', {
      movieId: movie.id,
      movieTitle: movie.title,
    });
  };

  const handleRemoveFavorite = (movie: FavoriteMovie) => {
    Alert.alert(
      'Remove from Favorites',
      `Are you sure you want to remove "${movie.title}" from your favorites?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              dispatch(removeFromFavorites(movie.id));
              await favoritesStorage.removeFromFavorites(movie.id);
              setFavorites(prev => prev.filter(fav => fav.id !== movie.id));
            } catch (error) {
              console.error('Error removing favorite:', error);
            }
          },
        },
      ],
    );
  };

  const clearAllFavorites = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all movies from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await favoritesStorage.clearFavorites();
              setFavorites([]);
            } catch (error) {
              console.error('Error clearing favorites:', error);
            }
          },
        },
      ],
    );
  };

  const renderMovieItem = ({ item }: { item: FavoriteMovie }) => (
    <View style={styles.movieItem}>
      <MovieCard
        movie={item}
        onPress={() => handleMoviePress(item)}
        onFavoritePress={() => handleRemoveFavorite(item)}
        isFavorite={true}
        showFavoriteButton={true}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="favorite-border" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Start adding movies to your favorites by tapping the heart icon!
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>My Favorites</Text>
      {favorites.length > 0 && (
        <TouchableOpacity
          onPress={clearAllFavorites}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={favorites}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id.toString()}
        columnWrapperStyle={{ gap: 16 }}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  movieItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoritesScreen;
