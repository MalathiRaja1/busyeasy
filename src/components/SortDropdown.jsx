import { useTranslation } from 'react-i18next';

function SortDropdown({ sortBy, onSortChange }) {
  const { t } = useTranslation();

  return (
    <select className="sort-dropdown" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
      <option value="relevance">{t('sort_relevance')}</option>
      <option value="price_low">{t('sort_price_low')}</option>
      <option value="price_high">{t('sort_price_high')}</option>
      <option value="name_asc">{t('sort_name')}</option>
    </select>
  );
}

export default SortDropdown;