import React, { useEffect } from 'react';
import AtJs from '../lib/atJs';

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

const PersonalizationATXP: React.FC<XperienceProps> = ({ displayName, token, activityIndex, experienceIndex, trueAudienceId, country, hobby, age, refreshKey}) => {
  useEffect(() => {
    AtJs().then(() => {
      if (window.adobe && window.adobe.target) {
        window.adobe.target.getOffers({
          request: {
            experienceCloud: {
              analytics: {
                logging: "client_side"
              }
            },
            execute: {
              mboxes: [{
                index: 0,
                name: "target-demo-site-at-mbox",
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
              });

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
        <div data-mbox="target-demo-site-at-mbox" className="mbox-name-target-demo-site-at-mbox" data-at-mbox-name="target-demo-site-at-mbox">

        </div>
    </main>
  )
    ;
};

export default PersonalizationATXP;
