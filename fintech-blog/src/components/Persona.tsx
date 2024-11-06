import React, { createContext, useContext, useState } from 'react';

interface PersonaContextType {
  displayName: string;
  setDisplayName: (name: string) => void;
  country: string;
  setCountry: (country: string) => void;
  hobby: string;
  setHobby: (hobby: string) => void;
  age: string;
  setAge: (age: string) => void;
  refreshKey: number;
  setRefreshKey: (key: number) => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [hobby, setHobby] = useState('');
  const [age, setAge] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <PersonaContext.Provider value={{ displayName, setDisplayName, country, setCountry, hobby, setHobby, age, setAge, refreshKey, setRefreshKey }}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = (): PersonaContextType => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};
