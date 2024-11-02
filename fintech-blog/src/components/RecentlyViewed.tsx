// src/pages/RecentlyViewed.tsx
import React from 'react';

interface Stock {
  symbol: string;
  name: string;
  price?: number;
}

interface RecentlyViewedProps {
  stocks: Stock[];
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ stocks }) => {
  return (
    <div>
      <h3>Recently Viewed</h3>
      {stocks.length === 0 ? (
        <p>No recently viewed stocks.</p>
      ) : (
        <ul className="recently-viewed-list">
          {stocks.map((stock, index) => (
            <li key={index}>
              {stock.name} ({stock.symbol}) - ${stock.price?.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentlyViewed;
