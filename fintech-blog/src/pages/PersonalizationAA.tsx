import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import Tracker from '../lib/tracker';
import getMcId from '../lib/visitor';
import LoadingModal from '../components/LoadingModal';
import TrafficGenerator from '../components/TrafficGenerator';
import ModelExplorer from '../components/ModelExplorer';

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

const PersonalizationAA4T: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, mcId}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(0);
    const [campaignId, setCampaignId] = useState('');
    const [searchParams] = useSearchParams();
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
                                name: "target-demo-site-aa-mbox",
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
                          setCampaignId(el.options[0].responseTokens["activity.id"])
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
                    to={{
                        pathname: "/target-demo-site/personalization/aa/xp",
                        search: new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()), // Keep the existing search params
                            at_preview_token: 'e73XhadLHKh4wmj8RrfeBYsfdKGAJyg5DsJ3XxNj67A',
                            at_preview_index: '1_1',
                            at_preview_listed_activities_only: 'true',
                            at_preview_evaluate_as_true_audience_ids: '3440621'
                        }).toString()
                    }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 1)}
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                  >
                      Go to Experience 1
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to={{
                        pathname: "/target-demo-site/personalization/aa/xp",
                        search: new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()), // Keep the existing search params
                            at_preview_token: 'e73XhadLHKh4wmj8RrfeBYsfdKGAJyg5DsJ3XxNj67A',
                            at_preview_index: '1_2',
                            at_preview_listed_activities_only: 'true',
                            at_preview_evaluate_as_true_audience_ids: '3440621'
                        }).toString()
                    }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 2)}
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                  >
                      Go to Experience 2
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to={{
                        pathname: "/target-demo-site/personalization/aa/xp",
                        search: new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()), // Keep the existing search params
                            at_preview_token: 'e73XhadLHKh4wmj8RrfeBYsfdKGAJyg5DsJ3XxNj67A',
                            at_preview_index: '1_3',
                            at_preview_listed_activities_only: 'true',
                            at_preview_evaluate_as_true_audience_ids: '3440621'
                        }).toString()
                    }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 3)}
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                  >
                      Go to Experience 3
                  </Link>
              </div>

              <ModelExplorer campaignId={campaignId} tenant={"bullseye"}/>


              <div style={{
                  border: '1px solid #ddd',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  marginTop: '20px'
              }}
              >
                  <h3>The served experience is:</h3>
                  <div data-mbox="target-demo-site-aa-mbox" className="mbox-name-target-demo-site-aa-mbox"
                       data-at-mbox-name="target-demo-site-aa-mbox">

                  </div>
              </div>
              <TrafficGenerator displayName={displayName} country={country} hobby={hobby} age={age}
                                experienceIndex={experienceIndex} setExperienceIndex={setExperienceIndex}
                                showExperienceIndex={true}
                                isTarget={true}
                                conversionEvent={'click'}
                                setTotal={setTotal} setCurrent={setCurrent} setModalVisible={setModalVisible}
                                mboxes={['target-demo-site-aa-mbox']}/>
          </div>
          <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} total={total}
                        current={current}/>
      </main>
    )
      ;
};

export default PersonalizationAA4T;
