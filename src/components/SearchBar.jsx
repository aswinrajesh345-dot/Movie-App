export default function SearchBar({ query, onQueryChange, onClear }) {
  return (
    <div className="search" id="search-bar">
      <div className="search__container">
        <span className="search__icon">🔍</span>
        <input
          id="search-input"
          className="search__input"
          type="text"
          placeholder="Search movies, series, episodes..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          id="search-clear"
          className={`search__clear ${query ? 'search__clear--visible' : ''}`}
          onClick={onClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
