const TYPES = [
  { value: '', label: 'All Types' },
  { value: 'movie', label: '🎬 Movies' },
  { value: 'series', label: '📺 TV Series' },
  { value: 'episode', label: '📼 Episodes' },
];

const LANGUAGES = [
  'All',
  'English',
  'Hindi',
  'Spanish',
  'French',
  'Korean',
  'Japanese',
  'German',
  'Italian',
  'Chinese',
  'Portuguese',
  'Arabic',
  'Russian',
  'Tamil',
  'Telugu',
  'Turkish',
  'Thai',
  'Swedish',
  'Dutch',
  'Polish',
];

const SORTS = [
  { value: '', label: 'Default (Relevance)' },
  { value: 'year_desc', label: '📅 Newest First' },
  { value: 'year_asc', label: '📅 Oldest First' },
  { value: 'rating_desc', label: '⭐ Highest Rating' },
];

const RATINGS = [
  { value: '', label: 'Any Rating' },
  { value: '7', label: '⭐ 7.0+ IMDb' },
  { value: '8', label: '⭐ 8.0+ IMDb' },
  { value: '9', label: '⭐ 9.0+ IMDb' },
];

export default function FilterBar({
  type,
  year,
  language,
  rating,
  sortBy,
  showWatchlistOnly,
  onTypeChange,
  onYearChange,
  onLanguageChange,
  onRatingChange,
  onSortByChange,
  onToggleWatchlist,
  watchlistCount,
  languageLoading,
}) {
  return (
    <div className="filter-bar" id="filter-bar">
      {/* Watchlist Toggle Pill */}
      <div className="filter-bar__group">
        <label className="filter-bar__label">My List</label>
        <button
          id="watchlist-toggle-btn"
          className={`filter-bar__pill filter-bar__pill--watchlist ${
            showWatchlistOnly ? 'filter-bar__pill--watchlist-active' : ''
          }`}
          onClick={onToggleWatchlist}
        >
          ❤️ Watchlist ({watchlistCount})
        </button>
      </div>

      {/* Type pills */}
      <div className="filter-bar__group">
        <label className="filter-bar__label">🎯 Type</label>
        <div className="filter-bar__pills">
          {TYPES.map((t) => (
            <button
              key={t.value}
              id={`filter-type-${t.value || 'all'}`}
              className={`filter-bar__pill ${
                type === t.value && !showWatchlistOnly
                  ? 'filter-bar__pill--active'
                  : ''
              }`}
              disabled={showWatchlistOnly}
              onClick={() => onTypeChange(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Year input */}
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-year">
          📅 Year
        </label>
        <input
          id="filter-year"
          className="filter-bar__input"
          type="number"
          placeholder="e.g. 2024"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          disabled={showWatchlistOnly}
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>

      {/* Language dropdown */}
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-language">
          🌐 Language
          {languageLoading && (
            <span className="filter-bar__lang-loading">filtering…</span>
          )}
        </label>
        <select
          id="filter-language"
          className="filter-bar__select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={showWatchlistOnly}
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Rating dropdown */}
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-rating">
          ⭐ Rating
        </label>
        <select
          id="filter-rating"
          className="filter-bar__select"
          value={rating}
          onChange={(e) => onRatingChange(e.target.value)}
          disabled={showWatchlistOnly}
        >
          {RATINGS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By dropdown */}
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="filter-sort">
          🔀 Sort By
        </label>
        <select
          id="filter-sort"
          className="filter-bar__select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          disabled={showWatchlistOnly}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
