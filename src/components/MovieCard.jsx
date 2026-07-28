import { useState } from 'react';

export default function MovieCard({
  movie,
  onClick,
  index,
  isWatchlisted,
  onWatchlistToggle,
}) {
  const [imgError, setImgError] = useState(false);
  
  // Use original Poster directly to prevent breakage. Fallback handled via onError
  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !imgError;
  const typeLabel = movie.Type
    ? movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)
    : '';

  const rating = movie._details?.imdbRating && movie._details.imdbRating !== 'N/A'
    ? movie._details.imdbRating
    : null;

  const genres = movie._details?.Genre && movie._details.Genre !== 'N/A'
    ? movie._details.Genre.split(',').slice(0, 2).map(g => g.trim())
    : [];

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    onWatchlistToggle(movie);
  };

  return (
    <article
      className="movie-card"
      id={`movie-card-${movie.imdbID}`}
      onClick={() => onClick(movie.imdbID)}
      style={{ animationDelay: `${index * 0.05}s` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(movie.imdbID);
        }
      }}
    >
      <div className="movie-card__poster-wrapper">
        {hasPoster ? (
          <img
            className="movie-card__poster"
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="movie-card__no-poster">
            <span className="movie-card__no-poster-icon">🎬</span>
            <span className="movie-card__no-poster-text">No Poster</span>
          </div>
        )}
        
        {/* Watchlist Toggle Button */}
        <button
          className={`movie-card__watchlist-btn ${
            isWatchlisted ? 'movie-card__watchlist-btn--active' : ''
          }`}
          onClick={handleWatchlistClick}
          aria-label={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          {isWatchlisted ? '❤️' : '🤍'}
        </button>

        <div className="movie-card__poster-overlay" />
        <div className="movie-card__play-icon">▶</div>
        
        {typeLabel && (
          <span className="movie-card__type-badge">{typeLabel}</span>
        )}

        {/* Floating Rating Badge */}
        {rating && (
          <span className="movie-card__rating-badge">⭐ {rating}</span>
        )}
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title" title={movie.Title}>
          {movie.Title}
        </h3>
        
        <div className="movie-card__meta-row">
          <span className="movie-card__year">📅 {movie.Year}</span>
          {movie._details?.Runtime && movie._details.Runtime !== 'N/A' && (
            <span className="movie-card__runtime">⏱ {movie._details.Runtime}</span>
          )}
        </div>

        {genres.length > 0 && (
          <div className="movie-card__genres">
            {genres.map((g) => (
              <span key={g} className="movie-card__genre-pill">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
