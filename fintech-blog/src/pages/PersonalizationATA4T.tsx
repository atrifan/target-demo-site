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
  reportingServer: string;
}

const PersonalizationATA4T: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, reportingServer}) => {
  useLayoutEffect(() => {
    let cleanupEvents: [Promise<any>?] = [];
    console.log(refreshKey);
    AtJs().then(() => {
      if (window.adobe && window.adobe.target) {
        const doc = document.getElementsByClassName('mbox-name-target-demo-site-at-mbox');
        window.adobe.target.getOffers({
          request: {
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
                    const tnta = `${el.analytics.payload.tnta},${revenueEvent[0]}|32}`;
                    console.log(tnta);
                    fetch(`https://${reportingServer}/b/ss/atetrifandemo/0/MOBILE-1.0?pe=tnt&tnta=${tnta}&mid=${mcId}`, {
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
            to="/target-demo-site/personalization/at/a4t/xp?at_preview_token=60yEAjPMxQu2AktnKmj0tYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_1&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
            style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 1)}
          >
            Go to Experience 1
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/target-demo-site/personalization/at/a4t/xp?at_preview_token=60yEAjPMxQu2AktnKmj0tYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_2&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
            style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 2)}
          >
            Go to Experience 2
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Link
            to="/target-demo-site/personalization/at/a4t/xp?at_preview_token=60yEAjPMxQu2AktnKmj0tYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_3&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
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
          <div data-mbox="target-demo-site-at-a4t-mbox" className="mbox-name-target-demo-site-at-a4t-mbox"
               data-at-mbox-name="target-demo-site-at-a4t-mbox">

          </div>
        </div>
      </div>
    </main>
  )
    ;
};

export default PersonalizationATA4T;
