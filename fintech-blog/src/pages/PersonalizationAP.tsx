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

const PersonalizationAP: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, mcId}) => {
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



    const handleSetToken = (newToken: string, activityId: number, experienceId: number) => {
        setToken(newToken);
        setExperienceIndex(experienceId);
        setActivityIndex(activityId);
    };

    const generateViews = (number: string) => {
        generateViewsWithConversions(number, setModalVisible, '', { displayName, country, hobby, age }, ["target-demo-site-ap-mbox-1, target-demo-site-ap-mbox-2, target-demo-site-ap-mbox-3"], undefined, false, undefined, undefined, undefined, true);
    }

    const generateConversions = (number: string) => {
        generateViewsWithConversions(number, setModalVisible, '', { displayName, country, hobby, age }, ["target-demo-site-ap-mbox-1, target-demo-site-ap-mbox-2, target-demo-site-ap-mbox-3"], undefined, true, "click", 1, undefined, true);
    }

    return (
      <main>
          <div style={{ padding: '20px' }}>
              <h2>Navigate to Experiences</h2>

              <div style={{ marginBottom: '15px' }}>
                  <Link
                    to="/target-demo-site/personalization/ap/xp?at_preview_token=dczqkm4C5P9S8L6ExR8KTYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_1&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 1)}
                  >
                      Go to Variation 1
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to="/target-demo-site/personalization/ap/xp?at_preview_token=dczqkm4C5P9S8L6ExR8KTYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_2&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 2)}
                  >
                      Go to Variation 2
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to="/target-demo-site/personalization/ap/xp?at_preview_token=dczqkm4C5P9S8L6ExR8KTYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_3&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 3)}
                  >
                      Go to Variation 3
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to="/target-demo-site/personalization/ap/xp?at_preview_token=dczqkm4C5P9S8L6ExR8KTYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_4&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 4)}
                  >
                      Go to Variation 4
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to="/target-demo-site/personalization/ap/xp?at_preview_token=dczqkm4C5P9S8L6ExR8KTYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_5&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 5)}
                  >
                      Go to Variation 5
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to="/target-demo-site/personalization/ap/xp?at_preview_token=dczqkm4C5P9S8L6ExR8KTYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_6&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 6)}
                  >
                      Go to Variation 6
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to="/target-demo-site/personalization/ap/xp?at_preview_token=dczqkm4C5P9S8L6ExR8KTYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_7&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 7)}
                  >
                      Go to Variation 7
                  </Link>
              </div>

              <div style={{ marginBottom: '20px' }}>
                  <Link
                    to="/target-demo-site/personalization/ap/xp?at_preview_token=dczqkm4C5P9S8L6ExR8KTYsfdKGAJyg5DsJ3XxNj67A&at_preview_index=1_8&at_preview_listed_activities_only=true&at_preview_evaluate_as_true_audience_ids=3440621"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '18px' }}
                    onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, 8)}
                  >
                      Go to Variation 8
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
                  <h4>Mbox1</h4>
                  <div data-mbox="target-demo-site-ap-mbox-1" className="mbox-name-target-demo-site-ap-mbox-1"
                       data-at-mbox-name="target-demo-site-ap-mbox-1">

                  </div>
                  <h4>Mbox2</h4>
                  <div data-mbox="target-demo-site-ap-mbox-2" className="mbox-name-target-demo-site-ap-mbox-2"
                       data-at-mbox-name="target-demo-site-ap-mbox-2">

                  </div>
                  <h4>Mbox3</h4>
                  <div data-mbox="target-demo-site-ap-mbox-3" className="mbox-name-target-demo-site-ap-mbox-3"
                       data-at-mbox-name="target-demo-site-ap-mbox-3">

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
          </div>
          <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}/>
      </main>
    )
      ;
};

export default PersonalizationAP;
