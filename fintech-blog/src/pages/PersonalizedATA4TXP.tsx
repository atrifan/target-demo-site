import React, { useEffect, useState } from 'react';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import Tracker from '../lib/tracker';
import getMcId, { getSdId } from '../lib/visitor';
import { randomUUID } from 'node:crypto';
import LoadingModal from '../components/LoadingModal';

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
  useEffect(() => {
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
                    newTntA = `${newTntA},${revenueEvent[0]}|1`;
                  }

                  //no unique
                  if (newTntA.indexOf("|0") == -1) {
                    newTntA = `${newTntA},${revenueEvent[0]}|0`;
                  }

                  setTntA(newTntA);
                  //make the view call
                  resolve(Tracker('.conversion', () => {
                    const sdId = getSdId();
                    const conversionLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${revenueEvent[0]}|32767&mid=${mcIdToUse}&session-id=${el.analytics.payload["session-id"]}&events=event32=1`;
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

  const generateViews = (number: string) => {
    generateViewsWithConversions(number, setModalVisible, reportingServer, {displayName, country, hobby, age}, 'target-demo-site-at-a4t-mbox', tntA);
  }

  const generateConversions = (number: string) => {
    generateViewsWithConversions(number, setModalVisible, reportingServer, {displayName, country, hobby, age}, 'target-demo-site-at-a4t-mbox', tntA, true, 'event32', 1);
  }
  return (
    <main>
        <div data-mbox="target-demo-site-at-a4t-mbox" className="mbox-name-target-demo-site-at-a4t-mbox" data-at-mbox-name="target-demo-site-at-a4t-mbox">

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
            const number = (document.getElementById('viewsWithoutConversions')  as HTMLInputElement)?.value;
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
      <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} />
    </main>
  )
    ;
};

export default PersonalizationATA4TXP;
