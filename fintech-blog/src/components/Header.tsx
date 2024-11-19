import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();

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
          <Link to={{
            pathname: "/target-demo-site/ab",
            search: searchParams.toString()
          }}>A/B Manual Allocate</Link>
          <Link to={{
            pathname: "/target-demo-site/personalization/aa",
            search: searchParams.toString()
          }}>Auto Allocate</Link>
          <Link to={{
            pathname: "/target-demo-site/personalization/aa/a4t",
            search: searchParams.toString()
          }}>Auto Allocate A4T</Link>
          <DropdownMenu title="Personalization">
            <Link to={{
              pathname: "/target-demo-site/personalization/at",
              search: searchParams.toString()
            }}>Personalization AT</Link>
            <Link to={{
              pathname: "/target-demo-site/personalization/at/a4t",
              search: searchParams.toString()
            }}>Personalization AT A4T</Link>
          </DropdownMenu>
        </DropdownMenu>

        <Link to={{
          pathname: "/target-demo-site/personalization/ap",
          search: searchParams.toString()
        }}>Personalization AP</Link>
        <Link to={{
          pathname: "/target-demo-site/experience-targeting",
          search: searchParams.toString()
        }}>Experience Targeting</Link>
        <Link to={{
          pathname: "/target-demo-site/mvt",
          search: searchParams.toString()
        }}>MVT</Link>

        {/* Other Dropdown Menus */}
        <DropdownMenu title="Recs">
          <Link to={{
            pathname: "/target-demo-site/criteria_sequence",
            search: searchParams.toString()
          }}>Criteria Sequence</Link>
          <DropdownMenu title="Cart">
            <Link to={{
              pathname: "/target-demo-site/cart/target-demo-site/bought_bought",
              search: searchParams.toString()
            }}>Bought Bought</Link>
            <Link to={{
              pathname: "/target-demo-site/cart/viewed_bought",
              search: searchParams.toString()
            }}>Viewed Bought</Link>
            <Link to={{
              pathname: "/target-demo-site/cart/viewed_viewed",
              search: searchParams.toString()
            }}>Viewed Viewed</Link>
            <DropdownMenu title="Analytics">
              <Link to={{
                pathname: "/target-demo-site/cart/bought_bought_analytics",
                search: searchParams.toString()
              }}>Bought Bought Analytics</Link>
              <Link to={{
                pathname: "/target-demo-site/cart/viewed_bought_analytics",
                search: searchParams.toString()
              }}>Viewed Bought Analytics</Link>
              <Link to={{
                pathname: "/target-demo-site/cart/viewed_viewed_analytics",
                search: searchParams.toString()
              }}>Viewed Viewed Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="Popularity">
            <Link to={{
              pathname: "/target-demo-site/popularity/most-viewed-across-site",
              search: searchParams.toString()
            }}>Most Viewed Across Site</Link>
            <Link to={{
              pathname: "/target-demo-site/popularity/most-viewed-by-category",
              search: searchParams.toString()
            }}>Most Viewed by Category</Link>
            <Link to={{
              pathname: "/target-demo-site/popularity/most-viewed-by-attribute",
              search: searchParams.toString()
            }}>Most Viewed by Attribute</Link>
            <Link to={{
              pathname: "/target-demo-site/popularity/top-sellers-across-site",
              search: searchParams.toString()
            }}>Top Sellers Across Site</Link>
            <Link to={{
              pathname: "/target-demo-site/popularity/top-sellers-by-category",
              search: searchParams.toString()
            }}>Top Sellers by Category</Link>
            <Link to={{
              pathname: "/target-demo-site/popularity/top-sellers-by-item-attribute",
              search: searchParams.toString()
            }}>Top Sellers by Item Attribute</Link>
            <DropdownMenu title="Analytics">
              <Link to={{
                pathname: "/target-demo-site/popularity/most-viewed-across-site-analytics",
                search: searchParams.toString()
              }}>Most Viewed Across Site
                Analytics</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/most-viewed-by-category-analytics",
                search: searchParams.toString()
              }}>Most Viewed by Category
                Analytics</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/most-viewed-by-attribute-analytics",
                search: searchParams.toString()
              }}>Most Viewed by Attribute
                Analytics</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/top-sellers-across-site-analytics",
                search: searchParams.toString()
              }}>Top Sellers Across Site
                Analytics</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/top-sellers-by-category-analytics",
                search: searchParams.toString()
              }}>Top Sellers by Category
                Analytics</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/top-sellers-by-item-attribute-analytics",
                search: searchParams.toString()
              }}>Top Sellers by Item
                Attribute Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="Item Based">
            <Link to={{
              pathname: "/target-demo-site/item/viewed_viewed",
              search: searchParams.toString()
            }}>Viewed Viewed</Link>
            <Link to={{
              pathname: "/target-demo-site/item/viewed_bought",
              search: searchParams.toString()
            }}>Viewed Bought</Link>
            <Link to={{
              pathname: "/target-demo-site/item/bought_bought",
              search: searchParams.toString()
            }}>Bought Bought</Link>
            <Link to={{
              pathname: "/target-demo-site/item/content_similarity",
              search: searchParams.toString()
            }}>Content Similarity</Link>
            <DropdownMenu title="Analytics">
              <Link to={{
                pathname: "/target-demo-site/item/viewed_viewed_analytics",
                search: searchParams.toString()
              }}>Viewed Viewed Analytics</Link>
              <Link to={{
                pathname: "/target-demo-site/item/viewed_bought_analytics",
                search: searchParams.toString()
              }}>Viewed Bought Analytics</Link>
              <Link to={{
                pathname: "/target-demo-site/item/bought_bought_analytics",
                search: searchParams.toString()
              }}>Bought Bought Analytics</Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="User Based">
            <Link to={{
              pathname: "/target-demo-site/userbased/recently_viewed",
              search: searchParams.toString()
            }}>Recently Viewed</Link>
            <Link to={{
              pathname: "/target-demo-site/userbased/recommended_for_you",
              search: searchParams.toString()
            }}>Recommended for You</Link>
            <Link to={{
              pathname: "/target-demo-site/userbased/recommended_for_you_analytics",
              search: searchParams.toString()
            }}>Recommended for You Analytics</Link>
          </DropdownMenu>

          <DropdownMenu title="Custom">
            <Link to={{
              pathname: "/target-demo-site/custom/custom_algo",
              search: searchParams.toString()
            }}>Custom Algo</Link>
            <Link to={{
              pathname: "/target-demo-site/custom/custom_algo_analytics",
              search: searchParams.toString()
            }}>Custom Algo Analytics</Link>
          </DropdownMenu>


        </DropdownMenu>
        <DropdownMenu title="Util">
          <Link to={{
            pathname: "/target-demo-site/util/products",
            search: searchParams.toString()
          }}>Products</Link>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;
