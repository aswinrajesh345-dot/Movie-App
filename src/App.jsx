import { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import SkeletonGrid from './components/SkeletonGrid';
import Pagination from './components/Pagination';
import FilterBar from './components/FilterBar';
import { searchMovies, getMultipleMovieDetails } from './api/omdb';
import { useDebounce } from './hooks/useDebounce';

const TRENDING_SEARCHES = [
  'Avengers',
  'Inception',
  'Interstellar',
  'The Dark Knight',
  'Spider-Man',
  'Oppenheimer',
  'Dune',
  'Avatar',
];

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Filters state
  const [filterType, setFilterType] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('All');
  const [filterRating, setFilterRating] = useState('');
  const [sortBy, setSortBy] = useState('');

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem('moviehub_watchlist') || localStorage.getItem('cinesearch_watchlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const debouncedYear = useDebounce(filterYear, 600);

  // Persist watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('moviehub_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Main search and detailed fetch function
  const performSearch = useCallback(
    async (searchQuery, searchPage, type, year) => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setMovies([]);
        setTotalResults(0);
        setHasSearched(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const result = await searchMovies(searchQuery, searchPage, {
          type,
          year,
        });

        if (result.movies.length > 0) {
          // Fetch full details in parallel for rating & language filtering
          const detailed = await getMultipleMovieDetails(result.movies);
          setMovies(detailed);
          setTotalResults(result.totalResults);
        } else {
          setMovies([]);
          setTotalResults(0);
        }
      } catch (err) {
        setError(err.message);
        setMovies([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Trigger search when query, type, or year changes
  useEffect(() => {
    if (!showWatchlistOnly) {
      setPage(1);
      performSearch(debouncedQuery, 1, filterType, debouncedYear);
    }
  }, [debouncedQuery, filterType, debouncedYear, showWatchlistOnly, performSearch]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    performSearch(debouncedQuery, newPage, filterType, debouncedYear);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClear = () => {
    setQuery('');
    setMovies([]);
    setTotalResults(0);
    setPage(1);
    setHasSearched(false);
    setError(null);
  };

  const handleTrendingClick = (term) => {
    setShowWatchlistOnly(false);
    setQuery(term);
  };

  const handleRetry = () => {
    performSearch(debouncedQuery, page, filterType, debouncedYear);
  };

  const handleResetFilters = () => {
    setFilterType('');
    setFilterYear('');
    setFilterLanguage('All');
    setFilterRating('');
    setSortBy('');
  };

  const handleWatchlistToggle = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.imdbID === movie.imdbID);
      if (exists) {
        return prev.filter((m) => m.imdbID !== movie.imdbID);
      } else {
        // Keep details if available
        return [...prev, movie];
      }
    });
  };

  const handleToggleWatchlistMode = () => {
    setShowWatchlistOnly((prev) => !prev);
  };

  // ----------------------------------------------------
  // FILTERING & SORTING PIPELINE (CLIENT-SIDE)
  // ----------------------------------------------------
  let displayMovies = [];
  let displayedCount = 0;

  if (showWatchlistOnly) {
    // Client-side query filter on Watchlist
    displayMovies = watchlist.filter((m) => {
      const matchQuery =
        !debouncedQuery ||
        m.Title.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchQuery;
    });
    displayedCount = displayMovies.length;
  } else {
    displayMovies = [...movies];

    // 1. Language Filter
    if (filterLanguage !== 'All') {
      displayMovies = displayMovies.filter((m) => {
        const lang = m._details?.Language;
        return lang && lang.toLowerCase().includes(filterLanguage.toLowerCase());
      });
    }

    // 2. Rating Filter
    if (filterRating) {
      const minRating = parseFloat(filterRating);
      displayMovies = displayMovies.filter((m) => {
        const rating = parseFloat(m._details?.imdbRating);
        return !isNaN(rating) && rating >= minRating;
      });
    }

    // 3. Sorting
    if (sortBy === 'year_desc') {
      displayMovies.sort((a, b) => {
        const yearA = parseInt(a.Year, 10) || 0;
        const yearB = parseInt(b.Year, 10) || 0;
        return yearB - yearA;
      });
    } else if (sortBy === 'year_asc') {
      displayMovies.sort((a, b) => {
        const yearA = parseInt(a.Year, 10) || 0;
        const yearB = parseInt(b.Year, 10) || 0;
        return yearA - yearB;
      });
    } else if (sortBy === 'rating_desc') {
      displayMovies.sort((a, b) => {
        const ratingA = parseFloat(a._details?.imdbRating) || 0;
        const ratingB = parseFloat(b._details?.imdbRating) || 0;
        return ratingB - ratingA;
      });
    }

    displayedCount = displayMovies.length;
  }

  const hasActiveFilters =
    filterType !== '' ||
    filterYear !== '' ||
    filterLanguage !== 'All' ||
    filterRating !== '' ||
    sortBy !== '';

  return (
    <div className="app">
      {/* Header */}
      <header className="header" id="app-header">
        <div className="header__inner">
          <a
            className="header__logo"
            href="/"
            id="logo"
            onClick={(e) => {
              e.preventDefault();
              setShowWatchlistOnly(false);
              handleClear();
            }}
          >
            <span className="header__logo-icon">🎬</span>
            <span className="header__logo-text">MovieHub</span>
          </a>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onClear={handleClear}
          />
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar
        type={filterType}
        year={filterYear}
        language={filterLanguage}
        rating={filterRating}
        sortBy={sortBy}
        showWatchlistOnly={showWatchlistOnly}
        onTypeChange={setFilterType}
        onYearChange={setFilterYear}
        onLanguageChange={setFilterLanguage}
        onRatingChange={setFilterRating}
        onSortByChange={setSortBy}
        onToggleWatchlist={handleToggleWatchlistMode}
        watchlistCount={watchlist.length}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section — shown when no search / watchlist */}
        {!hasSearched && !showWatchlistOnly && !loading && (
          <section className="hero" id="hero-section">
            <h1 className="hero__title">
              Discover{' '}
              <span className="hero__title-gradient">Amazing Movies</span>
            </h1>
            <p className="hero__subtitle">
              Search through thousands of movies, TV series, and episodes.
              Find your next favorite film in seconds.
            </p>
            <div className="trending" id="trending-tags">
              <span className="trending__label">🔥 Trending:</span>
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  className="trending__tag"
                  onClick={() => handleTrendingClick(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Loading Skeleton */}
        {loading && <SkeletonGrid count={10} />}

        {/* Error State */}
        {error && !loading && !showWatchlistOnly && (
          <div className="error-state" id="error-state">
            <div className="error-state__icon">😵‍💫</div>
            <h2 className="error-state__title">Oops! Something went wrong</h2>
            <p className="error-state__message">{error}</p>
            <button
              className="error-state__retry"
              id="retry-btn"
              onClick={handleRetry}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Watchlist View Header */}
        {showWatchlistOnly && (
          <div className="results-header" id="results-header">
            <h2 className="results-header__title">❤️ My Watchlist</h2>
            <span className="results-header__count">
              {displayedCount} saved
            </span>
          </div>
        )}

        {/* Search Results View Header */}
        {!loading && !error && hasSearched && !showWatchlistOnly && (
          <div className="results-header" id="results-header">
            <div className="results-header__left">
              <h2 className="results-header__title">
                Results for &ldquo;{debouncedQuery}&rdquo;
              </h2>
              {hasActiveFilters && (
                <button
                  className="results-header__clear-filters"
                  id="clear-filters-btn"
                  onClick={handleResetFilters}
                >
                  ✕ Clear filters
                </button>
              )}
            </div>
            <div className="results-header__right">
              {hasActiveFilters && (
                <span className="results-header__filtered">
                  {displayedCount} matching filters
                </span>
              )}
              <span className="results-header__count">
                {totalResults.toLocaleString()} total
              </span>
            </div>
          </div>
        )}

        {/* Main Grid display */}
        {!loading && (
          <>
            {displayMovies.length > 0 ? (
              <>
                <div className="movie-grid" id="movie-grid">
                  {displayMovies.map((movie, index) => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                      index={index}
                      isWatchlisted={watchlist.some(
                        (m) => m.imdbID === movie.imdbID
                      )}
                      onWatchlistToggle={handleWatchlistToggle}
                      onClick={setSelectedMovieId}
                    />
                  ))}
                </div>

                {/* Hide pagination for watchlist mode */}
                {!showWatchlistOnly && (
                  <Pagination
                    currentPage={page}
                    totalResults={totalResults}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              /* Empty state (when either search is empty or filters returned 0 results) */
              (hasSearched || showWatchlistOnly) && (
                <div className="empty-state" id="empty-state">
                  <div className="empty-state__icon">🍿</div>
                  <h2 className="empty-state__title">
                    {showWatchlistOnly
                      ? 'Watchlist is empty'
                      : 'No matching movies found'}
                  </h2>
                  <p className="empty-state__message">
                    {showWatchlistOnly
                      ? debouncedQuery
                        ? `No items in your watchlist match "${debouncedQuery}".`
                        : "You haven't added any movies to your watchlist yet. Try searching and clicking the heart icon!"
                      : `Try adjusting your filters or search terms to find what you're looking for.`}
                  </p>
                  {hasActiveFilters && !showWatchlistOnly && (
                    <button
                      className="error-state__retry"
                      onClick={handleResetFilters}
                      style={{ marginTop: '1rem' }}
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Movie Detail Modal */}
      {selectedMovieId && (
        <MovieModal
          imdbID={selectedMovieId}
          isWatchlisted={watchlist.some((m) => m.imdbID === selectedMovieId)}
          onWatchlistToggle={handleWatchlistToggle}
          onClose={() => setSelectedMovieId(null)}
        />
      )}

      {/* Footer */}
      <footer className="footer" id="app-footer">
        <p className="footer__text">
          Made with <span className="footer__heart">❤️</span> using{' '}
          <a
            className="footer__link"
            href="https://www.omdbapi.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OMDb API
          </a>
          {' '}• MovieHub © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
