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
  getPopularMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  getTopRatedMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  getNowPlayingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  },

  getUpcomingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  },

  searchMovies: async (
    query: string,
    page: number = 1,
  ): Promise<SearchMovieResponse> => {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  },

  getMovieImages: async (movieId: number) => {
    const response = await api.get(`/movie/${movieId}/images`);
    return response.data;
  },

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
