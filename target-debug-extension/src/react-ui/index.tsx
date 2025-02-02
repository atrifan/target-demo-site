import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Import your styles here
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PersonaProvider, usePersona } from './components/Persona';
import Header from 'src/react-ui/components/Header';

const root = ReactDOM.createRoot(document.getElementById('react-root')!);
const PersonaConsumer: React.FC<{ children: (value: any) => React.ReactNode }> = ({ children }) => {
  const persona = usePersona(); // Hook to access persona context
  return <>{children(persona)}</>; // Pass persona context to children
};


root.render(
  <React.StrictMode>
    <PersonaProvider> {/* Wrap everything inside PersonaProvider */}
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/*" element={
            <PersonaConsumer>
              {({ displayName, country, hobby, age }) => (
                <App
                  displayName={displayName}
                  country={country}
                  hobby={hobby}
                  age={age}
                />
              )}
            </PersonaConsumer>
          } />
        </Routes>
      </BrowserRouter>
    </PersonaProvider>
  </React.StrictMode>
);
