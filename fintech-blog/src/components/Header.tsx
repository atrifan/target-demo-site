import React, { useState, ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DropdownMenuProps {
  title: string;
  children: ReactNode;
}
interface HeaderProps {
  displayName: string;
  setDisplayName: (name: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="dropdown-btn">{title}</button>
      {open && <div className="dropdown-content">{children}</div>}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ displayName, setDisplayName }) => {
  useEffect(() => {
  }, []);
  const [inputName, setInputName] = useState('');

  const handleSetName = () => {
    setDisplayName(inputName);
  };

  return (
    <header>
      {/* Input and Set Name button above the title */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="name-input">Enter Name:</label>
        <input
          id="name-input"
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Enter your name"
          style={{ marginLeft: '10px' }}
        />
        <button onClick={handleSetName} style={{ marginLeft: '10px' }}>Set Name</button>
      </div>

      {displayName && <p>User.422 profile param set to: {displayName}</p>}

      <h1>Target demo site with at.js delivery</h1>
      <nav>
        <DropdownMenu title="A/B">
          <Link to="/target-demo-site/manual-allocate">Manual Allocate</Link>
          <Link to="/target-demo-site/auto-allocate">Auto Allocate</Link>
          <Link to="/target-demo-site/auto-allocate-a4t">Auto Allocate A4T</Link>
          <DropdownMenu title="Personalization">
            <Link to="/target-demo-site/personalization/at">Personalization AT</Link>
            <Link to="/target-demo-site/personalization/at-a4t">Personalization AT A4T</Link>
          </DropdownMenu>
        </DropdownMenu>

        <Link to="/target-demo-site/personalization/ap">Personalization AP</Link>
        <Link to="/target-demo-site/experience-targeting">Experience Targeting</Link>

        <Link to="/target-demo-site/mvt">MVT</Link>

        <DropdownMenu title="Recs">
          <Link to="/target-demo-site/criteria_sequence">Criteria Sequence</Link>
          <DropdownMenu title="Cart">
            <Link to="/target-demo-site/cart/target-demo-site/bought_bought">Bought Bought</Link>
            <Link to="/target-demo-site/cart/viewed_bought">Viewed Bought</Link>
            <Link to="/target-demo-site/cart/viewed_viewed">Viewed Viewed</Link>
            <DropdownMenu title="Analytics">
              <Link to="/target-demo-site/cart/bought_bought_analytics">Bought Bought Analytics</Link>
              <Link to="/target-demo-site/cart/viewed_bought_analytics">Viewed Bought Analytics</Link>
              <Link to="/target-demo-site/cart/viewed_viewed_analytics">Viewed Viewed Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="Popularity">
            <Link to="/target-demo-site/popularity/most-viewed-across-site">Most Viewed Across Site</Link>
            <Link to="/target-demo-site/popularity/most-viewed-by-category">Most Viewed by Category</Link>
            <Link to="/target-demo-site/popularity/most-viewed-by-attribute">Most Viewed by Attribute</Link>
            <Link to="/target-demo-site/popularity/top-sellers-across-site">Top Sellers Across Site</Link>
            <Link to="/target-demo-site/popularity/top-sellers-by-category">Top Sellers by Category</Link>
            <Link to="/target-demo-site/popularity/top-sellers-by-item-attribute">Top Sellers by Item Attribute</Link>
            <DropdownMenu title="Analytics">
              <Link to="/target-demo-site/popularity/most-viewed-across-site-analytics">Most Viewed Across Site Analytics</Link>
              <Link to="/target-demo-site/popularity/most-viewed-by-category-analytics">Most Viewed by Category Analytics</Link>
              <Link to="/target-demo-site/popularity/most-viewed-by-attribute-analytics">Most Viewed by Attribute Analytics</Link>
              <Link to="/target-demo-site/popularity/top-sellers-across-site-analytics">Top Sellers Across Site Analytics</Link>
              <Link to="/target-demo-site/popularity/top-sellers-by-category-analytics">Top Sellers by Category Analytics</Link>
              <Link to="/target-demo-site/popularity/top-sellers-by-item-attribute-analytics">Top Sellers by Item Attribute Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="Item Based">
            <Link to="/target-demo-site/item/viewed_viewed">Viewed Viewed</Link>
            <Link to="/target-demo-site/item/viewed_bought">Viewed Bought</Link>
            <Link to="/target-demo-site/item/bought_bought">Bought Bought</Link>
            <Link to="/target-demo-site/item/content_similarity">Content Similarity</Link>
            <DropdownMenu title="Analytics">
              <Link to="/target-demo-site/item//viewed_viewed_analytics">Viewed Viewed Analytics</Link>
              <Link to="/target-demo-site/item//viewed_bought_analytics">Viewed Bought Analytics</Link>
              <Link to="/target-demo-site/item//bought_bought_analytics">Bought Bought Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="User Based">
            <Link to="/target-demo-site/userbased/recently_viewed">Recently Viewed</Link>
            <Link to="/target-demo-site/userbased/recommended_for_you">Recommended for You</Link>
            <Link to="/target-demo-site/userbased/recommended_for_you_analytics">Recommended for You Analytics</Link>
          </DropdownMenu>

          <DropdownMenu title="Custom">
            <Link to="/target-demo-site/custom/custom_algo">Custom Algo</Link>
            <Link to="/target-demo-site/custom/custom_algo_analytics">Custom Algo Analytics</Link>
          </DropdownMenu>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;
