import React, { useState } from 'react';
import axios from 'axios';
import RecentlyViewed from '../components/RecentlyViewed';

interface Stock {
  symbol: string;
  name: string;
  price?: number;
}

const Stocks: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Sample static stock data for suggestions
  const stockList: Stock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    // Add more stocks as needed
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term) {
      const filteredSuggestions = stockList.filter(stock =>
        stock.name.toLowerCase().includes(term)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const getCrumb = async () => {
    try {
      const corsProxy = '';
      const response = await axios.get(`${corsProxy}https://query2.finance.yahoo.com/v1/test/getcrumb`,{
        headers: {
          'Cookie': 'GUCS=AUMYa2MF; GUC=AQABCAFnJ-pnVkIgPgSw&s=AQAAADdqExb0&g=ZyafjA; A3=d=AQABBHCfJmcCEHNNF1SHmfK-cHOyYmqXkO4FEgABCAHqJ2dWZ_Glb2UB9qMAAAcIb58mZ7iXwaA&S=AQAAAqDeYUiSGRcjwpXhsNiF3iM; A1S=d=AQABBHCfJmcCEHNNF1SHmfK-cHOyYmqXkO4FEgABCAHqJ2dWZ_Glb2UB9qMAAAcIb58mZ7iXwaA&S=AQAAAqDeYUiSGRcjwpXhsNiF3iM; EuConsent=CQHdjMAQHdjMAAOACBROBNFoAP_gAEPgACiQKZNB9G7WTXFneXp2YPskOYUX0VBJ4MAwBgCBAcABzBIUIBwGVmAzJEyIICACGAIAIGBBIABtGAhAQEAAYIAFAABIAEgAIBAAIGAAACAAAABACAAAAAAAAAAQgEAXMBQgmAZEBFoIQUhAggAgAQAAAAAEAIgBCgQAEAAAQAAICAAIACgAAgAAAAAAAAAEAFAIEQAAAAECAotkfQAAAAAAAAAAAAAAAAABBTIAEg1KiAIsCQkIBAwggQAiCgIAKBAAAAAQIAAACYIChAGASowEQAgBAAAAAAAAAAQAIAAAIAEIAAgACBAAAAABAAEABAIAAAQAAAAAAAAAAAAAAAAAAAAAAAAAxACEEAAIAIIACCgAAAAEAAAAAAAAABEAAQAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAABAAAAAAAAAEAIgsAAAAAAAAAAAAAAAAAAIAA; A1=d=AQABBHCfJmcCEHNNF1SHmfK-cHOyYmqXkO4FEgABCAHqJ2dWZ_Glb2UB9qMAAAcIb58mZ7iXwaA&S=AQAAAqDeYUiSGRcjwpXhsNiF3iM; PRF=t%3DBTC-USD; cmp=t=1730584452&j=1&u=1---&v=50; axids=gam=y-po9AeSVE2uK1U3KUDdpxXberxX8veyfi~A&dv360=eS10Y2FGUEJGRTJ1RkhUMlRRdlBDQjFwZjN1dV9mYXQ5QX5B&ydsp=y-w0SiF7VE2uIf_MrvmBMFwazDObZIZRhA~A&tbla=y-XwNSsfpE2uIfYsWuJmEOzPYlc_y8QDkr~A; tbla_id=255871b3-eebd-482f-916a-fd95f87f8261-tucte202504',
        }
      });
      return response.data.crumb;
    } catch (error) {
      console.error("Error fetching crumb:", error);
      return null;
    }
  };

  const fetchStockPrice = async (symbol: string) => {
    const crumb = await getCrumb();
    if (!crumb) {
      console.error("Could not retrieve crumb value.");
      return null;
    }

    try {
      const corsProxy = '';
      const response = await axios.get(`${corsProxy}https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}&crumb=${crumb}`, {
        headers: {
        'Cookie': 'GUCS=AUMYa2MF; GUC=AQABCAFnJ-pnVkIgPgSw&s=AQAAADdqExb0&g=ZyafjA; A3=d=AQABBHCfJmcCEHNNF1SHmfK-cHOyYmqXkO4FEgABCAHqJ2dWZ_Glb2UB9qMAAAcIb58mZ7iXwaA&S=AQAAAqDeYUiSGRcjwpXhsNiF3iM; A1S=d=AQABBHCfJmcCEHNNF1SHmfK-cHOyYmqXkO4FEgABCAHqJ2dWZ_Glb2UB9qMAAAcIb58mZ7iXwaA&S=AQAAAqDeYUiSGRcjwpXhsNiF3iM; EuConsent=CQHdjMAQHdjMAAOACBROBNFoAP_gAEPgACiQKZNB9G7WTXFneXp2YPskOYUX0VBJ4MAwBgCBAcABzBIUIBwGVmAzJEyIICACGAIAIGBBIABtGAhAQEAAYIAFAABIAEgAIBAAIGAAACAAAABACAAAAAAAAAAQgEAXMBQgmAZEBFoIQUhAggAgAQAAAAAEAIgBCgQAEAAAQAAICAAIACgAAgAAAAAAAAAEAFAIEQAAAAECAotkfQAAAAAAAAAAAAAAAAABBTIAEg1KiAIsCQkIBAwggQAiCgIAKBAAAAAQIAAACYIChAGASowEQAgBAAAAAAAAAAQAIAAAIAEIAAgACBAAAAABAAEABAIAAAQAAAAAAAAAAAAAAAAAAAAAAAAAxACEEAAIAIIACCgAAAAEAAAAAAAAABEAAQAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAABAAAAAAAAAEAIgsAAAAAAAAAAAAAAAAAAIAA; A1=d=AQABBHCfJmcCEHNNF1SHmfK-cHOyYmqXkO4FEgABCAHqJ2dWZ_Glb2UB9qMAAAcIb58mZ7iXwaA&S=AQAAAqDeYUiSGRcjwpXhsNiF3iM; PRF=t%3DBTC-USD; cmp=t=1730584452&j=1&u=1---&v=50; axids=gam=y-po9AeSVE2uK1U3KUDdpxXberxX8veyfi~A&dv360=eS10Y2FGUEJGRTJ1RkhUMlRRdlBDQjFwZjN1dV9mYXQ5QX5B&ydsp=y-w0SiF7VE2uIf_MrvmBMFwazDObZIZRhA~A&tbla=y-XwNSsfpE2uIfYsWuJmEOzPYlc_y8QDkr~A; tbla_id=255871b3-eebd-482f-916a-fd95f87f8261-tucte202504',
        }
      });
      if (response.data.quoteResponse.result.length > 0) {
        const price = response.data.quoteResponse.result[0].regularMarketPrice;
        return price;
      } else {
        throw new Error('No data found for the stock symbol.');
      }
    } catch (error) {
      console.error("Error fetching stock price:", error);
      setError("Could not fetch stock price. Please try again later.");
      return null;
    }
  };

  const handleSelectStock = async (stock: Stock) => {
    setSelectedStock(stock);
    setSearchTerm('');
    setSuggestions([]);

    const price = await fetchStockPrice(stock.symbol);
    if (price !== null) {
      const viewedStock = { ...stock, price };
      setSelectedStock(viewedStock);
      setRecentlyViewed(prev => [...prev, viewedStock]); // Add to recently viewed stocks
    }
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
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(stock => (
            <li key={stock.symbol} onClick={() => handleSelectStock(stock)}>
              {stock.name} ({stock.symbol})
            </li>
          ))}
        </ul>
      )}
      {selectedStock && (
        <div className="stock-card">
          <h3>{selectedStock.name} ({selectedStock.symbol})</h3>
          <p>Price: ${selectedStock.price?.toFixed(2)}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <hr /> {/* Separator */}
      <RecentlyViewed stocks={recentlyViewed} />
    </div>
  );
};

export default Stocks;
