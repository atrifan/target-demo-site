import React, { useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import { PersonaProvider, usePersona } from './components/Persona';
import Sdk, { getAndApplyOffers, generateToken, getNewCookiePCValue, updateQueryParams, getQueryParameter } from './lib/factory';
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
  Sdk(window.extension_data.sdkType);
  const [mcId, setMcId] = useState('');
  const [tntId, setTntId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePersonaSave = (providedMcId?: string, providedTntId?: string, mboxSession?: string) => {

    console.log("persona save");
    Sdk(window.extension_data.sdkType);
    // Increment the refresh key to trigger re-render
    const token = mboxSession || generateToken();
    // updateQueryParams('mboxSession', `${token}`);
    //new tntId
    const pcToken = providedTntId || getNewCookiePCValue(generateToken());
    // updateQueryParams("PC", `${pcToken}`);

    let mcId = providedMcId || `${generateToken(38)}`;
    if(window.extension_data.sdkType === 'atjs') {
      mcId = providedMcId || `${generateToken(2)}-${generateToken(2)}`
    }
    setMcId(mcId);
    setTntId(`${pcToken}`);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('mboxSession', `${token}`);
    newParams.set('PC', `${pcToken}`);
    newParams.set('MCID', `${mcId}`);
    //clear the non rendering stuff
    //TODO: might need for initial run  to run it with mboxEdit=1 disable=1 authoring_enabled=1
    newParams.delete("mboxEdit");
    newParams.delete("mboxDisable");
    newParams.delete("adobe_authoring_enabled");
    setSearchParams(newParams);
    //new mcid
    setRefreshKey(prevKey => prevKey + 1);
  };

  const targetRetRender = async (cleanupEvents: [Promise<any>?] = []) => {

    window.targetGlobalSettings = {
      clientCode: window.extension_data.tenant || "emeastage4" || "bullseye",
      imsOrgId: window.extension_data.org || "655538B35271368A0A490D4C@AdobeOrg" || "011B56B451AE49A90A490D4D@AdobeOrg"
    }

    const mboxElements = document.querySelectorAll('[mbox-name]');
    const mboxValues = Array.from(mboxElements).map((element) => element.getAttribute('mbox-name'));
    let parameters = {};

    if (window.extension_data.mboxParams) {
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

    const views = window.extension_data.decisionScopes.length > 0 ? window.extension_data.decisionScopes.split(",") : [];

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
      },
      prefetch: {
        views: views.length > 0 ? views.map((view: string) => { return {
          name: view,
          key: view,
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
        }}) : undefined
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
    const mcIdToUse = mcId.length > 0 ? mcId : getQueryParameter('MCID') || getMcId();

    await Sdk(window.extension_data.sdkType)();
    console.log(" loaded at.js", window.adobe);
    if (window.adobe && window.adobe.target) {
      console.log({
        request: {
          property: deliveryRequest.property,
          id: {
            marketingCloudVisitorId: mcIdToUse,
          },
          execute: deliveryRequest.execute,
          prefetch: deliveryRequest.prefetch
        }
      });
      return getAndApplyOffers(deliveryRequest, mcIdToUse, addCampaignId);
    }
  }

  const websdkRetRender = async (cleanupEvents: [Promise<any>?] = []) => {
    // 1) Load the chosen SDK (at.js or Alloy loader)
    await Sdk(window.extension_data.sdkType)();
    console.log("SDK loaded:", window.adobe || window.alloy);

    // 2) Collect all mbox names on the page
    const mboxElements = document.querySelectorAll<HTMLElement>("[mbox-name]");
    const mboxNames = Array.from(mboxElements).map((el) => el.getAttribute("mbox-name")!).filter(Boolean);

    // 3) Global-level mbox and profile parameters
    const baseParams = window.extension_data.mboxParams || {};
    const profileParams = {
      "user.422": displayName,
      "user.country": country,
      "user.hobby": hobby,
      "user.age": age,
      ...window.extension_data.profileParameters,
    };

    // 4) Per-mbox parameters mapping (object of mboxName → params)
    const mboxParams: any = mboxNames.length > 0 ? mboxNames.map((mboxName, idx) => {
      const element = document.getElementsByClassName(`mbox-name-${mboxName}`)[0];
      return JSON.parse(element.getAttribute('data-mboxparams') || '{}');
    }) : {}

    // 5) Resolve MCID
    const mcIdToUse = mcId.length > 0 ? mcId : getQueryParameter('MCID') || getMcId();

    // 6) Build Alloy payload for sendEvent
    const deliveryRequest = {
      decisionScopes: mboxNames.length > 0 ? mboxNames : [],
      xdm: {
        profile: profileParams,
        identityMap: {
          ECID: [{ id: mcIdToUse, authenticatedState: "ambiguous" }]
        }
      },
      data: {
        __adobe: {
          target: {
            parameters: baseParams,
            profileParameters: profileParams,
            mboxes: mboxNames.map((name, index) => ({
              id: index,
              name,
              parameters: {
                ...baseParams,
                ...(mboxParams[index] || {})
              }
            }))
          }
        }
      }
    };

    // 7) Reset experience index and log payload
    setExperienceIndex(-100);
    console.log("Alloy payload:", deliveryRequest);

    // 8) Fire Alloy sendEvent + apply decisions
    return getAndApplyOffers(deliveryRequest, mcIdToUse, addCampaignId);
  };


  useLayoutEffect(() => {
    // Check if the Adobe Target library is loaded
    // if (window.adobe && window.adobe.target) {
    //   window.adobe.target.init();
    // }
    if (!displayName || !country || !hobby || !age) {
      return;
    }
    let cleanupEvents: [Promise<any>?] = [];
    if (window.extension_data.sdkType === "atjs") {
      targetRetRender(cleanupEvents);
    } else {
      websdkRetRender(cleanupEvents);
    }


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