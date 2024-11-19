import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Tracker from '../lib/tracker';
import getMcId, { getSdId, trackEvent } from '../lib/visitor';
import LoadingModal from '../components/LoadingModal';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
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
  setTntA: (tntA: string) => void;
  country: string;
  hobby: string;
  age: string;
  refreshKey: number;
  reportingServer: string;
  mcId: string;

}

const PersonalizationATA4T: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, reportingServer, setTntA, mcId}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [algorithmId, setAlgorithmId] = useState(-1000);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [searchParams] = useSearchParams();
  useLayoutEffect(() => {
    //reset experience-index on main page
    setExperienceIndex(-100);
    let cleanupEvents: [Promise<any>?] = [];
    console.log(refreshKey);
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
                logging: "server_side"
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
          .then(async (response) => {
            const mboxes: any[] = response.execute.mboxes;
            let count = 1;
            //burn the first suplemental data id;
            //need to get it after the first get offers because it will be reset afterwards
            //burn the first one
            window.s.visitor.getSupplementalDataID();
            const sdid = window.s.visitor.getSupplementalDataID();

            const clientSideLogging = await window.adobe.target?.getOffers({
              request: {
                id: {
                  marketingCloudVisitorId: mcIdToUse,
                },
                experienceCloud: {
                  analytics: {
                    trackingServer: reportingServer,
                    supplementalDataId: sdid,
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

            setTntA(clientSideLogging.execute.mboxes[0].analytics.payload.tnta);
            mboxes.forEach((el, idx) => {
              cleanupEvents.push(new Promise((resolve, reject) => {
                window.adobe.target?.applyOffers({
                  selector: `.mbox-name-${el.name}`,
                  response: {
                    execute: {
                      mboxes: [el]
                    }
                  }
                }).then(async (e) => {
                  //get the offers with client_side analytics
                  // const response = await window.adobe.target?.getOffers({
                  //   request: {
                  //     experienceCloud: {
                  //       analytics: {
                  //         trackingServer: reportingServer,
                  //         logging: "client_side"
                  //       }
                  //     },
                  //     execute: {
                  //       mboxes: [{
                  //         index: 0,
                  //         name: "target-demo-site-at-a4t-mbox",
                  //         profileParameters: {
                  //           "user.422": displayName,
                  //           "user.country": country,
                  //           "user.hobby": hobby,
                  //           "user.age": age,
                  //           "brand.bought": "offline"
                  //         }
                  //       }]
                  //     }
                  //   }
                  // });

                  // console.log(response, idx);
                  // el = response.execute.mboxes[idx];
                  // console.log(el);
                  // const mcId = getMcId();
                  // setTntA(el.analytics.payload.tnta);
                  // const events = el.analytics.payload.tnta.split(',');
                  // const revenueEvent = events.filter((event: string) => {
                  //   return event.split('|')[0].split(":").length === 4;
                  // })[0].split("|");
                  // const uniqueViews = events.filter((event: string) => {
                  //   //remove visits and unique visits and not conversion
                  //   return !(event.indexOf('|1') !== -1) && !(event.indexOf('|0') !== -1) && !(event.indexOf('|32767') !== -1);
                  // });
                  // console.log(uniqueViews);
                  //
                  // const viewsLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${el.analytics.payload.tnta}&mid=${mcId}&session-id=${el.analytics.payload["session-id"]}`
                  // //I a sending on event10 :) the revenue
                  //
                  // resolveViewsLink(viewsLink);
                  // const conversionLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${el.analytics.payload.tnta},${revenueEvent[0]}|32767&mid=${mcId}&session-id=${el.analytics.payload["session-id"]}&events=event32=1`;
                  // resolveConversionLink(conversionLink);

                  //make the view call
                  resolve(Tracker('.conversion', () => {
                    // const conversionLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${revenueEvent[0]}|32767&mid=${mcId}&sdid=${sdId}&events=event32=1`;
                    trackEvent("event32=1", mcIdToUse, sdid);
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
            to={{
              pathname: '/target-demo-site/personalization/at/a4t/xp',
              search: new URLSearchParams({
                ...Object.fromEntries(searchParams), // Keep existing query params
                at_preview_token: '60yEAjPMxQu2AktnKmj0tYsfdKGAJyg5DsJ3XxNj67A',
                at_preview_index: '1_1', // Set new index
                at_preview_listed_activities_only: 'true',
                at_preview_evaluate_as_true_audience_ids: '3440621',
              }).toString(),
            }}
            style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 1)}
          >
            Go to Experience 1
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Link
            to={{
              pathname: '/target-demo-site/personalization/at/a4t/xp',
              search: new URLSearchParams({
                ...Object.fromEntries(searchParams), // Keep existing query params
                at_preview_token: '60yEAjPMxQu2AktnKmj0tYsfdKGAJyg5DsJ3XxNj67A',
                at_preview_index: '1_2', // Set new index
                at_preview_listed_activities_only: 'true',
                at_preview_evaluate_as_true_audience_ids: '3440621',
              }).toString(),
            }}
            style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 2)}
          >
            Go to Experience 2
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Link
            to={{
              pathname: '/target-demo-site/personalization/at/a4t/xp',
              search: new URLSearchParams({
                ...Object.fromEntries(searchParams), // Keep existing query params
                at_preview_token: '60yEAjPMxQu2AktnKmj0tYsfdKGAJyg5DsJ3XxNj67A',
                at_preview_index: '1_3', // Set new index
                at_preview_listed_activities_only: 'true',
                at_preview_evaluate_as_true_audience_ids: '3440621',
              }).toString(),
            }}
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

        <TrafficGenerator displayName={displayName} country={country} hobby={hobby} age={age}
                          experienceIndex={experienceIndex} setExperienceIndex={setExperienceIndex}
                          showExperienceIndex={true}
                          setAlgorithmId={setAlgorithmId} selectAlgorithm={true}
                          algorithmId={algorithmId}
                          isTarget={false}
                          reportingServer={reportingServer} conversionEvent={"event32"}
                          setTotal={setTotal} setCurrent={setCurrent} setModalVisible={setModalVisible}
                          mboxes={['target-demo-site-at-a4t-mbox']}/>
      </div>
      <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} current={current} total={total}/>
    </main>
  )
    ;
};

export default PersonalizationATA4T;
