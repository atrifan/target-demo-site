import React, { useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import { PersonaProvider, usePersona } from './components/Persona';
import AtJs, { generateToken, getNewCookiePCValue, updateQueryParams } from './lib/atJs';
import RecentlyViewed from './pages/recs/RecentlyViewed';
import Products from './pages/recs/products/Products';
import Product from './pages/recs/products/Product';
import UtilityFloater from './components/UtilityFloater';
import ModelExplorer from './components/ModelExplorer';
import getMcId from './lib/visitor';
import LoadingModal from './components/LoadingModal';

interface XperienceProps {
  displayName: string;
  country: string;
  hobby: string;
  age: string;
}

const App: React.FC<XperienceProps> = ({displayName, country, hobby, age}) => {
  interface Product {
    entityId: string;
    name: string;
    message: string;
    value: string;
    thumbnailUrl: string;
  }

  const [token, setToken] = useState('');
  const [tntA, setTntA] = useState('');
  const [activityIndex, setActivityIndex] = useState(0);
  const [experienceIndex, setExperienceIndex] = useState(-100);
  const [trueAudienceId, setTrueAudienceId] = useState(0);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [campaignIds, setCampaignIds] = useState<string[]>([]);

  const addCampaignId = (newCampaignId: string) => {
    setCampaignIds((prev) => (prev.includes(newCampaignId) ? prev : [...prev, newCampaignId]));
  };

  const [reportingServer, setReportingServer] = useState('adobetargeteng.d1.sc.omtrdc.net');
  const [mcId, setMcId] = useState('');
  const [tntId, setTntId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePersonaSave = (providedMcId?: string, providedTntId?: string, mboxSession?: string) => {

    // Increment the refresh key to trigger re-render
    const token = mboxSession || generateToken();
    // updateQueryParams('mboxSession', `${token}`);
    //new tntId
    const pcToken = providedTntId || getNewCookiePCValue(generateToken());
    // updateQueryParams("PC", `${pcToken}`);

    const mcId = providedMcId || generateToken();
    setMcId(mcId);
    setTntId(`${pcToken}`);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('mboxSession', `${token}`);
    newParams.set('PC', `${pcToken}`);
    newParams.set('MCID', `${mcId}`);
    setSearchParams(newParams);
    //new mcid
    setRefreshKey(prevKey => prevKey + 1);
  };
  useLayoutEffect(() => {
    // Check if the Adobe Target library is loaded
    // if (window.adobe && window.adobe.target) {
    //   window.adobe.target.init();
    // }
    window.targetGlobalSettings = {
      clientCode: window.extension_data.tenant || "emeastage4" || "bullseye",
      imsOrgId: window.extension_data.org || "655538B35271368A0A490D4C@AdobeOrg" || "011B56B451AE49A90A490D4D@AdobeOrg"
    }

    const mboxElements = document.querySelectorAll('[mbox-name]');
    const mboxValues = Array.from(mboxElements).map((element) => element.getAttribute('mbox-name'));
    let parameters = {};

    if(window.extension_data.mboxParams) {
      parameters = window.extension_data.mboxParams
    }

    let counter = 0;
    const mboxes = mboxValues.map((mbox, idx) => {
      const mboxParams = JSON.parse(mboxElements[idx].getAttribute('data-mboxparams') || '{}');
      return {
        index: idx,
        name: mbox,
        parameters: {
          ...parameters,
          ...mboxParams
        },
        profileParameters: {
          "user.422": displayName,
          "user.country": country,
          "user.hobby": hobby,
          "user.age": age,
          ...window.extension_data.profileParameters
        }
      }
    });

    let deliveryRequest: any = {
      property: {
        token: window.extension_data.atProperty,
      },
      execute: {
        pageLoad: {
          parameters: {
            ...parameters
          },
          profileParameters: {
            "user.422": displayName,
            "user.country": country,
            "user.hobby": hobby,
            "user.age": age,
            ...window.extension_data.profileParameters
          }
        }
      }
    }
    if (mboxes.length > 0) {
      deliveryRequest = {
        property: {
          token: window.extension_data.atProperty,
        },
        execute: {
          mboxes: mboxes
        }
      }
    }

    setExperienceIndex(-100);
    console.log(mboxValues);
    let cleanupEvents: [Promise<any>?] = [];
    const mcIdToUse = mcId.length > 0 ? mcId : getMcId();
    AtJs().then(() => {
      console.log(" loaded at.js" , window.adobe);
      if (window.adobe && window.adobe.target) {
        console.log({
          request: {
            property: deliveryRequest.property,
            id: {
              marketingCloudVisitorId: mcIdToUse,
            },
            execute: deliveryRequest.execute
          }
        });
        window.adobe.target.getOffers({
          request: {
            property: deliveryRequest.property,
            id: {
              marketingCloudVisitorId: mcIdToUse,
            },
            execute: deliveryRequest.execute
          }
        })
          .then(response => {
            console.log(response);
            const mboxes: any[] = response.execute.mboxes;
            let count = 1;
            if (mboxes && mboxes.length > 0) {
              mboxes.forEach(el => {
                addCampaignId(el?.options?.[0]?.responseTokens?.["activity.id"])
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
            } else {
              window.adobe.target?.applyOffers({
                response: response
              });
            }
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
  }, [mcId, tntId]);
  return (
    <div>
      <Header refreshOnSave={handlePersonaSave}/>


      <ModelExplorer campaignIds={campaignIds} tenant={window.extension_data.tenant}/>
      <UtilityFloater
        handlePersonaSave={handlePersonaSave}
        mcId={mcId}
        tntId={tntId}
        displayName={displayName}
        country={country}
        hobby={hobby}
        age={age}
        experienceIndex={experienceIndex}
        setExperienceIndex={setExperienceIndex}
        setTotal={setTotal}
        setCurrent={setCurrent}
        setModalVisible={setModalVisible}
      />
      <LoadingModal isVisible={modalVisible} onClose={() => setModalVisible(false)} total={total}
                    current={current}/>
    </div>
  );

}

const PersonaConsumer: React.FC<{ children: (value: any) => React.ReactNode }> = ({ children }) => {
  const persona = usePersona(); // Hook to access persona context
  return <>{children(persona)}</>; // Pass persona context to children
};

export default App;