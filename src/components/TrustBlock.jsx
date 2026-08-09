import { useTranslation } from 'react-i18next';

function TrustBlock() {
  const { t } = useTranslation();

  return (
    <div className="trust-block">
      <div className="trust-header">
        <span className="trust-seller-name">{t('sold_by')} BuyEasy</span>
        <span className="trust-rating">⭐ 4.5</span>
      </div>

      <div className="trust-features">
        <div className="trust-feature">
          <span className="trust-icon">🔒</span>
          <span>{t('secure_payments')}</span>
        </div>
        <div className="trust-feature">
          <span className="trust-icon">↩️</span>
          <span>{t('easy_returns')}</span>
        </div>
        <div className="trust-feature">
          <span className="trust-icon">🚚</span>
          <span>{t('fast_delivery')}</span>
        </div>
        <div className="trust-feature">
          <span className="trust-icon">✅</span>
          <span>{t('genuine_products')}</span>
        </div>
      </div>
    </div>
  );
}

export default TrustBlock;