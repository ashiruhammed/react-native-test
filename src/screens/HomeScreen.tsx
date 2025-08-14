import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
  fetchUpcomingMovies,
  addToFavorites,
  removeFromFavorites,
} from '../store/moviesSlice';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/movie';
import { RootStackParamList } from '../navigation/AppNavigator';
import { favoritesStorage } from '../utils/storage';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  loading: boolean;
  onMoviePress: (movie: Movie) => void;
  onFavoritePress: (movie: Movie) => void;
  favoriteIds: Set<number>;
}

const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  loading,
  onMoviePress,
  onFavoritePress,
  favoriteIds,
}) => {
  if (loading && movies.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={movies.slice(0, 10)} // Show only first 10 movies in horizontal list
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <View style={styles.horizontalMovieCard}>
            <MovieCard
              movie={item}
              onPress={() => onMoviePress(item)}
              onFavoritePress={() => onFavoritePress(item)}
              isFavorite={favoriteIds.has(item.id)}
              showFavoriteButton={true}
            />
          </View>
        )}
      />
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const {
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
    favorites,
    loading,
    error,
  } = useAppSelector(state => state.movies);

  const [refreshing, setRefreshing] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadMovies();
    loadFavorites();
  }, []);

  useEffect(() => {
    // Update favorite IDs when favorites change
    setFavoriteIds(new Set(favorites.map(movie => movie.id)));
  }, [favorites]);

  const loadMovies = () => {
    dispatch(fetchPopularMovies(1));
    dispatch(fetchTopRatedMovies(1));
    dispatch(fetchNowPlayingMovies(1));
    dispatch(fetchUpcomingMovies(1));
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await favoritesStorage.getFavorites();
      const ids = new Set(storedFavorites.map(movie => movie.id));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadMovies();
    await loadFavorites();
    setRefreshing(false);
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMovies}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.headerTitle}>Movie App</Text>

      <MovieSection
        title="Now Playing"
        movies={nowPlayingMovies}
        loading={loading.nowPlaying}
        onMoviePress={handleMoviePress}
        onFavoritePress={handleFavoritePress}
        favoriteIds={favoriteIds}
      />

      <MovieSection
        title="Popular Movies"
        movies={popularMovies}
        loading={loading.popular}
        onMoviePress={handleMoviePress}
        onFavoritePress={handleFavoritePress}
        favoriteIds={favoriteIds}
      />

      <MovieSection
        title="Top Rated"
        movies={topRatedMovies}
        loading={loading.topRated}
        onMoviePress={handleMoviePress}
        onFavoritePress={handleFavoritePress}
        favoriteIds={favoriteIds}
      />

      <MovieSection
        title="Upcoming"
        movies={upcomingMovies}
        loading={loading.upcoming}
        onMoviePress={handleMoviePress}
        onFavoritePress={handleFavoritePress}
        favoriteIds={favoriteIds}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 15,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  horizontalMovieCard: {
    marginRight: 15,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e91e63',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
