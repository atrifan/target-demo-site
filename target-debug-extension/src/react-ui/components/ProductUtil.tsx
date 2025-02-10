import React, { useState } from "react";
import "./ProductUtil.css";

interface ProductUtilProps {
  mcId: string;
  tntId: string;
  isOpen: boolean;
  onClose: () => void;
}

const generateProductViewPlaceholder = (entityId: string) => ({
  "entity.id": entityId,
});

const generateProductBuyPlaceholder = (entityId: string, productValue: string) => ({
  orderId: `${Date.now()}-${entityId}`,
  orderTotal: productValue,
  productPurchaseId: entityId,
});

const _generateEvent = (
  type: "views" | "buys",
  entityId: string,
  productValue: string,
  count: number,
  setCurrent: (value: number) => void,
  onClose: () => void
) => {
  let interval = setInterval(() => {
    if (count <= 0) {
      clearInterval(interval);
      onClose();
      return;
    }

    const requestPayload =
      type === "views"
        ? generateProductViewPlaceholder(entityId)
        : generateProductBuyPlaceholder(entityId, productValue);

    window.adobe.target
      ?.getOffers({
        request: {
          id: {
            marketingCloudVisitorId: "mcId",
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
        setCurrent(count - 1);
      });

    count -= 1;
  }, 100);
};

const ProductUtil: React.FC<ProductUtilProps> = ({ mcId, tntId, isOpen, onClose }) => {
  const [entityId, setEntityId] = useState("");
  const [productValue, setProductValue] = useState("100");
  const [views, setViews] = useState(1);
  const [buys, setBuys] = useState(1);
  const [current, setCurrent] = useState(0);

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
                _generateEvent("views", entityId, productValue, views, setCurrent, onClose)
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
                _generateEvent("buys", entityId, productValue, buys, setCurrent, onClose)
              }
            >
              Generate Buys
            </button>
          </div>

      </div>
    </div>
      );
      };

      export default ProductUtil;
