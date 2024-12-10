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

          <div className="cart-icon">
            <img
              src="https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/shopping_cart.png"
              alt="Cart Icon"
              className="cart-image"
            />
            <div className="cart-bubble">{itemsInCart}</div>
          </div>
      </div>

      <div className={"header-bottom"}>
        <h1>Target demo site with at.js delivery</h1>
        <nav>
          <DropdownMenu title="A/B">
            <Link to={{
              pathname: "/target-demo-site/ab",
              search: searchParams.toString()
            }} onClick={(e) => {
              handleLinkClick(e, '/target-demo-site/ab')
            }}>A/B Manual Allocate</Link>
            <Link to={{
              pathname: "/target-demo-site/personalization/aa",
              search: searchParams.toString()
            }} onClick={(e) => {
              handleLinkClick(e, '/target-demo-site/personalization/aa')
            }}>Auto Allocate</Link>
            <Link to={{
              pathname: "/target-demo-site/personalization/aa/a4t",
              search: searchParams.toString()
            }} onClick={(e) => {
              handleLinkClick(e, '/target-demo-site/personalization/aa/a4t')
            }}>Auto Allocate A4T</Link>
            <DropdownMenu title="Personalization">
              <Link to={{
                pathname: "/target-demo-site/personalization/at",
                search: searchParams.toString()
              }}>Personalization AT</Link>
              <Link to={{
                pathname: "/target-demo-site/personalization/at/a4t",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/personalization/at/a4t')
              }}>Personalization AT A4T</Link>
            </DropdownMenu>
          </DropdownMenu>

          <Link to={{
            pathname: "/target-demo-site/personalization/ap",
            search: searchParams.toString()
          }} onClick={(e) => {
            handleLinkClick(e, '/target-demo-site/personalization/ap')
          }}>Personalization AP</Link>
          <Link to={{
            pathname: "/target-demo-site/xt",
            search: searchParams.toString()
          }} onClick={(e) => {
            handleLinkClick(e, '/target-demo-site/xt')
          }}>Experience Targeting</Link>
          <Link to={{
            pathname: "/target-demo-site/mvt",
            search: searchParams.toString()
          }} onClick={(e) => {
            handleLinkClick(e, '/target-demo-site/mvt')
          }}>MVT</Link>

          {/* Other Dropdown Menus */}
          <DropdownMenu title="Recs">
            <Link to={{
              pathname: "/target-demo-site/criteria_sequence",
              search: searchParams.toString()
            }} onClick={(e) => {
              handleLinkClick(e, '/target-demo-site/criteria_sequence')
            }}>Criteria Sequence</Link>
            <DropdownMenu title="Cart">
              <Link to={{
                pathname: "/target-demo-site/cart/target-demo-site/bought_bought",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/cart/bought_bought')
              }}>Bought Bought</Link>
              <Link to={{
                pathname: "/target-demo-site/cart/viewed_bought",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/cart/viewed_bought')
              }}>Viewed Bought</Link>
              <Link to={{
                pathname: "/target-demo-site/cart/viewed_viewed",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/cart/viewed_viewed')
              }}>Viewed Viewed</Link>
              <DropdownMenu title="Analytics">
                <Link to={{
                  pathname: "/target-demo-site/cart/bought_bought_analytics",
                  search: searchParams.toString()
                }} onClick={(e) => {
                  handleLinkClick(e, '/target-demo-site/cart/bought_bought_analytics')
                }}>Bought Bought Analytics</Link>
                <Link to={{
                  pathname: "/target-demo-site/cart/viewed_bought_analytics",
                  search: searchParams.toString()
                }} onClick={(e) => {
                  handleLinkClick(e, '/target-demo-site/cart/viewed_ought_analytics')
                }}>Viewed Bought Analytics</Link>
                <Link to={{
                  pathname: "/target-demo-site/cart/viewed_viewed_analytics",
                  search: searchParams.toString()
                }} onClick={(e) => {
                  handleLinkClick(e, '/target-demo-site/cart/viewed_viewed_analytics')
                }}>Viewed Viewed Analytics</Link>
              </DropdownMenu>
            </DropdownMenu>

            <DropdownMenu title="Popularity">
              <Link to={{
                pathname: "/target-demo-site/popularity/most-viewed-across-site",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/popularity/most-viewed-across-site')
              }}>Most Viewed Across Site</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/most-viewed-by-category",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/popularity/most-viewed-by-category')
              }}>Most Viewed by Category</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/most-viewed-by-attribute",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/popularity/most-viewed-by-attribute')
              }}>Most Viewed by Attribute</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/top-sellers-across-site",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/popularity/top-sellers-across-site')
              }}>Top Sellers Across Site</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/top-sellers-by-category",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/popularity/top-sellers-by-category')
              }}>Top Sellers by Category</Link>
              <Link to={{
                pathname: "/target-demo-site/popularity/top-sellers-by-item-attribute",
                search: searchParams.toString()
              }} onClick={(e) => {
                handleLinkClick(e, '/target-demo-site/popularity/top-sellers-by-item-attribute')
              }}>Top Sellers by Item Attribute</Link>
              <DropdownMenu title="Analytics">
                <Link to={{
                  pathname: "/target-demo-site/popularity/most-viewed-across-site-analytics",
                  search: searchParams.toString()
                }} onClick={(e) => {
                  handleLinkClick(e, '/target-demo-site/popularity/most-viewed-across-site-analytics')
                }}>Most Viewed Across Site
                  Analytics</Link>
                <Link to={{
                  pathname: "/target-demo-site/popularity/most-viewed-by-category-analytics",
                  search: searchParams.toString()
                }} onClick={(e) => {
                  handleLinkClick(e, '/target-demo-site/popularity/most-viewed-by-category-analytics')
                }}>Most Viewed by Category
                  Analytics</Link>
                <Link to={{
                  pathname: "/target-demo-site/popularity/most-viewed-by-attribute-analytics",
                  search: searchParams.toString()
                }} onClick={(e) => {
                  handleLinkClick(e, '/target-demo-site/popularity/most-viewed-by-attribute-analytics')
                }}>Most Viewed by Attribute
                  Analytics</Link>
                <Link to={{
                  pathname: "/target-demo-site/popularity/top-sellers-across-site-analytics",
                  search: searchParams.toString()
                }} onClick={(e) => {
                  handleLinkClick(e, '/target-demo-site/popularity/top-sellers-across-site-analytics')
                }}>Top Sellers Across Site
                  Analytics</Link>
                <Link to={{
                  pathname: "/target-demo-site/popularity/top-sellers-by-category-analytics",
                  search: searchParams.toString()
                }} onClick={(e) => {
                  handleLinkClick(e, '/target-demo-site/popularity/top-sellers-by-category-analytics')
                }}>Top Sellers by Category
                  Analytics</Link>
                <Link to={{
                  pathname: "/target-demo-site/popularity/top-sellers-by-item-attribute-analytics",
                  search: searchParams.toString()
                }} onClick={(e) => {
                  handleLinkClick(e, '/target-demo-site/popularity/top-sellers-by-item-attribute-analytics')
                }}>Top Sellers by Item
                  Attribute Analytics</Link>
              </DropdownMenu>
            </DropdownMenu>

            <DropdownMenu title="User Based">
              <Link
                to={{
                  pathname: "/target-demo-site/userbased/recently_viewed",
                  search: searchParams.toString(),
                }}
                onClick={(e) =>
                  handleLinkClick(e, "/target-demo-site/userbased/recently_viewed")
                }
              >
                Recently Viewed
              </Link>
              <Link
                to={{
                  pathname: "/target-demo-site/userbased/recommended_for_you",
                  search: searchParams.toString(),
                }}
                onClick={(e) =>
                  handleLinkClick(e, "/target-demo-site/userbased/recommended_for_you")
                }
              >
                Recommended for You
              </Link>
              <Link
                to={{
                  pathname: "/target-demo-site/userbased/recommended_for_you_analytics",
                  search: searchParams.toString(),
                }}
                onClick={(e) =>
                  handleLinkClick(e, "/target-demo-site/userbased/recommended_for_you_analytics")
                }
              >
                Recommended for You Analytics
              </Link>
            </DropdownMenu>

            <DropdownMenu title="Custom">
              <Link
                to={{
                  pathname: "/target-demo-site/custom/custom_algo",
                  search: searchParams.toString(),
                }}
                onClick={(e) =>
                  handleLinkClick(e, "/target-demo-site/custom/custom_algo")
                }
              >
                Custom Algo
              </Link>
              <Link
                to={{
                  pathname: "/target-demo-site/custom/custom_algo_analytics",
                  search: searchParams.toString(),
                }}
                onClick={(e) =>
                  handleLinkClick(e, "/target-demo-site/custom/custom_algo_analytics")
                }
              >
                Custom Algo Analytics
              </Link>
            </DropdownMenu>
          </DropdownMenu>

          <DropdownMenu title="Util">
            <Link to={{
              pathname: "/target-demo-site/util/products",
              search: searchParams.toString()
            }} onClick={(e) =>
              handleLinkClick(e, "/target-demo-site/util/products")
            }>Products</Link>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Header;
