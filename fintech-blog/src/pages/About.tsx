import React, { useEffect } from 'react';

const About: React.FC = () => {
  useEffect(() => {
    if (window.adobe && window.adobe.target) {
      window.adobe.target.triggerView('about');
    }
  }, []);
  return (
    <main>
      <h2>About FinTech Insights</h2>
      <p>This blog is dedicated to exploring financial technology and stock market strategies. Join us as we navigate the future of finance!</p>
    </main>
  );
};

export default About;
