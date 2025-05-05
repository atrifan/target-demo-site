import React, { useEffect, useLayoutEffect, useState } from 'react';
import "./ProductUtil.css";
import { generateToken } from '../lib/atJs';
import { trackEvent } from '../lib/visitor';

interface ProductUtilProps {
  mcId: string;
  tntId: string;
  isOpen: boolean;
  onClose: () => void;
  mboxes: string;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}



const ProductUtil: React.FC<ProductUtilProps> = ({ mcId, tntId, isOpen, onClose, mboxes, setTotal, setCurrent, setModalVisible }) => {
  const [entityId, setEntityId] = useState("");
  const [productValue, setProductValue] = useState("100");
  const [views, setViews] = useState(1);
  const [buys, setBuys] = useState(1);
  const [isUnique, setIsUnique] = useState(true); // Added isUnique state
  const [mboxesInput, setMboxesInput] = useState(mboxes);
  const [isAnalytics, setIsAnalytics] = useState(false);


  const getNewCookiePCValue = (token: string) => {
    return `cookie-${token}`;
  };

  const updateQueryParams = (key: string, value: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
  };

  const generate = (entityId: string, unique: boolean, views: number, type: string, setCurrent: (value: number) => void, onClose: () => void, productValue?: string, analytics: boolean = false) => {
    let mcId: any;
    let sessionId: any;
    const mboxesToSend = mboxesInput.length > 0 ? mboxesInput.split(',') : [];
    setModalVisible(true);
    setTotal(views);
    setCurrent(views);

    let parameters = {};

    if(window.extension_data.mboxParams) {
      parameters = window.extension_data.mboxParams
    }

    const mboxParams: any = mboxesToSend.length > 0 ? mboxesToSend.map((mboxName, idx) => {
      const element = document.getElementsByClassName(`mbox-name-${mboxName}`)[0];
      return JSON.parse(element.getAttribute('data-mboxparams') || '{}');
    }) : {}

    const interval = setInterval(() => {
      if (unique) {
        mcId = `${generateToken(38)}`;
        sessionId = generateToken();
        updateQueryParams("MCID", mcId);
        updateQueryParams("PC", getNewCookiePCValue(generateToken()));
        updateQueryParams("mboxSession", sessionId);
      } else {
        mcId = window.location.search.includes("MCID") ? new URLSearchParams(window.location.search).get("MCID") : "";
        sessionId = window.location.search.includes("mboxSession") ? new URLSearchParams(window.location.search).get("mboxSession") : "";
      }

      if (views <= 0) {
        clearInterval(interval);
        setModalVisible(false);
        onClose();
        return;
      }

      if (analytics) {
        trackEvent(type === "buys" ? "purchase" : "view", mcId, window.s.visitor.getSupplementalDataID(), {
          "a.target.sessionid": sessionId,
          purchaseID: `${Date.now()}-${entityId}`,
          /*format <category>;<product_name>;<quantity>;<price>;<optional_evars split by | > - then you can continue in the same format with a trailling "," meaning you will have multiple products in one event*/
          products: `;${entityId};1;${productValue}`,
          marketingCloudVisitorID: mcId,
          supplementalDataID: window.s.visitor.getSupplementalDataID(),
          tnt: tntId,
        })
        setCurrent(views - 1);
        views -= 1;
        return;
      }

      const requestPayload =
        type === "views"
          ? { "entity.id": entityId }
          : {
            orderId: `${Date.now()}-${entityId}`,
            orderTotal: `${productValue}`, // Adjust as needed
            productPurchaseId: entityId,
          };

      console.log("requestPayload", requestPayload);
      window.adobe.target
        ?.getOffers({
          request: {
            property: {
              token: window.extension_data.atProperty,
            },
            id: {
              marketingCloudVisitorId: mcId,
            },
            execute: {
              mboxes: mboxesToSend.length > 0 ? mboxesToSend.map((mboxName, idx) => {
                return {
                  index: idx,
                  name: mboxName,
                  parameters: {
                    ...requestPayload
                  },
                  profileParameters: {
                    ...window.extension_data.profileParameters
                  }
                }
              }) : undefined,
              pageLoad: mboxesToSend.length == 0 ? {
                parameters: {
                  ...requestPayload
                },
                profileParameters: {
                  ...window.extension_data.profileParameters
                }
              } : undefined
            },
          },
        })
        .then((response: any) => {
          window.adobe.target?.applyOffers({ response });
        })
        .finally(() => {
          setCurrent(views - 1);
          if (views === 1) {
            clearInterval(interval);
            onClose();
          }
        });

      views -= 1;
    }, 300);
  };

  useLayoutEffect(() => {
    return () => {
      setMboxesInput(mboxes);
    }
  }, [mboxes]);

  if (!isOpen) return null; // Prevent rendering when closed

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        <button className="close-button" onClick={onClose}>Close</button>
        <h2>Product Utility</h2>

        <label>Entity ID:</label>
        <input value={entityId} onChange={(e) => setEntityId(e.target.value)}/>

        <label>Product Value:</label>
        <input value={productValue} onChange={(e) => setProductValue(e.target.value)}/>

        <div className="group">
          <label>Number of Views:</label>
          <input type="number" value={views} onChange={(e) => setViews(Number(e.target.value))}/>
          <button
            className="generate-btn"
            onClick={() =>
              generate(entityId, isUnique, views, "views", setCurrent, onClose, productValue, isAnalytics)
            }
          >
            Generate Views
          </button>
        </div>

        <div className="group">
          <label>Number of Buys:</label>
          <input type="number" value={buys} onChange={(e) => setBuys(Number(e.target.value))}/>
          <button
            className="generate-btn"
            onClick={() =>
              generate(entityId, isUnique, buys, "buys", setCurrent, onClose, productValue, isAnalytics)
            }
          >
            Generate Buys
          </button>
        </div>

        <div className="group">
          <label>Unique:</label>
          <input
            type="checkbox"
            checked={isUnique}
            onChange={() => setIsUnique(!isUnique)} // Toggle isUnique state
          />
        </div>
        <div className="group">
          <label>Analytics:</label>
          <input
            type="checkbox"
            checked={isAnalytics}
            onChange={() => setIsAnalytics(!isAnalytics)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUtil;
