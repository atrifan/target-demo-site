import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import getMcId from '../lib/visitor';
import LoadingModal from '../components/LoadingModal';
import TrafficGenerator from '../components/TrafficGenerator';

interface XperienceProps {
  displayName: string;
  token: string;
  activityIndex: number;
  experienceIndex: number;
  trueAudienceId: number;
  setActivityIndex: (index: number) => void;
  setExperienceIndex: React.Dispatch<React.SetStateAction<number>>;
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
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [searchParams] = useSearchParams();
  useLayoutEffect(() => {
    //reset experience-index on main page
    setExperienceIndex(-100);
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
    generateViewsWithConversions(number, setTotal, setCurrent, setModalVisible, '', { displayName, country, hobby, age }, ["target-demo-site-at-mbox"], undefined, false, undefined, undefined, undefined, true, experienceIndex);
  }

  const generateConversions = (number: string) => {
    generateViewsWithConversions(number, setTotal, setCurrent, setModalVisible, '', { displayName, country, hobby, age }, ["target-demo-site-at-mbox"], undefined, true, "click", 1, undefined, true, experienceIndex);
  }

  const changeExperienceId = (number: string) => {
    if (number.length === 0) {
      setExperienceIndex(-100);
      return;
    }
    setExperienceIndex(parseInt(number) - 1);
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
            to={{
              pathname: '/target-demo-site/personalization/at/xp',
              search: new URLSearchParams({
                ...Object.fromEntries(searchParams), // Keep existing query params
                at_preview_token: 'ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A',
                at_preview_index: '1_1', // Set new index
                at_preview_listed_activities_only: 'true',
              }).toString(),
            }}
            style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 1)}
          >
            Go to Experience 1
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Link
            to={{
              pathname: '/target-demo-site/personalization/at/xp',
              search: new URLSearchParams({
                ...Object.fromEntries(searchParams), // Keep existing query params
                at_preview_token: 'ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A',
                at_preview_index: '1_2', // Set new index
                at_preview_listed_activities_only: 'true',
              }).toString(),
            }}
            style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 2)}
          >
            Go to Experience 2
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Link
            to={{
              pathname: '/target-demo-site/personalization/at/xp',
              search: new URLSearchParams({
                ...Object.fromEntries(searchParams), // Keep existing query params
                at_preview_token: 'ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A',
                at_preview_index: '1_3', // Set new index
                at_preview_listed_activities_only: 'true',
              }).toString(),
            }}
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
        <TrafficGenerator displayName={displayName} country={country} hobby={hobby} age={age}
                          experienceIndex={experienceIndex} setExperienceIndex={setExperienceIndex}
                          showExperienceIndex={true}
                          setTotal={setTotal} setCurrent={setCurrent} setModalVisible={setModalVisible}
                          mboxes={['target-demo-site-at-mbox']}/>
      </div>
      <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} total={total} current={current}/>
    </main>
  )
    ;
};

export default PersonalizationAT;
