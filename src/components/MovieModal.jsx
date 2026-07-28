import { useState, useEffect } from 'react';
import { getMovieDetails } from '../api/omdb';

export default function MovieModal({
  imdbID,
  onClose,
  isWatchlisted,
  onWatchlistToggle,
}) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posterError, setPosterError] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchDetails() {
      setLoading(true);
      setError(null);
      setPosterError(false);
      setShowTrailer(false);
      try {
        const data = await getMovieDetails(imdbID);
        if (!cancelled) setMovie(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [imdbID]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const hasPoster = movie?.Poster && movie.Poster !== 'N/A' && !posterError;

  const infoItems = movie
    ? [
        { label: 'Director', value: movie.Director },
        { label: 'Writer', value: movie.Writer },
        { label: 'Actors', value: movie.Actors },
        { label: 'Released', value: movie.Released },
        { label: 'Runtime', value: movie.Runtime },
        { label: 'Language', value: movie.Language },
        { label: 'Country', value: movie.Country },
        { label: 'Awards', value: movie.Awards },
        { label: 'Box Office', value: movie.BoxOffice },
      ].filter((item) => item.value && item.value !== 'N/A')
    : [];

  const genres = movie?.Genre
    ? movie.Genre.split(',').map((g) => g.trim())
    : [];

  // YouTube search query list embed
  const trailerEmbedUrl = movie
    ? `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
        movie.Title + ' ' + movie.Year + ' official trailer'
      )}&autoplay=1`
    : '';

  return (
    <div
      className="modal-overlay"
      id="movie-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${showTrailer ? 'modal--video' : ''}`}
        id="movie-modal"
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal__close"
          id="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {loading && (
          <div className="modal__loading">
            <div className="loader__spinner" />
            <span className="loader__text">Loading details...</span>
          </div>
        )}

        {error && (
          <div className="modal__loading">
            <span style={{ fontSize: '3rem' }}>😵</span>
            <span className="loader__text">{error}</span>
          </div>
        )}

        {!loading && !error && movie && (
          <>
            {showTrailer ? (
              /* Trailer Video Player View */
              <div className="modal__video-container">
                <button
                  className="modal__video-back"
                  onClick={() => setShowTrailer(false)}
                >
                  ← Back to Info
                </button>
                 <iframe
                  className="modal__video-iframe"
                  src={trailerEmbedUrl}
                  title={`${movie.Title} Trailer`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                ></iframe>
              </div>
            ) : (
              /* Standard Info View */
              <div className="modal__hero">
                <div className="modal__poster-container">
                  {hasPoster ? (
                    <img
                      className="modal__poster"
                      src={movie.Poster}
                      alt={`${movie.Title} poster`}
                      onError={() => setPosterError(true)}
                    />
                  ) : (
                    <div className="modal__poster--placeholder">🎬</div>
                  )}
                </div>

                <div className="modal__details">
                  <h2 className="modal__title">{movie.Title}</h2>

                  <div className="modal__meta">
                    {movie.Year && movie.Year !== 'N/A' && (
                      <span className="modal__meta-tag">📅 {movie.Year}</span>
                    )}
                    {movie.Rated && movie.Rated !== 'N/A' && (
                      <>
                        <span className="modal__meta-dot" />
                        <span className="modal__meta-tag">{movie.Rated}</span>
                      </>
                    )}
                    {movie.Runtime && movie.Runtime !== 'N/A' && (
                      <>
                        <span className="modal__meta-dot" />
                        <span className="modal__meta-tag">⏱ {movie.Runtime}</span>
                      </>
                    )}
                    {movie.Type && (
                      <>
                        <span className="modal__meta-dot" />
                        <span className="modal__meta-tag">
                          {movie.Type.charAt(0).toUpperCase() +
                            movie.Type.slice(1)}
                        </span>
                      </>
                    )}
                  </div>

                  {genres.length > 0 && (
                    <div
                      className="modal__genres"
                      style={{ marginBottom: '1.2rem' }}
                    >
                      {genres.map((genre) => (
                        <span key={genre} className="modal__genre-tag">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Buttons Action Bar */}
                  <div className="modal__actions">
                    <button
                      className="modal__trailer-btn"
                      id="modal-play-trailer"
                      onClick={() => setShowTrailer(true)}
                    >
                      <span className="modal__trailer-btn-icon">▶</span>
                      Watch Trailer
                    </button>

                    <button
                      className={`modal__watchlist-btn ${
                        isWatchlisted ? 'modal__watchlist-btn--active' : ''
                      }`}
                      onClick={() => onWatchlistToggle(movie)}
                    >
                      {isWatchlisted ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
                    </button>
                  </div>

                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="modal__rating">
                      <span className="modal__rating-star">⭐</span>
                      <span className="modal__rating-score">
                        {movie.imdbRating}
                      </span>
                      <span className="modal__rating-max">/ 10</span>
                      {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                        <span className="modal__rating-votes">
                          {movie.imdbVotes} votes
                        </span>
                      )}
                    </div>
                  )}

                  {movie.Plot && movie.Plot !== 'N/A' && (
                    <div className="modal__section">
                      <h3 className="modal__section-title">Plot</h3>
                      <p className="modal__section-text">{movie.Plot}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Extra details (only shown if not in video mode for cleaner design) */}
            {!showTrailer && infoItems.length > 0 && (
              <div className="modal__extra">
                <div className="modal__info-grid">
                  {infoItems.map((item) => (
                    <div key={item.label} className="modal__info-item">
                      <div className="modal__info-label">{item.label}</div>
                      <div className="modal__info-value">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
