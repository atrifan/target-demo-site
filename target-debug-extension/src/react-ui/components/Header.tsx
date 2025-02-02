import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate} from 'react-router-dom';
import { usePersona } from './Persona';  // Import the context hook
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
  const { displayName, setDisplayName, country, setCountry, hobby, setHobby, age, setAge, refreshKey, setRefreshKey} = usePersona();  // Use the context here

  const navigate = useNavigate();
  // List of possible values for each field
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

  // Populate fields on component load if they are empty
  useEffect(() => {
    const shouldSave = !displayName || !country || !hobby || !age;
    if (!displayName) setInputName(getRandomValue(nameOptions));
    if (!country) setInputCountry(getRandomValue(countryOptions));
    if (!hobby) setInputHobby(getRandomValue(hobbyOptions));
    if (!age) setInputAge(getRandomValue(ageOptions));
    if (shouldSave) handleSave();
  }, [displayName, country, hobby, age, refreshKey]);

  const handleLinkClick = (e: React.MouseEvent, to: string) => {
    e.preventDefault(); // Prevent the default navigation behavior

    // Create a new instance of URLSearchParams to modify the search params
    const updatedSearchParams = new URLSearchParams(searchParams);

    // Iterate through all search params and delete those starting with 'at_preview'
    Array.from(updatedSearchParams.entries()).forEach(([key]) => {
      if (key.startsWith("at_preview")) {
        updatedSearchParams.delete(key);
      }
    });

    // Update the searchParams with the modified URLSearchParams
    setSearchParams(updatedSearchParams);

    navigate({
      pathname: to,
      search: updatedSearchParams.toString() // Pass updated search params with other params retained
    });
  };

  const handleSave = (event?: any) => {
    setIsModalOpen(false);
    if (event) {
      event.preventDefault();
    }
    // If input fields are empty, generate random values
    const savedName = inputName || getRandomValue(nameOptions);
    const savedCountry = inputCountry || getRandomValue(countryOptions);
    const savedHobby = inputHobby || getRandomValue(hobbyOptions);
    const savedAge = inputAge || getRandomValue(ageOptions);

    // Save the updated persona information
    setDisplayName(savedName);
    setCountry(savedCountry);
    setHobby(savedHobby);
    setAge(savedAge);
    // Increment the refresh key to trigger re-render
    refreshOnSave();
  };

  return (
    <header>
      <div className={"header-top"}>
        {/* Input fields for Name, Country, Hobby, and Age */}
        <div className="profile-container">
          {/* Profile Icon */}
          <div className="profile-icon" onClick={() => setIsModalOpen(true)}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4794/4794936.png" // Replace with user's avatar if available
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

          {/* Modal */}
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

          {/*<div className="cart-icon">*/}
          {/*  <img*/}
          {/*    src="https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/shopping_cart.png"*/}
          {/*    alt="Cart Icon"*/}
          {/*    className="cart-image"*/}
          {/*  />*/}
          {/*  <div className="cart-bubble">{itemsInCart}</div>*/}
          {/*</div>*/}
      </div>
    </header>
  );
};

export default Header;
