import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Movie } from '../types/movie';
import { getImageUrl } from '../services/movieApi';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2;

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showFavoriteButton = false,
}) => {
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              getImageUrl(movie.poster_path) ||
              'https://via.placeholder.com/300x450?text=No+Image',
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        {showFavoriteButton && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavoritePress}
          >
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={24}
              color={isFavorite ? '#e91e63' : '#fff'}
            />
          </TouchableOpacity>
        )}
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#ffd700" />
          <Text style={styles.rating}>{formatRating(movie.vote_average)}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>
          {movie.release_date ? formatYear(movie.release_date) : 'TBA'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: cardWidth * 1.5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 6,
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    color: '#666',
  },
});

export default MovieCard;
