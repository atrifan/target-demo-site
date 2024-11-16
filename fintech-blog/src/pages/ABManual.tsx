import React, { useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import AtJs from '../lib/atJs';
import Tracker from '../lib/tracker';
import getMcId from '../lib/visitor';

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

const ABManual: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, mcId}) => {
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
                    to="/target-demo-site/ab/xp?at_preview_token=LmE_RN_gXztn_dkkFsgWwIsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_1&at_preview_listed_activities_only=true"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 1)}
                  >
                      Go to Experience 1
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to="/target-demo-site/ab/xp?at_preview_token=LmE_RN_gXztn_dkkFsgWwIsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_2&at_preview_listed_activities_only=true"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 2)}
                  >
                      Go to Experience 2
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to="/target-demo-site/ab/xp?at_preview_token=LmE_RN_gXztn_dkkFsgWwIsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_3&at_preview_listed_activities_only=true"
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
                  <div data-mbox="target-demo-site-ab-mbox" className="mbox-name-target-demo-site-ab-mbox"
                       data-at-mbox-name="target-demo-site-ab-mbox">

                  </div>
              </div>
          </div>
      </main>
    )
      ;
};

export default ABManual;
