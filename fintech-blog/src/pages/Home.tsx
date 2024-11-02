import React, { useEffect } from 'react';

const Home: React.FC = () => {
  useEffect(() => {
    if (window.adobe && window.adobe.target) {
      window.adobe.target.triggerView('homepage');
    }
    // window.adobe.target.getOffers({
    //   mbox: 'home-mbox', // Name of your mbox
    //   success: (offers) => {
    //     window.adobe.target.applyOffers({ offers });
    //     console.log('Offers applied:', offers);
    //   },
    //   error: (error) => {
    //     console.error('Error fetching Adobe Target offers:', error);
    //   },
    // });
  }, []);
  return (
    <main>
      <h2>Welcome to FinTech Insights</h2>
      <p data-mbox-name="home-mbox">Your go-to source for the latest in fintech and stock market trends.</p>
      <h3>Featured Articles</h3>
      <ul>
        <li><a href="#">Understanding Fintech: What It Means for Investors</a></li>
        <li><a href="#">Top 5 Stock Market Trends to Watch in 2024</a></li>
        <li><a href="#">Investing 101: A Beginner’s Guide to the Stock Market</a></li>
      </ul>
    </main>
  );
};

export default Home;
