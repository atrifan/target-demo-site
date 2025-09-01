import React, { useLayoutEffect } from 'react';
import "./RecentlyViewed.css";
import AtJs from '../../lib/atJs';
import getMcId from '../../lib/visitor';

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

const RecentlyViewed: React.FC<XperienceProps> = ({ displayName, token, setToken, activityIndex, setActivityIndex, experienceIndex, setExperienceIndex, trueAudienceId, setTrueAudienceId, country, hobby, age, refreshKey, mcId}) => {
  useLayoutEffect(() => {
    const mcIdToUse = mcId.length > 0 ? mcId : getMcId();
    AtJs().then(() => {
      window.adobe.target?.getOffers({
        'request': {
          id: {
            marketingCloudVisitorId: mcIdToUse,
          },
          execute: {
            pageLoad: {
              'profileParameters': {
                'user.422': `${displayName}-${Date.now()}`,
                'user.country': country,
                'user.hobby': hobby,
                'user.age': age
              }
            }
          }
        }
      }).then(function(response) {
        // Apply Offers
        window.adobe.target?.applyOffers({
          response: response
        });
      }).catch(function(error) {
        console.log("AT: getOffers failed - Error", error);
      }).finally(() => {
        // Trigger View call, assuming pageView is defined elsewhere
        //window.adobe.target?.triggerView('recentlyViewed');
      });
    });
  }, [refreshKey]);
  return (
    <div className="recently-viewed">
      <div className="product-container">
        {/* Placeholder content will be dynamically inserted here */}
        <div className="placeholder">
          {/* Example message or placeholder content */}
          No recently viewed products yet.
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
