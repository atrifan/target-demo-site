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
    country: string;
    hobby: string;
    age: string;
    refreshKey: number;
    mcId: string;
}

const PersonalizationAPXP: React.FC<XperienceProps> = ({ displayName, token, activityIndex, experienceIndex, trueAudienceId, country, hobby, age, refreshKey, mcId}) => {
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


    return (
      <main>
          <h3>Mbox1</h3>
          <div data-mbox="target-demo-site-ap-mbox-1" className="mbox-name-target-demo-site-ap-mbox-1"
               data-at-mbox-name="target-demo-site-ap-mbox-1">

          </div>
          <h3>Mbox2</h3>
          <div data-mbox="target-demo-site-ap-mbox-2" className="mbox-name-target-demo-site-ap-mbox-2"
               data-at-mbox-name="target-demo-site-ap-mbox-2">

          </div>
          <h3>Mbox3</h3>
          <div data-mbox="target-demo-site-ap-mbox-3" className="mbox-name-target-demo-site-ap-mbox-3"
               data-at-mbox-name="target-demo-site-ap-mbox-3">

          </div>
      </main>
    )
      ;
};

export default PersonalizationAPXP;
