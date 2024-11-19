import React, { useEffect, useLayoutEffect, useState } from 'react';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import Tracker from '../lib/tracker';
import getMcId from '../lib/visitor';
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
    mcId: string;
}

const PersonalizationAAA4TXP: React.FC<XperienceProps> = ({ displayName, token, activityIndex, experienceIndex, trueAudienceId, country, hobby, age, refreshKey, mcId}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(0);
    useLayoutEffect(() => {
        let cleanupEvents: [Promise<any>?] = [];
        const mcIdToUse = mcId.length > 0 ? mcId : getMcId();
        AtJs().then(() => {
            if (window.adobe && window.adobe.target) {
                window.adobe.target.getOffers({
                    id: {
                        marketingCloudVisitorId: mcIdToUse,
                    },
                    request: {
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
                      // Apply the offers retrieved
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
                          }).then(() => {});
                          count += 1;
                      });
                  })
                  .catch(error => {
                      console.log("Error fetching or applying offers:", error);
                  });
            }
        })
    }, [refreshKey]);
    return (
      <main>
          <div data-mbox="target-demo-site-aa-mbox" className="mbox-name-target-demo-site-aa-mbox" data-at-mbox-name="target-demo-site-aa-mbox">

          </div>
         <TrafficGenerator displayName={displayName} country={country} hobby={hobby} age={age}
                          experienceIndex={experienceIndex}
                           isTarget={true}
                           conversionEvent={'click'}
                          setTotal={setTotal} setCurrent={setCurrent} setModalVisible={setModalVisible}
                          mboxes={['target-demo-site-aa-mbox']} />
          <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} current={current} total={total}/>
      </main>
    )
      ;
};

export default PersonalizationAAA4TXP;
