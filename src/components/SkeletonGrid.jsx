export default function SkeletonGrid({ count = 10 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-card__poster" />
          <div className="skeleton-card__info">
            <div className="skeleton-card__title" />
            <div className="skeleton-card__year" />
          </div>
        </div>
      ))}
    </div>
  );
}
