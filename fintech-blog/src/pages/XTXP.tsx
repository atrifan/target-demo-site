import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import Tracker from '../lib/tracker';
import "./xt.css";
import getMcId from '../lib/visitor';
import LoadingModal from '../components/LoadingModal';
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
  country: string;
  hobby: string;
  age: string;
  refreshKey: number;
  mcId: string;
}

const XTXP: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, mcId}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
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
                name: "target-demo-site-xt-mbox",
                profileParameters: {
                  "user.422": displayName,
                  "user.country": country,
                  "user.hobby": hobby,
                  "user.age": age,
                  "age": age
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
      <div style={{ padding: '20px' }}>
        <div data-mbox="target-demo-site-xt-mbox" className="mbox-name-target-demo-site-xt-mbox"
             data-at-mbox-name="target-demo-site-xt-mbox">

        </div>
      </div>
      <TrafficGenerator displayName={displayName} country={country} hobby={hobby} age={age}
                        experienceIndex={experienceIndex}
                        isTarget={true}
                        conversionEvent={'click'}
                        setTotal={setTotal} setCurrent={setCurrent} setModalVisible={setModalVisible}
                        mboxes={['target-demo-site-xt-mbox']} />
      <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} current={current} total={total}/>
    </main>
  )
    ;
};

export default XTXP;
