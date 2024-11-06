import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePersona } from './Persona';  // Import the context hook

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

  // Populate fields on component load if they are empty
  useEffect(() => {
    const shouldSave = !displayName || !country || !hobby || !age;
    if (!displayName) setInputName(getRandomValue(nameOptions));
    if (!country) setInputCountry(getRandomValue(countryOptions));
    if (!hobby) setInputHobby(getRandomValue(hobbyOptions));
    if (!age) setInputAge(getRandomValue(ageOptions));
    if (shouldSave) handleSave();
  }, [displayName, country, hobby, age, refreshKey]);

  const handleSave = (event?: any) => {
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
      {/* Input fields for Name, Country, Hobby, and Age */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="name-input">Enter Name:</label>
        <input
          id="name-input"
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Enter your name"
          style={{ marginLeft: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="country-input">Enter Country:</label>
        <input
          id="country-input"
          type="text"
          value={inputCountry}
          onChange={(e) => setInputCountry(e.target.value)}
          placeholder="Enter your country"
          style={{ marginLeft: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="hobby-input">Enter Hobby:</label>
        <input
          id="hobby-input"
          type="text"
          value={inputHobby}
          onChange={(e) => setInputHobby(e.target.value)}
          placeholder="Enter your hobby"
          style={{ marginLeft: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="age-input">Enter Age:</label>
        <input
          id="age-input"
          type="text"
          value={inputAge}
          onChange={(e) => setInputAge(e.target.value)}
          placeholder="Enter your age"
          style={{ marginLeft: '10px' }}
        />
      </div>

      {/* Displaying profile details */}
      {displayName && <p>User profile param set to: {displayName}</p>}
      {country && <p>Country: {country}</p>}
      {hobby && <p>Hobby: {hobby}</p>}
      {age && <p>Age: {age}</p>}

      {/* Save button that triggers the persona data saving */}
      <button onClick={handleSave}>Save</button>

      <h1>Target demo site with at.js delivery</h1>
      <nav>
        <DropdownMenu title="A/B">
          <Link to="/target-demo-site/manual-allocate">Manual Allocate</Link>
          <Link to="/target-demo-site/auto-allocate">Auto Allocate</Link>
          <Link to="/target-demo-site/auto-allocate-a4t">Auto Allocate A4T</Link>
          <DropdownMenu title="Personalization">
            <Link to="/target-demo-site/personalization/at">Personalization AT</Link>
            <Link to="/target-demo-site/personalization/at-a4t">Personalization AT A4T</Link>
          </DropdownMenu>
        </DropdownMenu>

        <Link to="/target-demo-site/personalization/ap">Personalization AP</Link>
        <Link to="/target-demo-site/experience-targeting">Experience Targeting</Link>
        <Link to="/target-demo-site/mvt">MVT</Link>

        {/* Other Dropdown Menus */}
        <DropdownMenu title="Recs">
          <Link to="/target-demo-site/criteria_sequence">Criteria Sequence</Link>
          <DropdownMenu title="Cart">
            <Link to="/target-demo-site/cart/target-demo-site/bought_bought">Bought Bought</Link>
            <Link to="/target-demo-site/cart/viewed_bought">Viewed Bought</Link>
            <Link to="/target-demo-site/cart/viewed_viewed">Viewed Viewed</Link>
            <DropdownMenu title="Analytics">
              <Link to="/target-demo-site/cart/bought_bought_analytics">Bought Bought Analytics</Link>
              <Link to="/target-demo-site/cart/viewed_bought_analytics">Viewed Bought Analytics</Link>
              <Link to="/target-demo-site/cart/viewed_viewed_analytics">Viewed Viewed Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="Popularity">
            <Link to="/target-demo-site/popularity/most-viewed-across-site">Most Viewed Across Site</Link>
            <Link to="/target-demo-site/popularity/most-viewed-by-category">Most Viewed by Category</Link>
            <Link to="/target-demo-site/popularity/most-viewed-by-attribute">Most Viewed by Attribute</Link>
            <Link to="/target-demo-site/popularity/top-sellers-across-site">Top Sellers Across Site</Link>
            <Link to="/target-demo-site/popularity/top-sellers-by-category">Top Sellers by Category</Link>
            <Link to="/target-demo-site/popularity/top-sellers-by-item-attribute">Top Sellers by Item Attribute</Link>
            <DropdownMenu title="Analytics">
              <Link to="/target-demo-site/popularity/most-viewed-across-site-analytics">Most Viewed Across Site
                Analytics</Link>
              <Link to="/target-demo-site/popularity/most-viewed-by-category-analytics">Most Viewed by Category
                Analytics</Link>
              <Link to="/target-demo-site/popularity/most-viewed-by-attribute-analytics">Most Viewed by Attribute
                Analytics</Link>
              <Link to="/target-demo-site/popularity/top-sellers-across-site-analytics">Top Sellers Across Site
                Analytics</Link>
              <Link to="/target-demo-site/popularity/top-sellers-by-category-analytics">Top Sellers by Category
                Analytics</Link>
              <Link to="/target-demo-site/popularity/top-sellers-by-item-attribute-analytics">Top Sellers by Item
                Attribute Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="Item Based">
            <Link to="/target-demo-site/item/viewed_viewed">Viewed Viewed</Link>
            <Link to="/target-demo-site/item/viewed_bought">Viewed Bought</Link>
            <Link to="/target-demo-site/item/bought_bought">Bought Bought</Link>
            <Link to="/target-demo-site/item/content_similarity">Content Similarity</Link>
            <DropdownMenu title="Analytics">
              <Link to="/target-demo-site/item/viewed_viewed_analytics">Viewed Viewed Analytics</Link>
              <Link to="/target-demo-site/item/viewed_bought_analytics">Viewed Bought Analytics</Link>
              <Link to="/target-demo-site/item/bought_bought_analytics">Bought Bought Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="User Based">
            <Link to="/target-demo-site/userbased/recently_viewed">Recently Viewed</Link>
            <Link to="/target-demo-site/userbased/recommended_for_you">Recommended for You</Link>
            <Link to="/target-demo-site/userbased/recommended_for_you_analytics">Recommended for You Analytics</Link>
          </DropdownMenu>

          <DropdownMenu title="Custom">
            <Link to="/target-demo-site/custom/custom_algo">Custom Algo</Link>
            <Link to="/target-demo-site/custom/custom_algo_analytics">Custom Algo Analytics</Link>
          </DropdownMenu>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;
