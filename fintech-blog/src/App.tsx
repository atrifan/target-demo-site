import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Stocks from './pages/Stocks';

const App: React.FC = () => {
  useEffect(() => {
    // Check if the Adobe Target library is loaded
    // if (window.adobe && window.adobe.target) {
    //   window.adobe.target.init();
    // }
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/target-demo-site/home" element={<Home />} />
        <Route path="/target-demo-site/about" element={<About />} />
        <Route path="/target-demo-site/contact" element={<Contact />} />
        <Route path="/target-demo-site/stocks" element={<Stocks />} /> {/* Add the Stocks route */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;