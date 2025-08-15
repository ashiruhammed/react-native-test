import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, MovieDetails, FavoriteMovie } from '../types/movie';
import { movieApi } from '../services/movieApi';

interface MoviesState {
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  nowPlayingMovies: Movie[];
  upcomingMovies: Movie[];
  searchResults: Movie[];
  movieDetails: { [key: number]: MovieDetails };
  favorites: FavoriteMovie[];
  loading: {
    popular: boolean;
    topRated: boolean;
    nowPlaying: boolean;
    upcoming: boolean;
    search: boolean;
    details: boolean;
  };
  error: string | null;
  searchQuery: string;
  currentPage: {
    popular: number;
    topRated: number;
    nowPlaying: number;
    upcoming: number;
    search: number;
  };
  hasMore: {
    popular: boolean;
    topRated: boolean;
    nowPlaying: boolean;
    upcoming: boolean;
    search: boolean;
  };
}

const initialState: MoviesState = {
  popularMovies: [],
  topRatedMovies: [],
  nowPlayingMovies: [],
  upcomingMovies: [],
  searchResults: [],
  movieDetails: {},
  favorites: [],
  loading: {
    popular: false,
    topRated: false,
    nowPlaying: false,
    upcoming: false,
    search: false,
    details: false,
  },
  error: null,
  searchQuery: '',
  currentPage: {
    popular: 1,
    topRated: 1,
    nowPlaying: 1,
    upcoming: 1,
    search: 1,
  },
  hasMore: {
    popular: true,
    topRated: true,
    nowPlaying: true,
    upcoming: true,
    search: true,
  },
};

export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopularMovies',
  async (page: number = 1) => {
    const response = await movieApi.getPopularMovies(page);
    return { movies: response.results, page, totalPages: response.total_pages };
  },
);

export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRatedMovies',
  async (page: number = 1) => {
    const response = await movieApi.getTopRatedMovies(page);
    return { movies: response.results, page, totalPages: response.total_pages };
  },
);

export const fetchNowPlayingMovies = createAsyncThunk(
  'movies/fetchNowPlayingMovies',
  async (page: number = 1) => {
    const response = await movieApi.getNowPlayingMovies(page);
    return { movies: response.results, page, totalPages: response.total_pages };
  },
);

export const fetchUpcomingMovies = createAsyncThunk(
  'movies/fetchUpcomingMovies',
  async (page: number = 1) => {
    const response = await movieApi.getUpcomingMovies(page);
    return { movies: response.results, page, totalPages: response.total_pages };
  },
);

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page = 1 }: { query: string; page?: number }) => {
    const response = await movieApi.searchMovies(query, page);
    return {
      movies: response.results,
      page,
      totalPages: response.total_pages,
      query,
    };
  },
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId: number) => {
    const response = await movieApi.getMovieDetails(movieId);
    return response;
  },
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSearchResults: state => {
      state.searchResults = [];
      state.searchQuery = '';
      state.currentPage.search = 1;
      state.hasMore.search = true;
    },
    addToFavorites: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const favoriteMovie: FavoriteMovie = {
        ...movie,
        favoriteDate: new Date().toISOString(),
      };
      state.favorites.push(favoriteMovie);
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(
        movie => movie.id !== action.payload,
      );
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPopularMovies.pending, state => {
        state.loading.popular = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading.popular = false;
        const { movies, page, totalPages } = action.payload;
        if (page === 1) {
          state.popularMovies = movies;
        } else {
          state.popularMovies.push(...movies);
        }
        state.currentPage.popular = page;
        state.hasMore.popular = page < totalPages;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading.popular = false;
        state.error = action.error.message || 'Failed to fetch popular movies';
      });

    builder
      .addCase(fetchTopRatedMovies.pending, state => {
        state.loading.topRated = true;
        state.error = null;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.loading.topRated = false;
        const { movies, page, totalPages } = action.payload;
        if (page === 1) {
          state.topRatedMovies = movies;
        } else {
          state.topRatedMovies.push(...movies);
        }
        state.currentPage.topRated = page;
        state.hasMore.topRated = page < totalPages;
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.loading.topRated = false;
        state.error =
          action.error.message || 'Failed to fetch top rated movies';
      });

    builder
      .addCase(fetchNowPlayingMovies.pending, state => {
        state.loading.nowPlaying = true;
        state.error = null;
      })
      .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
        state.loading.nowPlaying = false;
        const { movies, page, totalPages } = action.payload;
        if (page === 1) {
          state.nowPlayingMovies = movies;
        } else {
          state.nowPlayingMovies.push(...movies);
        }
        state.currentPage.nowPlaying = page;
        state.hasMore.nowPlaying = page < totalPages;
      })
      .addCase(fetchNowPlayingMovies.rejected, (state, action) => {
        state.loading.nowPlaying = false;
        state.error =
          action.error.message || 'Failed to fetch now playing movies';
      });

    builder
      .addCase(fetchUpcomingMovies.pending, state => {
        state.loading.upcoming = true;
        state.error = null;
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.loading.upcoming = false;
        const { movies, page, totalPages } = action.payload;
        if (page === 1) {
          state.upcomingMovies = movies;
        } else {
          state.upcomingMovies.push(...movies);
        }
        state.currentPage.upcoming = page;
        state.hasMore.upcoming = page < totalPages;
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.loading.upcoming = false;
        state.error = action.error.message || 'Failed to fetch upcoming movies';
      });

    builder
      .addCase(searchMovies.pending, state => {
        state.loading.search = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading.search = false;
        const { movies, page, totalPages, query } = action.payload;
        if (page === 1) {
          state.searchResults = movies;
          state.searchQuery = query;
        } else {
          state.searchResults.push(...movies);
        }
        state.currentPage.search = page;
        state.hasMore.search = page < totalPages;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading.search = false;
        state.error = action.error.message || 'Failed to search movies';
      });

    builder
      .addCase(fetchMovieDetails.pending, state => {
        state.loading.details = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading.details = false;
        const movieDetails = action.payload;
        state.movieDetails[movieDetails.id] = movieDetails;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading.details = false;
        state.error = action.error.message || 'Failed to fetch movie details';
      });
  },
});

export const {
  clearSearchResults,
  addToFavorites,
  removeFromFavorites,
  clearError,
} = moviesSlice.actions;
export default moviesSlice.reducer;
