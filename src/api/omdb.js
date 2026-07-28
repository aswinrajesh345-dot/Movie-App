const API_KEY = '4287ad07';
const BASE_URL = 'https://www.omdbapi.com';

/**
 * Search movies by title query with optional filters.
 * @param {string} query - Search term
 * @param {number} page - Page number (1-based)
 * @param {Object} filters - Optional filters
 * @param {string} filters.type - movie | series | episode | '' (all)
 * @param {string} filters.year - Year string e.g. "2024"
 * @returns {Promise<{movies: Array, totalResults: number}>}
 */
export async function searchMovies(query, page = 1, filters = {}) {
  if (!query || query.trim().length < 2) {
    return { movies: [], totalResults: 0 };
  }

  let url = `${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}&page=${page}`;

  if (filters.type) {
    url += `&type=${filters.type}`;
  }
  if (filters.year) {
    url += `&y=${filters.year}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network error. Please check your connection.');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    if (data.Error === 'Movie not found!' || data.Error === 'Too many results.') {
      return { movies: [], totalResults: 0 };
    }
    throw new Error(data.Error || 'Something went wrong.');
  }

  return {
    movies: data.Search || [],
    totalResults: parseInt(data.totalResults, 10) || 0,
  };
}

/**
 * Get detailed info about a specific movie by IMDb ID.
 * @param {string} imdbID - The IMDb identifier
 * @returns {Promise<Object>}
 */
export async function getMovieDetails(imdbID) {
  const url = `${BASE_URL}/?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network error. Please check your connection.');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie details not found.');
  }

  return data;
}

/**
 * Fetch details for multiple movies in parallel (used for language filtering).
 * @param {Array} movies - Array of movie search results
 * @returns {Promise<Array>} Array of detailed movie objects
 */
export async function getMultipleMovieDetails(movies) {
  const results = await Promise.allSettled(
    movies.map((m) => getMovieDetails(m.imdbID))
  );

  return results.map((r, i) => ({
    ...movies[i],
    _details: r.status === 'fulfilled' ? r.value : null,
  }));
}

/**
 * Build a YouTube trailer search URL for a movie.
 */
export function getTrailerUrl(title, year) {
  const q = encodeURIComponent(`${title} ${year || ''} official trailer`.trim());
  return `https://www.youtube.com/results?search_query=${q}`;
}
