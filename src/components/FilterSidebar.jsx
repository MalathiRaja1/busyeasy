import { useTranslation } from 'react-i18next';

function FilterSidebar({ filters, onFilterChange, priceRange, products }) {
  const { t } = useTranslation();

  const categories = [...new Set(products.map(p => p.category))];
  const maxPrice = Math.max(...products.map(p => p.price), 1000);

  return (
    <div className="filter-sidebar">
      <h3>{t('filters')}</h3>

      <div className="filter-group">
        <h4>{t('price')}</h4>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="price-slider"
        />
        <div className="price-range-label">
          ₹0 - ₹{filters.maxPrice}
        </div>
      </div>

      <div className="filter-group">
        <h4>{t('category')}</h4>
        {categories.map(cat => (
          <label key={cat} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={(e) => {
                const newCategories = e.target.checked
                  ? [...filters.categories, cat]
                  : filters.categories.filter(c => c !== cat);
                onFilterChange({ ...filters, categories: newCategories });
              }}
            />
            {cat}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>{t('availability')}</h4>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
          />
          {t('in_stock_only')}
        </label>
      </div>

      <button
        className="clear-filters-btn"
        onClick={() => onFilterChange({ maxPrice: maxPrice, categories: [], inStockOnly: false })}
      >
        {t('clear_filters')}
      </button>
    </div>
  );
}

export default FilterSidebar;