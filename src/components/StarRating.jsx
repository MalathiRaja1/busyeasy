function StarRating({ rating, onChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map(star => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''} ${readOnly ? '' : 'interactive'}`}
          onClick={() => !readOnly && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;