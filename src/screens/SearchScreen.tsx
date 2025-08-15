import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MovieCard from '../components/MovieCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '../store';
import {
  addToFavorites,
  clearSearchResults,
  removeFromFavorites,
  searchMovies,
} from '../store/moviesSlice';
import { Movie } from '../types/movie';
import { favoritesStorage } from '../utils/storage';

type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Main'
>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { searchResults, loading, searchQuery } = useAppSelector(
    state => state.movies,
  );

  const [query, setQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadFavorites();
  }, []);

  // Debounced search - triggers 500ms after user stops typing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim().length >= 2) {
        dispatch(searchMovies({ query: query.trim() }));
      } else if (query.trim().length === 0) {
        dispatch(clearSearchResults());
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [query, dispatch]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await favoritesStorage.getFavorites();
      const ids = new Set(storedFavorites.map(movie => movie.id));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const clearSearch = () => {
    setQuery('');
    dispatch(clearSearchResults());
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', {
      movieId: movie.id,
      movieTitle: movie.title,
    });
  };

  const handleFavoritePress = async (movie: Movie) => {
    const isFavorite = favoriteIds.has(movie.id);

    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id));
      await favoritesStorage.removeFromFavorites(movie.id);
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(movie.id);
        return newSet;
      });
    } else {
      const favoriteMovie = {
        ...movie,
        favoriteDate: new Date().toISOString(),
      };
      dispatch(addToFavorites(movie));
      await favoritesStorage.addToFavorites(favoriteMovie);
      setFavoriteIds(prev => new Set(prev).add(movie.id));
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieItem}>
      <MovieCard
        movie={item}
        onPress={() => handleMoviePress(item)}
        onFavoritePress={() => handleFavoritePress(item)}
        isFavorite={favoriteIds.has(item.id)}
        showFavoriteButton={true}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (loading.search) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (query.trim().length > 0 && query.trim().length < 2) {
      return (
        <View style={styles.centerContainer}>
          <Icon name="edit" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            Type at least 2 characters to search
          </Text>
        </View>
      );
    }

    if (searchQuery && searchResults.length === 0 && query.trim().length >= 2) {
      return (
        <View style={styles.centerContainer}>
          <Icon name="search-off" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            No movies found for "{searchQuery}"
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Icon name="search" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Search for movies</Text>
        <Text style={styles.subText}>
          Start typing to find your favorite movies
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Movies</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon
            name="search"
            size={24}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for movies..."
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon name="clear" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {/* Search status indicator */}
        {query.trim().length >= 2 && (
          <View style={styles.searchStatus}>
            {loading.search ? (
              <View style={styles.searchingIndicator}>
                <ActivityIndicator size="small" color="#e91e63" />
                <Text style={styles.searchingText}>Searching...</Text>
              </View>
            ) : (
              <Text style={styles.resultsCount}>
                {searchResults.length} result
                {searchResults.length !== 1 ? 's' : ''} found
              </Text>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id.toString()}
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
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
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
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  searchStatus: {
    marginTop: 10,
    alignItems: 'center',
  },
  searchingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#e91e63',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  movieItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});

export default SearchScreen;
