import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import Tracker from '../lib/tracker';
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

const ABManualXP: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, mcId}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    useLayoutEffect(() => {
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
                                name: "target-demo-site-ab-mbox",
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


    const generateViews = (number: string) => {
        generateViewsWithConversions(number, setModalVisible, '', { displayName, country, hobby, age }, ["target-demo-site-ab-mbox"], undefined, false, undefined, undefined, undefined, true);
    }

    const generateConversions = (number: string) => {
        generateViewsWithConversions(number, setModalVisible, '', { displayName, country, hobby, age }, ["target-demo-site-ab-mbox"], undefined, true, "click", 1, undefined, true);
    }

    const handleSetToken = (newToken: string, activityId: number, experienceId: number) => {
        setToken(newToken);
        setExperienceIndex(experienceId);
        setActivityIndex(activityId);
    };

    return (
      <main>
          <div style={{ padding: '20px' }}>
              <div data-mbox="target-demo-site-ab-mbox" className="mbox-name-target-demo-site-ab-mbox"
                   data-at-mbox-name="target-demo-site-ab-mbox">

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
          <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}/>
      </main>
    )
      ;
};

export default ABManualXP;
