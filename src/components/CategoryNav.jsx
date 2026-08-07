import { useTranslation } from 'react-i18next';

const CATEGORIES = [
  { key: 'all', label: 'all_categories', icon: '🏠', match: null },
  { key: 'fashion', label: 'fashion', icon: '👕', match: ['Clothing', 'Footwear', 'Accessories'] },
  { key: 'electronics', label: 'electronics', icon: '📱', match: ['Electronics'] },
  { key: 'home', label: 'home_kitchen', icon: '🏡', match: ['Home Appliances', 'Home Decor', 'Bags', 'Home & Kitchen'] },
  { key: 'sports', label: 'sports_fitness', icon: '⚽', match: ['Sports & Fitness'] },
];

function CategoryNav({ selectedCategory, onSelectCategory }) {
  const { t } = useTranslation();

  return (
    <div className="category-nav">
      {CATEGORIES.map(cat => (
        <button
          key={cat.key}
          className={`category-item ${selectedCategory === cat.key ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat.key, cat.match)}
        >
          <span className="category-icon">{cat.icon}</span>
          <span className="category-label">{t(cat.label)}</span>
        </button>
      ))}
    </div>
  );
}

export default CategoryNav;