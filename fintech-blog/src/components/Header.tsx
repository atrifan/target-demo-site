import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <h1>FinTech Insights</h1>
      <nav>
        <Link to="/target-demo-site/home">Home</Link>
        <Link to="/target-demo-site/about">About</Link>
        <Link to="/target-demo-site/contact">Contact</Link>
        <Link to="/target-demo-site/stocks">Stocks</Link>
      </nav>
    </header>
  );
};

export default Header;