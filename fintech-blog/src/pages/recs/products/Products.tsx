import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import "./Products.css";
import AtJs from '../../../lib/atJs';

interface Product {
  entityId: string;
  name: string;
  message: string;
  value: string;
  thumbnailUrl: string;
}

interface ProductsProps {
  onSelectProduct: (product: Product) => void;
}

const Products:React.FC<ProductsProps> = ({ onSelectProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  window.targetPageParams = () => {
    return;
  }
  const [searchParams] = useSearchParams();
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/atrifan/target-demo-site/refs/heads/main/resources/feed.csv"
        );
        const text = await response.text();

        const parsedProducts = text
          .split("\n")
          .filter((line) => !line.startsWith("## RECS") && line.trim() !== "")
          .map((line) => {
            const [entityId, name, , message, thumbnailUrl, value] = line.split(",");
            return { entityId, name, message, value, thumbnailUrl };
          });

        setProducts(parsedProducts);
        AtJs().then(() => {
          window.adobe.target?.triggerView('products');
        });
      } catch (error) {
        console.error("Error fetching CSV:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="products-container">
      {products.map((product) => (
        <div className="product-card" key={product.entityId}>
          <Link
            to={{
              pathname: `/target-demo-site/util/products/${product.entityId}`,
              search: searchParams.toString()
            }}
            onClick={() => onSelectProduct(product)}
          >
            <img src={product.thumbnailUrl} alt={product.name} />
            <div className="product-name">{product.name}</div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Products;
