import React, { useLayoutEffect } from 'react';
import { useLocation, useParams } from "react-router-dom";
import "./Product.css";
import AtJs from '../../../lib/atJs';
import products from './Products';
interface ProductProps {
  product: {
    entityId: string;
    name: string;
    value: string;
    message: string;
    thumbnailUrl: string;
  } | null;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const { entityId } = useParams();
  useLayoutEffect(() => {
    AtJs(() => {
      return {
        "entity.id": entityId,
      }

    }).then(() => {
      window.adobe.target?.triggerView('product');
    });
  },[]);

  return (
    <div className="product-details">
      <img src={product?.thumbnailUrl} alt={product?.name}/>
      <h1>{product?.name}</h1>
      <p>Product Description: {product?.message}</p>
      <p>Price: ${product?.value}</p>
    </div>
  );
};

export default Product;
