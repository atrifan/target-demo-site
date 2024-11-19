import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import Tracker from '../lib/tracker';
import getMcId from '../lib/visitor';
import LoadingModal from '../components/LoadingModal';
import VariationsGrid from '../components/VariationGrid';
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

const PersonalizationAP: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, mcId}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(0);
    useLayoutEffect(() => {
        //reset experience-index on main page
        setExperienceIndex(-100);
        console.log(refreshKey);
        let cleanupEvents: [Promise<any>?] = [];
        const mcIdToUse = mcId.length > 0 ? mcId : getMcId();
        AtJs().then(() => {
            if (window.adobe && window.adobe.target) {
                window.adobe.target.getOffers({
                    request: {
                        id: {
                            marketingCloudVisitorId: mcIdToUse,
                        },
                        execute: {
                            mboxes: [{
                                index: 0,
                                name: "target-demo-site-ap-mbox-1",
                                profileParameters: {
                                    "user.422": displayName,
                                    "user.country": country,
                                    "user.hobby": hobby,
                                    "user.age": age
                                }
                            },
                                {
                                    index: 1,
                                    name: "target-demo-site-ap-mbox-2",
                                    profileParameters: {
                                        "user.422": displayName,
                                        "user.country": country,
                                        "user.hobby": hobby,
                                        "user.age": age
                                    }
                                },
                                {
                                    index: 2,
                                    name: "target-demo-site-ap-mbox-3",
                                    profileParameters: {
                                        "user.422": displayName,
                                        "user.country": country,
                                        "user.hobby": hobby,
                                        "user.age": age
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
                          }).then((e) => {
                          });

                          count += 1;
                      });
                  })
                  .catch(error => {
                      console.log("Error fetching or applying offers:", error);
                  });
            }
        })

        return () => {
            Promise.all(cleanupEvents).then((cleanupEvents) => {
                cleanupEvents.forEach((cleanup) => {
                    if(cleanup) {
                        cleanup();
                    }
                });
            });
        }

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

              <VariationsGrid handleSetToken={handleSetToken}/>

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
                          <h4>Mbox1</h4>
                          <div
                            data-mbox="target-demo-site-ap-mbox-1"
                            className="mbox-name-target-demo-site-ap-mbox-1"
                            data-at-mbox-name="target-demo-site-ap-mbox-1"
                          >
                              {/* Content for Mbox1 */}
                          </div>
                      </div>

                      {/* Mbox2 and its Title */}
                      <div style={{ flex: '1 1 48%' }}>
                          <h4>Mbox2</h4>
                          <div
                            data-mbox="target-demo-site-ap-mbox-2"
                            className="mbox-name-target-demo-site-ap-mbox-2"
                            data-at-mbox-name="target-demo-site-ap-mbox-2"
                          >
                              {/* Content for Mbox2 */}
                          </div>
                      </div>
                  </div>

                  {/* Mbox3 and its Title, which should take up the full row */}
                  <div style={{ flex: '1 1 100%' }}>
                      <h4>Mbox3</h4>
                      <div
                        data-mbox="target-demo-site-ap-mbox-3"
                        className="mbox-name-target-demo-site-ap-mbox-3"
                        data-at-mbox-name="target-demo-site-ap-mbox-3"
                      >
                          {/* Content for Mbox3 */}
                      </div>
                  </div>
              </div>

              <TrafficGenerator displayName={displayName} country={country} hobby={hobby} age={age}
                                isTarget={true}
                                conversionEvent={'click'}
                                experienceIndex={experienceIndex} setExperienceIndex={setExperienceIndex} showExperienceIndex={true}
                                setTotal={setTotal} setCurrent={setCurrent} setModalVisible={setModalVisible}
                                mboxes={['target-demo-site-ap-mbox-1', 'target-demo-site-api-mbox-2', 'target-demo-site-ap-mbox-3']} />
          </div>
          <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} current={current}
                        total={total}/>
      </main>
    )
      ;
};

export default PersonalizationAP;
