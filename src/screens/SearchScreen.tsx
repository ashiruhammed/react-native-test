import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector } from '../store';
import {
  searchMovies,
  clearSearchResults,
  addToFavorites,
  removeFromFavorites,
} from '../store/moviesSlice';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/movie';
import { RootStackParamList } from '../navigation/AppNavigator';
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

  const loadFavorites = async () => {
    try {
      const storedFavorites = await favoritesStorage.getFavorites();
      const ids = new Set(storedFavorites.map(movie => movie.id));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(searchMovies({ query: query.trim() }));
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

    if (searchQuery && searchResults.length === 0) {
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
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon name="clear" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
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
    marginBottom: 15,
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
  searchButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
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
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});

export default SearchScreen;
