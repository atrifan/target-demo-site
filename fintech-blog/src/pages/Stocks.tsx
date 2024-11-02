// src/pages/Stocks.tsx
import React, { useState, useEffect } from 'react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
}

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);

  // Sample stocks data (you may fetch this from an API)
  useEffect(() => {
    const sampleStocks: Stock[] = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 150 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2800 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3400 },
      // Add more stocks as needed
    ];
    setStocks(sampleStocks);
    setFilteredStocks(sampleStocks); // Initialize with all stocks
  }, []);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredStocks(stocks.filter(stock =>
      stock.symbol.toLowerCase().includes(term) ||
      stock.name.toLowerCase().includes(term)
    ));
  };

  return (
    <div>
      <h2>Stocks</h2>
      <input
        type="text"
        placeholder="Search for a stock..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="stocks-list">
        {filteredStocks.map(stock => (
          <div key={stock.symbol} className="stock-card">
            <h3>{stock.name} ({stock.symbol})</h3>
            <p>Price: ${stock.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stocks;
