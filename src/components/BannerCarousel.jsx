import { useState, useEffect } from 'react';

const BANNERS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200', title: 'Big Fashion Sale', subtitle: 'Up to 50% off' },
  { id: 2, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200', title: 'Electronics Deals', subtitle: 'Latest gadgets, best prices' },
  { id: 3, image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200', title: 'Home Essentials', subtitle: 'Everything for your home' },
];

function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner-carousel">
      {BANNERS.map((banner, idx) => (
        <div
          key={banner.id}
          className={`banner-slide ${idx === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${banner.image})` }}
        >
          <div className="banner-content">
            <h2>{banner.title}</h2>
            <p>{banner.subtitle}</p>
          </div>
        </div>
      ))}
      <div className="banner-dots">
        {BANNERS.map((_, idx) => (
          <span
            key={idx}
            className={`banner-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerCarousel;