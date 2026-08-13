import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchAutocomplete({ searchTerm, onSearchChange, products }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const suggestions = searchTerm.trim().length > 0
    ? products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (product) => {
    setShowSuggestions(false);
    onSearchChange('');
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="search-autocomplete" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search for products, brands and more"
        className="search-input"
        value={searchTerm}
        onChange={(e) => {
          onSearchChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />
      <button className="search-btn">🔍</button>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map(p => (
            <div
              key={p.id}
              className="search-suggestion-item"
              onClick={() => handleSelect(p)}
            >
              <img src={p.imageUrl} alt={p.name} className="suggestion-thumb" />
              <div className="suggestion-info">
                <span className="suggestion-name">{p.name}</span>
                <span className="suggestion-category">{p.category}</span>
              </div>
              <span className="suggestion-price">₹{p.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchAutocomplete;