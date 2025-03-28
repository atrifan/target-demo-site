import React, { useEffect, useLayoutEffect, useState } from 'react';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import Tracker from '../lib/tracker';
import getMcId, { getSdId } from '../lib/visitor';
import { randomUUID } from 'node:crypto';
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
  tntA: string;
  setTntA: any;
  mcId: string;
}

const PersonalizationATA4TXP: React.FC<XperienceProps> = ({ displayName, token, activityIndex, experienceIndex, trueAudienceId, country, hobby, age, refreshKey, reportingServer, tntA, setTntA, mcId}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [algorithmId, setAlgorithmId] = useState(-1000);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  useLayoutEffect(() => {
    let cleanupEvents: [Promise<any>?] = [];
    const mcIdToUse = mcId.length > 0 ? mcId : getMcId();
    AtJs().then(() => {
      if (window.adobe && window.adobe.target) {
        window.adobe.target.getOffers({
          request: {
            id: {
              marketingCloudVisitorId: mcIdToUse,
            },
            experienceCloud: {
              analytics: {
                trackingServer: reportingServer,
                logging: "client_side"
              }
            },
            execute: {
              mboxes: [{
                index: 0,
                name: "target-demo-site-at-a4t-mbox",
                profileParameters: {
                  "user.422": `${displayName}-${Date.now()}`,
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
            const mboxes: any[] = response.execute.mboxes;
            let count = 1;

            mboxes.forEach(el => {
              cleanupEvents.push(new Promise((resolve, reject) => {
                window.adobe.target?.applyOffers({
                  selector: `.mbox-name-${el.name}`,
                  response: {
                    execute: {
                      mboxes: [el]
                    }
                  }
                }).then((e) => {
                  const mcId = getMcId();
                  const events = tntA.split(',');
                  const uniqueViews = events.map((event: string) => {
                    //remove visits and unique visits and not conversion
                    const eventBreakDown = event.split(':');
                    eventBreakDown[1] = `${experienceIndex}`
                    //traffic type - targeted
                    eventBreakDown[2] = '1';
                    return eventBreakDown.join(':');
                  });
                  const revenueEvent = uniqueViews.filter((event: string) => {
                    return event.split('|')[0].split(":").length === 4;
                  })[0].split("|");
                  let newTntA = uniqueViews.join(',');

                  //no visits
                  if (newTntA.indexOf("|1") == -1) {
                    newTntA = `${revenueEvent[0]}|1,${newTntA}`;
                  }

                  //no unique
                  if (newTntA.indexOf("|0") == -1) {
                    newTntA = `${revenueEvent[0]}|0,${newTntA}`;
                  }

                  setTntA(newTntA);
                  //make the view call
                  resolve(Tracker('.conversion', () => {
                    const sdId = getSdId();
                    const conversionLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${revenueEvent[0]}|32767,${revenueEvent[0]}|32|1&mid=${mcIdToUse}&c.a.target.session-id=${el.analytics.payload["session-id"]}&events=event32=1`;
                    fetch(conversionLink, {
                      method: "GET",
                      headers: {
                        "Content-Type": "text/plain"
                      },
                      // Make sure to include credentials if needed, depending on Adobe's CORS policy
                      credentials: "include" // or "same-origin" if running on the same domain
                    })
                      .then(response => {
                        if (!response.ok) {
                          throw new Error("Network response was not ok " + response.statusText);
                        }
                        return response.text(); // Assuming a plain text response
                      })
                      .then(data => {
                        console.log("Response data:", data);
                      })
                      .catch(error => {
                        console.error("There was a problem with the fetch operation:", error);
                      });

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

  return (
    <main>
      <div data-mbox="target-demo-site-at-a4t-mbox" className="mbox-name-target-demo-site-at-a4t-mbox"
           data-at-mbox-name="target-demo-site-at-a4t-mbox">

      </div>

      <TrafficGenerator displayName={displayName} country={country} hobby={hobby} age={age}
                        experienceIndex={experienceIndex}
                        setAlgorithmId={setAlgorithmId} selectAlgorithm={true}
                        reportingServer={reportingServer} conversionEvent={"event32"}
                        tntA={tntA}
                        isTarget={false}
                        algorithmId={algorithmId}
                        setTotal={setTotal} setCurrent={setCurrent} setModalVisible={setModalVisible}
                        mboxes={['target-demo-site-at-a4t-mbox']} />
      <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} current={current} total={total}/>
    </main>
  )
    ;
};

export default PersonalizationATA4TXP;
