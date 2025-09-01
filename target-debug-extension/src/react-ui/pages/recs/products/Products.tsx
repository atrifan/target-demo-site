import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Products.css";
import AtJs, {
  generateNotificationRequest,
  generateToken,
  getNewCookiePCValue, getQueryParameter,
  updateQueryParams
} from '../../../lib/atJs';
import LoadingModal from '../../../components/LoadingModal';
import getMcId from '../../../lib/visitor';

export interface ProductInterface {
  entityId: string;
  name: string;
  message: string;
  value: string;
  thumbnailUrl: string;
}

interface ProductsProps {
  onSelectProduct: (product: ProductInterface) => void;
  providedEntityId?: string;
  mcId?: string;
}

const Products: React.FC<ProductsProps> = ({ onSelectProduct, providedEntityId, mcId }) => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [unique, setUnique] = useState<{ [key: string]: boolean }>({});
  const [views, setViews] = useState<{ [key: string]: number }>({});
  const [buys, setBuys] = useState<{ [key: string]: number }>({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [searchParams] = useSearchParams();

  window.targetPageParams = () => {
    return;
  };

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
      } catch (error) {
        console.error("Error fetching CSV:", error);
      }
    };

    fetchData();
  }, [mcId]);

  const handleUniqueChange = (entityId: string, value: boolean) => {
    setUnique((prev) => ({ ...prev, [entityId]: value }));
  };

  const handleViewsChange = (entityId: string, value: number) => {
    setViews((prev) => ({ ...prev, [entityId]: value }));
  };

  const handleBuyChange = (entityId: string, value: number) => {
    setBuys((prev) => ({ ...prev, [entityId]: value }));
  };

  const generate = (entityId: string, unique: boolean, views: number, type: string) => {
    setModalVisible(true);
    setTotal(views);
    setCurrent(views);
    const interval = setInterval(() => {
      let mcId: any;
      if (unique) {
        mcId = `${generateToken(38)}`;
        if (window.extension_data.sdkType === 'atjs') {
          mcId = `${generateToken(2)}-${generateToken(2)}`;
        }
        updateQueryParams("MCID", mcId);
        updateQueryParams("PC", getNewCookiePCValue(generateToken()));
        updateQueryParams('mboxSession', generateToken());
        window.adobe.target?.getOffers({
          'request': {
            id: {
              marketingCloudVisitorId: mcId,
            },
            execute: {
              pageLoad: {
              }
            }
          }
        }).then(function(response) {
          // Apply Offers
          window.adobe.target?.applyOffers({
            response: response
          });
          _generateEvent(type, entityId, --views, interval);
        }).catch(function(error) {
          console.log("AT: getOffers failed - Error", error);
        }).finally(() => {
          // Trigger View call, assuming pageView is defined elsewhere
          //window.adobe.target?.triggerView('recentlyViewed');
        });
      } else {
        mcId = getQueryParameter("MCID") || getMcId();
        _generateEvent(type, entityId, --views, interval);
      }


    }, 300)
  };

  const _generateEvent = (type: string, entityId: string, views: number, interval: any) => {
    //check ProductConstants.java in m2
    setTimeout(() => {
      if (type == 'views') {
        window.adobe.target?.getOffers({
          'request': {
            id: {
              marketingCloudVisitorId: mcId,
            },
            execute: {
              pageLoad: {
                parameters: {
                  "entity.id": entityId
                }
              }
            }
          }
        }).then(function (response) {
          // Apply Offers
          window.adobe.target?.applyOffers({
            response: response
          }).finally(() => {
            setCurrent(views);
            if (views === 0) {
              clearInterval(interval);
              setModalVisible(false);
            }
          });
        })
          .finally(() => {

          });
      } else {
        window.adobe.target?.getOffers({
          'request': {
            id: {
              marketingCloudVisitorId: mcId,
            },
            execute: {
              pageLoad: {
                parameters: {
                  orderId: `${Date.now()}-${entityId}`,
                  orderTotal: `${products.filter((product) => product.entityId === entityId)[0].value || '100'}`,
                  productPurchaseId: entityId
                }
              }
            }
          }
        }).then(function (response) {
          // Apply Offers
          window.adobe.target?.applyOffers({
            response: response
          }).finally(() => {
            setCurrent(views);
            if (views === 0) {
              clearInterval(interval);
              setModalVisible(false);
            }
          });

        }).finally(() => {
        });
      }
    }, 100);
  }

  const handleGenerateViews = (entityId: string) => {
    const isUnique = unique[entityId] ?? true;
    const numViews = views[entityId] ?? 0;
    generate(entityId, isUnique, numViews, 'views');
  };

  const handleGenerateBuys = (entityId: string) => {
    const isUnique = unique[entityId] ?? true;
    const numBuys = buys[entityId] ?? 0;
    generate(entityId, isUnique, numBuys, 'buys');
  };

  return (
    <div className="products-container">
      {products
        .filter((product) => product.entityId !== providedEntityId)
        .map((product) => (
        <div className="product-card" key={product.entityId}>
          <Link
            to={{
              pathname: `/target-demo-site/util/products/${product.entityId}`,
              search: searchParams.toString(),
            }}
            onClick={() => onSelectProduct(product)}
          >
            <img src={product.thumbnailUrl} alt={product.name} />
            <div className="product-name">{product.name}</div>
          </Link>
          <div className="product-actions">
            <label>
              <input
                type="checkbox"
                checked={unique[product.entityId] ?? true}
                onChange={(e) => handleUniqueChange(product.entityId, e.target.checked)}
              />
              Unique
            </label>
            <input
              type="number"
              placeholder="Number of views"
              value={views[product.entityId] ?? ''}
              onChange={(e) => handleViewsChange(product.entityId, parseInt(e.target.value) || 0)}
              className="buy-input"
            />
            <input
              type="number"
              placeholder="Number of buys"
              value={buys[product.entityId] ?? ''}
              onChange={(e) => handleBuyChange(product.entityId, parseInt(e.target.value) || 0)}
              className="buy-input"
            />
            <button onClick={() => handleGenerateViews(product.entityId)} className="generate-views-button">
              Generate Views
            </button>
            <button onClick={() => handleGenerateBuys(product.entityId)} className="generate-buys-button">
              Generate Buys
            </button>
          </div>
        </div>
        ))}
      <LoadingModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} total={total}
                    current={current}/>
    </div>
  );
};

export default Products;
