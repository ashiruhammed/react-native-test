import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchMovieDetails,
  addToFavorites,
  removeFromFavorites,
} from '../store/moviesSlice';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getImageUrl, getFullImageUrl } from '../services/movieApi';
import { favoritesStorage } from '../utils/storage';

type MovieDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'MovieDetails'
>;

interface Props {
  route: MovieDetailsScreenRouteProp;
}

const { width, height } = Dimensions.get('window');

const MovieDetailsScreen: React.FC<Props> = ({ route }) => {
  const { movieId } = route.params;
  const dispatch = useAppDispatch();
  const { movieDetails, loading } = useAppSelector(state => state.movies);
  const [isFavorite, setIsFavorite] = useState(false);

  const movie = movieDetails[movieId];

  useEffect(() => {
    if (!movie) {
      dispatch(fetchMovieDetails(movieId));
    }
    checkIfFavorite();
  }, [movieId, movie, dispatch]);

  const checkIfFavorite = async () => {
    try {
      const favorite = await favoritesStorage.isFavorite(movieId);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoritePress = async () => {
    if (!movie) return;

    try {
      if (isFavorite) {
        dispatch(removeFromFavorites(movie.id));
        await favoritesStorage.removeFromFavorites(movie.id);
        setIsFavorite(false);
      } else {
        const favoriteMovie = {
          ...movie,
          favoriteDate: new Date().toISOString(),
        };
        dispatch(addToFavorites(movie));
        await favoritesStorage.addToFavorites(favoriteMovie);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading.details || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Backdrop Image */}
      <View style={styles.backdropContainer}>
        <Image
          source={{
            uri:
              getFullImageUrl(movie.backdrop_path) ||
              getImageUrl(movie.poster_path) ||
              'https://via.placeholder.com/800x450?text=No+Image',
          }}
          style={styles.backdrop}
          resizeMode="cover"
        />
        <View style={styles.backdropOverlay} />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Icon
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={28}
            color={isFavorite ? '#e91e63' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Movie Info */}
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          {movie.tagline && (
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          )}
        </View>

        {/* Rating and Release Info */}
        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#ffd700" />
            <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
            <Text style={styles.voteCount}>({movie.vote_count} votes)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              {formatDate(movie.release_date)} • {formatRuntime(movie.runtime)}
            </Text>
          </View>
        </View>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.genresContainer}>
            {movie.genres.map(genre => (
              <View key={genre.id} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>{movie.status}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Original Language:</Text>
            <Text style={styles.detailValue}>
              {movie.original_language.toUpperCase()}
            </Text>
          </View>

          {movie.budget > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Budget:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(movie.budget)}
              </Text>
            </View>
          )}

          {movie.revenue > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Revenue:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(movie.revenue)}
              </Text>
            </View>
          )}
        </View>

        {/* Production Companies */}
        {movie.production_companies &&
          movie.production_companies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Production Companies</Text>
              {movie.production_companies.map(company => (
                <Text key={company.id} style={styles.companyText}>
                  • {company.name}
                </Text>
              ))}
            </View>
          )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  backdropContainer: {
    position: 'relative',
    height: height * 0.3,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  metaContainer: {
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genreTag: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  companyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});

export default MovieDetailsScreen;
