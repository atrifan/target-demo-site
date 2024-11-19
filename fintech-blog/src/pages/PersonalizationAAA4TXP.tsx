import React, { useEffect, useLayoutEffect, useState } from 'react';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import Tracker from '../lib/tracker';
import getMcId, { trackEvent } from '../lib/visitor';
import LoadingModal from '../components/LoadingModal';
import TrafficGenerator from '../components/TrafficGenerator';

interface XperienceProps {
    displayName: string;
    token: string;
    activityIndex: number;
    experienceIndex: number;
    trueAudienceId: number;// Prop to receive the display name
    country: string;
    hobby: string;
    age: string;
    refreshKey: number;
    reportingServer: string;
    mcId: string;
}

const PersonalizationAAA4TXP: React.FC<XperienceProps> = ({ displayName, token, activityIndex, experienceIndex, trueAudienceId, country, hobby, age, refreshKey, reportingServer, mcId}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(0);
    useLayoutEffect(() => {
        const mcIdToUse = mcId.length > 0 ? mcId : getMcId();
        let cleanupEvents: [Promise<any>?] = [];
        AtJs().then(() => {
            if (window.adobe && window.adobe.target) {
                window.adobe.target.getOffers({
                    request: {
                        experienceCloud: {
                            analytics: {
                                logging: "client_side"
                            }
                        },
                        id: {
                            marketingCloudVisitorId: mcIdToUse,
                        },
                        execute: {
                            mboxes: [{
                                index: 0,
                                name: "target-demo-site-aa-a4t-mbox",
                                profileParameters: {
                                    "user.422": `${displayName}-${Date.now()}`,
                                    "user.country": country,
                                    "user.hobby": hobby,
                                    "user.age": age
                                }
                            }]
                        }
                    }
                })
                  .then(async response => {
                      console.log(response);
                      // Apply the offers retrieved
                      const mboxes: any[] = response.execute.mboxes;
                      let count = 1;
                      //burn the first suplemental data id;
                      //need to get it after the first get offers because it will be reset afterwards
                      //burn the first one
                      window.s.visitor.getSupplementalDataID();
                      const sdid = window.s.visitor.getSupplementalDataID();
                      mboxes.forEach(el => {
                          cleanupEvents.push(new Promise((resolve, reject) => {
                              window.adobe.target?.applyOffers({
                                  selector: `.mbox-name-${el.name}`,
                                  response: {
                                      execute: {
                                          mboxes: [el]
                                      }
                                  }
                              }).then(() => {
                                  resolve(Tracker('.conversion', () => {
                                      // const conversionLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${revenueEvent[0]}|32767&mid=${mcId}&sdid=${sdId}&events=event32=1`;
                                      trackEvent("event10=1", mcIdToUse, sdid);
                                  }));
                              });
                          }));

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
    }, [refreshKey]);

    const generateViews = (number: string) => {
        generateViewsWithConversions(number, setTotal, setCurrent, setModalVisible, reportingServer, { displayName, country, hobby, age }, ["target-demo-site-aa-a4t-mbox"], undefined, false, 'event10', undefined, undefined);
    }

    const generateConversions = (number: string) => {
        generateViewsWithConversions(number, setTotal, setCurrent, setModalVisible, reportingServer, { displayName, country, hobby, age }, ["target-demo-site-aa-a4t-mbox"], undefined, true, "event10", 1, undefined);
    }

    return (
      <main>
          <div data-mbox="target-demo-site-aa-a4t-mbox" className="mbox-name-target-demo-site-aa-a4t-mbox" data-at-mbox-name="target-demo-site-aa-a4t-mbox">

          </div>
          <TrafficGenerator displayName={displayName} country={country} hobby={hobby} age={age}
                            experienceIndex={experienceIndex}
                            setTotal={setTotal} setCurrent={setCurrent} setModalVisible={setModalVisible}
                            conversionEvent={"event10"} reportingServer={reportingServer} mboxes={['target-demo-site-aa-a4t-mbox']} />
          <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} current={current} total={total}/>
      </main>
    )
      ;
};

export default PersonalizationAAA4TXP;
