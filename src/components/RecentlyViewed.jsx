import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';

function RecentlyViewed({ excludeId }) {
  const { t } = useTranslation();
  const items = useSelector(state => state.recentlyViewed.items).filter(p => p.id !== excludeId);

  if (items.length === 0) return null;

  return (
    <div className="recently-viewed-section">
      <h2>{t('recently_viewed')}</h2>
      <div className="product-grid">
        {items.slice(0, 4).map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;