import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { getProductReviews, createReview } from '../services/api';
import StarRating from './StarRating';

function ProductReviews({ productId }) {
  const { t } = useTranslation();
  const { token } = useSelector(state => state.auth);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const loadReviews = () => {
    getProductReviews(productId).then(res => setReviews(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

const handleSubmit = async (e) => {
  e.preventDefault();
  if (rating === 0) {
    toast.error(t('please_select_rating'));
    return;
  }
  setSubmitting(true);
  try {
    await createReview({ productId, rating, comment, imageUrl: imageUrl || null });
    toast.success(t('review_submitted'));
    setRating(0);
    setComment('');
    setImageUrl('');
    loadReviews();
  } catch (err) {
    toast.error(t('review_failed'));
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="reviews-section">
      <h2>{t('reviews')} {avgRating && `— ${avgRating} ★ (${reviews.length})`}</h2>

      {token ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <label>{t('your_rating')}:</label>
          <StarRating rating={rating} onChange={setRating} />
          <textarea
            placeholder={t('write_review')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <input
  type="text"
  placeholder={t('add_photo_url')}
  value={imageUrl}
  onChange={(e) => setImageUrl(e.target.value)}
  className="review-image-input"
/>
          <button type="submit" disabled={submitting}>
            {submitting ? t('submitting') : t('submit_review')}
          </button>
        </form>
      ) : (
        <p className="review-login-hint">{t('login_to_review')}</p>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>{t('no_reviews_yet')}</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="review-item">
              <div className="review-header">
                <strong>{r.userName}</strong>
                <StarRating rating={r.rating} readOnly />
                  {r.isVerifiedPurchase && (
      <span className="verified-badge">✓ {t('verified_purchase')}</span>
    )}
              </div>
              <p className="review-date">{new Date(r.createdAt).toLocaleDateString()}</p>
              {r.comment && <p className="review-comment">{r.comment}</p>}
              {r.imageUrl && (
    <img src={r.imageUrl} alt="Review" className="review-photo" />
  )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductReviews;