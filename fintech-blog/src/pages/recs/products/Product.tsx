import React, { useLayoutEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";
import "./Product.css";
import AtJs from '../../../lib/atJs';
import products, { ProductInterface } from './Products';
import Products from './Products';
import getMcId from '../../../lib/visitor';
interface ProductProps {
  product: {
    entityId: string;
    name: string;
    value: string;
    message: string;
    thumbnailUrl: string;
  } | null;
  onSelectProduct: (product: ProductInterface) => void;
  mcId?: string;
}

const Product: React.FC<ProductProps> = ({ product, onSelectProduct, mcId }) => {
  const { entityId } = useParams();
  useLayoutEffect(() => {
    const mcIdToUse = mcId && mcId.length > 0 ? mcId : getMcId();
    AtJs().then(() => {
      window.adobe.target?.getOffers({
        'request': {
          id: {
            marketingCloudVisitorId: mcIdToUse,
          },
          execute: {
            pageLoad: {
              parameters: {
                "entity.id": entityId
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
  },[product, mcId]);

  return (
    <main>
      <div className="product-details">
        <img src={product?.thumbnailUrl} alt={product?.name}/>
        <h1>{product?.name}</h1>
        <p>Product Description: {product?.message}</p>
        <p>Price: ${product?.value}</p>
      </div>

      <div className="similarity-section content-similarity">
        <h2>Content Similarity</h2>
        <div className="similar-products">
          Content Similarity
        </div>
      </div>

      <div className="similarity-section viewed-bought">
        <h2>People Who Viewed This Also Bought</h2>
        <div className="similar-products">
          Viewed Bought
        </div>
      </div>

      <div className="similarity-section bought-bought">
        <h2>People Who Bought This Also Bought</h2>
        <div className="similar-products">
          Bought Bought
        </div>
      </div>

      <div className="similarity-section viewed-viewed">
        <h2>People Also Viewed</h2>
        <div className="similar-products">
          Viewed Viewed
        </div>
      </div>

      <div className="similarity-section image-similarity">
        <h2>Image similarity</h2>
        <div className="similar-products">
          Image Similarity
        </div>
      </div>


      <div className="similarity-section">
        <h2>Product List</h2>
        <Products onSelectProduct={onSelectProduct} providedEntityId={product?.entityId}/>
      </div>


    </main>

  );
};

export default Product;
