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
}

const PersonalizationAAA4TXP: React.FC<XperienceProps> = ({ displayName, token, activityIndex, experienceIndex, trueAudienceId, country, hobby, age, refreshKey}) => {
    useEffect(() => {
        let cleanupEvents: [Promise<any>?] = [];
        AtJs().then(() => {
            if (window.adobe && window.adobe.target) {
                window.adobe.target.getOffers({
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
      </main>
    )
      ;
};

export default PersonalizationAAA4TXP;
