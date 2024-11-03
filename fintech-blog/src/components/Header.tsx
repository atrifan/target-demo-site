import React, { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface DropdownMenuProps {
  title: string;
  children: ReactNode;
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

const Header: React.FC = () => {
  return (
    <header>
      <h1>FinTech Insights</h1>
      <nav>
        <DropdownMenu title="A/B">
          <Link to="/manual-allocate">Manual Allocate</Link>
          <Link to="/auto-allocate">Auto Allocate</Link>
          <Link to="/personalization-at">Personalization AT</Link>
          <Link to="/personalization-ap">Personalization AP</Link>
        </DropdownMenu>

        <Link to="/experience-targeting">Experience Targeting</Link>

        <Link to="/mvt">MVT</Link>

        <DropdownMenu title="Recs">
          <Link to="/criteria_sequence">Criteria Sequence</Link>
          <DropdownMenu title="Cart">
            <Link to="/bought_bought">Bought Bought</Link>
            <Link to="/viewed_bought">Viewed Bought</Link>
            <Link to="/viewed_viewed">Viewed Viewed</Link>
            <DropdownMenu title="Analytics">
              <Link to="/bought_bought_analytics">Bought Bought Analytics</Link>
              <Link to="/viewed_bought_analytics">Viewed Bought Analytics</Link>
              <Link to="/viewed_viewed_analytics">Viewed Viewed Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="Popularity">
            <Link to="/most-viewed-across-site">Most Viewed Across Site</Link>
            <Link to="/most-viewed-by-category">Most Viewed by Category</Link>
            <Link to="/most-viewed-by-attribute">Most Viewed by Attribute</Link>
            <Link to="/top-sellers-across-site">Top Sellers Across Site</Link>
            <Link to="/top-sellers-by-category">Top Sellers by Category</Link>
            <Link to="/top-sellers-by-item-attribute">Top Sellers by Item Attribute</Link>
            <DropdownMenu title="Analytics">
              <Link to="/most-viewed-across-site-analytics">Most Viewed Across Site Analytics</Link>
              <Link to="/most-viewed-by-category-analytics">Most Viewed by Category Analytics</Link>
              <Link to="/most-viewed-by-attribute-analytics">Most Viewed by Attribute Analytics</Link>
              <Link to="/top-sellers-across-site-analytics">Top Sellers Across Site Analytics</Link>
              <Link to="/top-sellers-by-category-analytics">Top Sellers by Category Analytics</Link>
              <Link to="/top-sellers-by-item-attribute-analytics">Top Sellers by Item Attribute Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="Item Based">
            <Link to="/viewed_viewed">Viewed Viewed</Link>
            <Link to="/viewed_bought">Viewed Bought</Link>
            <Link to="/bought_bought">Bought Bought</Link>
            <Link to="/content_similarity">Content Similarity</Link>
            <DropdownMenu title="Analytics">
              <Link to="/viewed_viewed_analytics">Viewed Viewed Analytics</Link>
              <Link to="/viewed_bought_analytics">Viewed Bought Analytics</Link>
              <Link to="/bought_bought_analytics">Bought Bought Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="User Based">
            <Link to="/recently_viewed">Recently Viewed</Link>
            <Link to="/recommended_for_you">Recommended for You</Link>
            <Link to="/recommended_for_you_analytics">Recommended for You Analytics</Link>
          </DropdownMenu>

          <DropdownMenu title="Custom">
            <Link to="/custom_algo">Custom Algo</Link>
            <Link to="/custom_algo_analytics">Custom Algo Analytics</Link>
          </DropdownMenu>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;
