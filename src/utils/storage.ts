import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteMovie } from '../types/movie';

const FAVORITES_KEY = '@movie_app_favorites';

export const favoritesStorage = {
  // Get all favorites
  getFavorites: async (): Promise<FavoriteMovie[]> => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favoritesJson) {
        return JSON.parse(favoritesJson);
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  // Save favorites
  saveFavorites: async (favorites: FavoriteMovie[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  // Add to favorites
  addToFavorites: async (movie: FavoriteMovie): Promise<void> => {
    try {
      const favorites = await favoritesStorage.getFavorites();
      const existingIndex = favorites.findIndex(fav => fav.id === movie.id);

      if (existingIndex === -1) {
        favorites.push(movie);
        await favoritesStorage.saveFavorites(favorites);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  },

  // Remove from favorites
  removeFromFavorites: async (movieId: number): Promise<void> => {
    try {
      const favorites = await favoritesStorage.getFavorites();
      const filteredFavorites = favorites.filter(fav => fav.id !== movieId);
      await favoritesStorage.saveFavorites(filteredFavorites);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  },

  // Check if movie is favorite
  isFavorite: async (movieId: number): Promise<boolean> => {
    try {
      const favorites = await favoritesStorage.getFavorites();
      return favorites.some(fav => fav.id === movieId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  },

  // Clear all favorites
  clearFavorites: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  },
};
