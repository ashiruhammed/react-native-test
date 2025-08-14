import axios from 'axios';
import {
  MovieDetails,
  MovieResponse,
  SearchMovieResponse,
} from '../types/movie';
import { config } from '../config';

const BASE_URL = config.TMDB_BASE_URL;
const API_KEY = config.TMDB_API_KEY;
const IMAGE_BASE_URL = config.TMDB_IMAGE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const movieApi = {
  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  },

  // Search movies
  searchMovies: async (
    query: string,
    page: number = 1,
  ): Promise<SearchMovieResponse> => {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  },

  // Get movie images
  getMovieImages: async (movieId: number) => {
    const response = await api.get(`/movie/${movieId}/images`);
    return response.data;
  },

  // Get movie videos (trailers)
  getMovieVideos: async (movieId: number) => {
    const response = await api.get(`/movie/${movieId}/videos`);
    return response.data;
  },
};

export const getImageUrl = (
  path: string | null,
  size: string = 'w500',
): string => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getFullImageUrl = (path: string | null): string => {
  return getImageUrl(path, 'original');
};

export { IMAGE_BASE_URL };
