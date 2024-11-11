import React, { useEffect } from 'react';
import AtJs from '../lib/atJs';
import Tracker from '../lib/tracker';
import getMcId from '../lib/visitor';

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
}

const PersonalizationATA4TXP: React.FC<XperienceProps> = ({ displayName, token, activityIndex, experienceIndex, trueAudienceId, country, hobby, age, refreshKey, reportingServer}) => {
  useEffect(() => {
    let cleanupEvents: [Promise<any>?] = [];
    AtJs().then(() => {
      if (window.adobe && window.adobe.target) {
        window.adobe.target.getOffers({
          request: {
            experienceCloud: {
              analytics: {
                logging: "client_side",
                reportingServer: reportingServer
              }
            },
            execute: {
              mboxes: [{
                index: 0,
                name: "target-demo-site-at-a4t-mbox",
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
                  resolve(Tracker('.conversion', () => {
                    const mcId = getMcId();
                    const events = el.analytics.payload.tnta.split(',');
                    const revenueEvent = events[0].split('|');
                    //I a sending on event10 :) the revenue
                    const tnta = `${el.analytics.payload.tnta},${revenueEvent[0]}|32767`;
                    const sessionId = el.analytics.payload["session-id"];
                    console.log(tnta);
                    fetch(`https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${tnta}&mid=${mcId}&session-id=${sessionId}&events=event32=1`, {
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
        <div data-mbox="target-demo-site-at-a4t-mbox" className="mbox-name-target-demo-site-at-a4t-mbox" data-at-mbox-name="target-demo-site-at-a4t-mbox">

        </div>
    </main>
  )
    ;
};

export default PersonalizationATA4TXP;
