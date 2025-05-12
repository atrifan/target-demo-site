import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { usePersona } from './Persona';
import './Header.css';

interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
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

const Header: React.FC<{ refreshOnSave: () => void }> = ({ refreshOnSave }) => {
  const {
    displayName, setDisplayName,
    country, setCountry,
    hobby, setHobby,
    age, setAge
  } = usePersona();

  const navigate = useNavigate();
  const nameOptions = ['Alice', 'Bob', 'Charlie', 'David'];
  const countryOptions = ['USA', 'Canada', 'UK', 'Germany'];
  const hobbyOptions = ['Reading', 'Sports', 'Cooking', 'Traveling'];
  const ageOptions = ['25', '30', '35', '40'];

  const getRandomValue = (options: string[]) => {
    return options[Math.floor(Math.random() * options.length)];
  };

  const [inputName, setInputName] = useState(displayName || '');
  const [inputCountry, setInputCountry] = useState(country || '');
  const [inputHobby, setInputHobby] = useState(hobby || '');
  const [inputAge, setInputAge] = useState(age || '');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsInCart, setItemsInCart] = useState(0);

  // Prevent multiple initial saves
  const hasSaved = useRef(false);

  // Populate missing fields with random values on mount or when persona fields change
  useEffect(() => {
    if (!displayName) setInputName(getRandomValue(nameOptions));
    if (!country) setInputCountry(getRandomValue(countryOptions));
    if (!hobby) setInputHobby(getRandomValue(hobbyOptions));
    if (!age) setInputAge(getRandomValue(ageOptions));
    // eslint-disable-next-line
  }, [displayName, country, hobby, age]);

  // When all input fields are ready and persona fields are missing, call handleSave ONCE
  useEffect(() => {
    const shouldSave =
      (!displayName || !country || !hobby || !age) &&
      inputName && inputCountry && inputHobby && inputAge;

    if (shouldSave && !hasSaved.current) {
      hasSaved.current = true; // prevent multiple calls
      handleSave();
    }
    // eslint-disable-next-line
  }, [inputName, inputCountry, inputHobby, inputAge, displayName, country, hobby, age]);

  const handleLinkClick = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    const updatedSearchParams = new URLSearchParams(searchParams);
    Array.from(updatedSearchParams.entries()).forEach(([key]) => {
      if (key.startsWith("at_preview")) {
        updatedSearchParams.delete(key);
      }
    });
    setSearchParams(updatedSearchParams);
    navigate({
      pathname: to,
      search: updatedSearchParams.toString()
    });
  };

  const handleSave = (event?: any) => {
    setIsModalOpen(false);
    if (event) {
      event.preventDefault();
    }
    const savedName = inputName || getRandomValue(nameOptions);
    const savedCountry = inputCountry || getRandomValue(countryOptions);
    const savedHobby = inputHobby || getRandomValue(hobbyOptions);
    const savedAge = inputAge || getRandomValue(ageOptions);

    setDisplayName(savedName);
    setCountry(savedCountry);
    setHobby(savedHobby);
    setAge(savedAge);
    refreshOnSave();
  };

  return (
    <header>
      <div className={"header-top"}>
        <div className="profile-container">
          <div className="profile-icon" onClick={() => setIsModalOpen(true)}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4794/4794936.png"
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-details">
              <p>{displayName}</p>
              <p>{country}</p>
              <p>{hobby}</p>
              <p>{age} years old</p>
            </div>
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Edit Profile</h2>
                <div className="form-group">
                  <label htmlFor="name-input">Name:</label>
                  <input
                    id="name-input"
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country-input">Country:</label>
                  <input
                    id="country-input"
                    type="text"
                    value={inputCountry}
                    onChange={(e) => setInputCountry(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hobby-input">Hobby:</label>
                  <input
                    id="hobby-input"
                    type="text"
                    value={inputHobby}
                    onChange={(e) => setInputHobby(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age-input">Age:</label>
                  <input
                    id="age-input"
                    type="text"
                    value={inputAge}
                    onChange={(e) => setInputAge(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={() => setIsModalOpen(false)} className="cancel-button">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="save-button">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Cart icon and other header elements can go here */}
      </div>
    </header>
  );
};

export default Header;
