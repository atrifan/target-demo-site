import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import Tracker from '../lib/tracker';
import getMcId from '../lib/visitor';
import LoadingModal from '../components/LoadingModal';
import VariationsGrid from '../components/VariationGrid';
import TrafficGenerator from '../components/TrafficGenerator';
import ModelExplorer from '../components/ModelExplorer';

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

const MVTXP: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, mcId}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [campaignId, setCampaignId] = useState('');
  useLayoutEffect(() => {
    //reset experience-index on main page
    setExperienceIndex(-100);
    console.log(refreshKey);
    let cleanupEvents: [Promise<any>?] = [];
    const mcIdToUse = mcId.length > 0 ? mcId : getMcId();
    AtJs().then(() => {
      if (window.adobe && window.adobe.target) {
        window.adobe.target?.getOffers({
          'request': {
            id: {
              marketingCloudVisitorId: mcIdToUse,
            },
            execute: {
              pageLoad: {
                parameters: {
                },
                profileParameters: {
                  "user.422": displayName,
                  "user.country": country,
                  "user.hobby": hobby,
                  "user.age": age
                }
              }
            }
          }
        }).then(function(response) {
          // Apply Offers
          window.adobe.target?.applyOffers({
            response: response
          });
        }).catch(function(error) {
          console.log("AT: getOffers failed - Error", error);
        }).finally(() => {
          // Trigger View call, assuming pageView is defined elsewhere
          //window.adobe.target?.triggerView('recentlyViewed');
        });
      }
    })

  }, [refreshKey, displayName, country, hobby, age]);



  const handleSetToken = (newToken: string, activityId: number, experienceId: number) => {
    setToken(newToken);
    setExperienceIndex(experienceId);
    setActivityIndex(activityId);
  };

  return (
    <main>
      <div style={{ padding: '20px' }}>
        <h2>Navigate to Experiences</h2>

        <VariationsGrid hide={true} previewToken={"h4n2L6PCRxZPzg8_9LdXBosfdKGAJyg5DsJ3XxNj67A"} destination={'/target-demo-site/mvt/xp'} handleSetToken={handleSetToken}/>

        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          marginTop: '20px'
        }}
        >
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            {/* Mbox1 and its Title */}
            <div style={{ flex: '1 1 48%', marginRight: '4%' }}>
              <h4>Location 1</h4>
              <div data-mbox={"card-placeholder-1"}>
                {/* Content for Mbox1 */}
                Replace me
              </div>
            </div>

            {/* Mbox2 and its Title */}
            <div style={{ flex: '1 1 48%' }}>
              <h4>Location 2</h4>
              <div data-mbox={"card-placeholder-2"}>
                Replace me
              </div>
            </div>
          </div>

          {/* Mbox3 and its Title, which should take up the full row */}
          <div style={{ flex: '1 1 100%' }}>
            <h4>Location 3</h4>
            <div data-mbox={"card-placeholder-3"}>
              Replace me
            </div>
          </div>
        </div>

        <TrafficGenerator displayName={displayName} country={country} hobby={hobby} age={age}
                          isTarget={true}
                          conversionEvent={'click'}
                          experienceIndex={experienceIndex} setExperienceIndex={setExperienceIndex}
                          showExperienceIndex={true}
                          multiplier={9}
                          setTotal={setTotal} setCurrent={setCurrent} setModalVisible={setModalVisible}
                          mboxes={[]}/>
      </div>
      <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} current={current}
                    total={total}/>
    </main>
  )
    ;
};

export default MVTXP;
