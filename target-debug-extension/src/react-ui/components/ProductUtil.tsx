import React, { useState } from "react";
import "./ProductUtil.css";
import { generateToken } from '../lib/atJs';

interface ProductUtilProps {
  mcId: string;
  tntId: string;
  isOpen: boolean;
  onClose: () => void;
}

const getNewCookiePCValue = (token: string) => {
  return `cookie-${token}`;
};

const updateQueryParams = (key: string, value: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(key, value);
  window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
};

const generate = (entityId: string, unique: boolean, views: number, type: string, setCurrent: (value: number) => void, onClose: () => void, productValue?: string) => {
  let mcId: any;
  if (unique) {
    mcId = `${generateToken(2)}-${generateToken(2)}`;
    updateQueryParams("MCID", mcId);
    updateQueryParams("PC", getNewCookiePCValue(generateToken()));
    updateQueryParams("mboxSession", generateToken());
  } else {
    mcId = window.location.search.includes("MCID") ? new URLSearchParams(window.location.search).get("MCID") : "";
  }

  const interval = setInterval(() => {
    if (views <= 0) {
      clearInterval(interval);
      onClose();
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
          id: {
            marketingCloudVisitorId: mcId,
          },
          execute: {
            pageLoad: {
              parameters: requestPayload,
            },
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

const ProductUtil: React.FC<ProductUtilProps> = ({ mcId, tntId, isOpen, onClose }) => {
  const [entityId, setEntityId] = useState("");
  const [productValue, setProductValue] = useState("100");
  const [views, setViews] = useState(1);
  const [buys, setBuys] = useState(1);
  const [current, setCurrent] = useState(0);
  const [isUnique, setIsUnique] = useState(true); // Added isUnique state

  if (!isOpen) return null; // Prevent rendering when closed

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        <button className="close-button" onClick={onClose}>Close</button>
        <h2>Product Utility</h2>

        <label>Entity ID:</label>
        <input value={entityId} onChange={(e) => setEntityId(e.target.value)} />

        <label>Product Value:</label>
        <input value={productValue} onChange={(e) => setProductValue(e.target.value)} />

        <div className="group">
          <label>Number of Views:</label>
          <input type="number" value={views} onChange={(e) => setViews(Number(e.target.value))} />
          <button
            className="generate-btn"
            onClick={() =>
              generate(entityId, isUnique, views, "views", setCurrent, onClose)
            }
          >
            Generate Views
          </button>
        </div>

        <div className="group">
          <label>Number of Buys:</label>
          <input type="number" value={buys} onChange={(e) => setBuys(Number(e.target.value))} />
          <button
            className="generate-btn"
            onClick={() =>
              generate(entityId, isUnique, buys, "buys", setCurrent, onClose, productValue)
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
      </div>
    </div>
  );
};

export default ProductUtil;
