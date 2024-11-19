import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Import your styles here
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/target-demo-site">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
