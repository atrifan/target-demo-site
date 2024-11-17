import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import getMcId from '../lib/visitor';
import LoadingModal from '../components/LoadingModal';

interface XperienceProps {
  displayName: string;
  token: string;
  activityIndex: number;
  experienceIndex: number;
  trueAudienceId: number;
  setActivityIndex: (index: number) => void;
  setExperienceIndex: (index: number) => void;
  setTrueAudienceId: (id: number) => void;
  setToken: (name: string) => void;
  country: string;
  hobby: string;
  age: string;
  refreshKey: number;
  mcId: string;
}

const PersonalizationAT: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, mcId}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  useLayoutEffect(() => {
    console.log(refreshKey);
    const mcIdToUse = mcId.length > 0 ? mcId : getMcId();
    AtJs().then(() => {
      if (window.adobe && window.adobe.target) {
        const doc = document.getElementsByClassName('mbox-name-target-demo-site-at-mbox');
        window.adobe.target.getOffers({
          request: {
            experienceCloud: {
              analytics: {
                logging: "server_side"
              }
            },
            id: {
              marketingCloudVisitorId: mcIdToUse,
            },
            execute: {
              mboxes: [{
                index: 0,
                name: "target-demo-site-at-mbox",
                profileParameters: {
                  "user.422": displayName,
                  "user.country": country,
                  "user.hobby": hobby,
                  "user.age": age,
                  "brand.bought": "offline"
                }
              }]
            }
          }
        })
          .then(response => {
            console.log(response);
            const mboxes: any[] = response.execute.mboxes;
            let count = 1;

            mboxes.forEach(el => {
              window.adobe.target?.applyOffers({
                selector: `.mbox-name-${el.name}`,
                response: {
                  execute: {
                    mboxes: [el]
                  }
                }
              });

              count += 1;
            });
          })
          .catch(error => {
            console.log("Error fetching or applying offers:", error);
          });
      }
    })

  }, [refreshKey, displayName, country, hobby, age]);

  const generateViews = (number: string) => {
    generateViewsWithConversions(number, setModalVisible, '', { displayName, country, hobby, age }, ["target-demo-site-at-mbox"], undefined, false, undefined, undefined, undefined, true);
  }

  const generateConversions = (number: string) => {
    generateViewsWithConversions(number, setModalVisible, '', { displayName, country, hobby, age }, ["target-demo-site-at-mbox"], undefined, true, "click", 1, undefined, true);
  }

  const handleSetToken = (newToken: string, activityId: number, experienceId: number) => {
    setToken(newToken);
    setExperienceIndex(experienceId);
    setActivityIndex(activityId);
  };

  return (
    <main>
      <div style={{ padding: '20px' }}>
        <h2>Navigate to Experiences</h2>

        <div style={{ marginBottom: '15px' }}>
          <Link
            to="/target-demo-site/personalization/at/xp?at_preview_token=ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_1&at_preview_listed_activities_only=true"
            style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 1)}
          >
            Go to Experience 1
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/target-demo-site/personalization/at/xp?at_preview_token=ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_2&at_preview_listed_activities_only=true"
            style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 2)}
          >
            Go to Experience 2
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/target-demo-site/personalization/at/xp?at_preview_token=ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_3&at_preview_listed_activities_only=true"
            style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 3)}
          >
            Go to Experience 3
          </Link>
        </div>

        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          marginTop: '20px'
        }}
        >
          <h3>The served experience is:</h3>
          <div data-mbox="target-demo-site-at-mbox" className="mbox-name-target-demo-site-at-mbox"
               data-at-mbox-name="target-demo-site-at-mbox">

          </div>
        </div>
        {/* Generate Views without Conversions Section */}
        <div style={{ marginTop: '20px' }}>
          <h4>Generate Views without Conversions</h4>
          <input
            type="number"
            placeholder="Enter number of views"
            id="viewsWithoutConversions"
            style={{ marginRight: '10px', padding: '5px', width: '100px' }}
          />
          <button
            onClick={() => {
              const number = (document.getElementById('viewsWithoutConversions') as HTMLInputElement)?.value;
              generateViews(number);
            }}
            style={{ padding: '5px 10px' }}
          >
            Generate Views
          </button>
        </div>
        {/* Generate Views with Conversions Section */}
        <div style={{ marginTop: '20px' }}>
          <h4>Generate Views with Conversions</h4>
          <input
            type="number"
            placeholder="Enter number of views"
            id="viewsWithConversions"
            style={{ marginRight: '10px', padding: '5px', width: '100px' }}
          />
          <button
            onClick={() => {
              const number = (document.getElementById('viewsWithConversions') as HTMLInputElement)?.value;
              generateConversions(number);
            }}
            style={{ padding: '5px 10px' }}
          >
            Generate Views with Conversions
          </button>
        </div>
      </div>
      <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}/>
    </main>
  )
    ;
};

export default PersonalizationAT;
