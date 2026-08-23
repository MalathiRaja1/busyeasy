import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDeals } from '../services/api';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';

function Deals() {
  const { t } = useTranslation();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDeals()
      .then(res => setDeals(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="deals-page">
      <div className="deals-hero">
        <h1>⚡ {t('flash_sale')}</h1>
        <p>{t('flash_sale_subtitle')}</p>
      </div>

      {loading ? (
        <p style={{ padding: '20px' }}>Loading...</p>
      ) : deals.length === 0 ? (
        <p className="no-deals">{t('no_active_deals')}</p>
      ) : (
        <div className="product-grid">
          {deals.map(p => (
            <div key={p.id} className="deal-card-wrapper">
              <div className="deal-badge">
                {Math.round(((p.price - p.salePrice) / p.price) * 100)}% OFF
              </div>
              <ProductCard product={{ ...p, price: p.salePrice, originalPrice: p.price }} />
              <div className="deal-timer-wrapper">
                <CountdownTimer endTime={p.saleEndsAt} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Deals;