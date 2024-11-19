import getMcId from './visitor';
import Cookies from 'js-cookie';

export const clearAllCookies = () => {
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    console.log(cookie);
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  localStorage.clear();
  sessionStorage.clear();

};

export function updateQueryParams(key: string, value?: string) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  // Update or set the parameter
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key); // Optionally, delete the param if value is empty
  }


  // Update the browser URL
  window.history.pushState({}, '', `${url.pathname}?${params.toString()}`);
}

export function generateToken(size: number=4) {
    const array = new Uint32Array(size);  // Adjust size as needed
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(16)).join('');
}

export default async function AtJs(targetPageParams?: any) {
  //reset targetPageParams
  window.targetPageParams = () => {};
  if (targetPageParams) {
    window.targetPageParams = targetPageParams;
  }
  if (window.adobe && window.adobe.target) {
    window.adobe.target = undefined;
    clearAllCookies();
  }
  //clear all handlers setup by atjs - all the elements in the page need to have data-mbox attribute
  document.querySelectorAll('[data-mbox]').forEach(element => {
    const clone = element.cloneNode(true); // Clone the element
    element.parentNode?.replaceChild(clone, element); // Replace the original with the clone
  });
  document.querySelectorAll('[data-mbox]').forEach(element => {
    //reset it to the default
    element.innerHTML = "";
  });
  return new Promise((resolve, reject) => {
    if (!window.adobe || !window.adobe.target) {
      //get script element from head with id at-js
      const oldScript = document.getElementById("at-js");
      const oldAppService = document.getElementById("app-service");
      const mcjs = document.getElementById("mcjs");
      //if oldScript is present than delete it
      if (oldScript) {
        oldScript.remove();
      }
      if (oldAppService) {
        oldAppService.remove();
      }
      if (mcjs) {
        mcjs.remove();
      }


      const script = document.createElement('script');
      script.id="at-js";
      script.src = '/target-demo-site/at.js'; // Replace with actual path to at.js
      script.async = true;
      script.onload = () => {
        console.log("at.js loaded");
        //burn the pageload
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load at.js");
        reject(false);
      };
      document.head.appendChild(script);
    }
  })
}

export interface ProfileData {
  displayName: string;
  country: string;
  hobby: string;
  age: string;
}

export function getNewCookiePCValue(newPCValue: string): string | undefined {
  // Retrieve the current mbox cookie
  const mboxCookie = Cookies.get('mbox');

  if (!mboxCookie) {
    return `${newPCValue}.37_0`;
  }

  //Extract the mbox cookie value and split by '|'
  const parts = mboxCookie.split('|');

  // Iterate over parts to find and update the 'PC' value
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('PC#')) {
      const currentPC = parts[i].split('#')[1];
      const version = currentPC.split('.')[1];  // Retain version "37_0"
      return `${newPCValue}.${version}`
    }
  }

  return `${newPCValue}.37_0`;
}

export const generateViewsWithConversions = (number: string, setTotal: any, setCurrent: any, setModalVisible: any, reportingServer: string, profileData: ProfileData, mboxes: string[], tntA?: string, conversion: boolean = false,
                                             conversionEvent?: string, conversionValue: number = 1, algorithmId: number=-1000, isTarget = false, experienceIndex?: number) => {
  if (number.length === 0) {
    return;
  }
  let numberOfViews = parseInt(number);
  setTotal(numberOfViews);
  setCurrent(numberOfViews)
  setModalVisible(true);
  const interval = setInterval(() => {
    //mboxSession generates a new user unique entry // TODO: set profile attributes
    //update visitorid
    const mcId = `${generateToken(2)}-${generateToken(2)}`;
    updateQueryParams("PC", getNewCookiePCValue(generateToken()));
    updateQueryParams('mboxSession', generateToken());
    window.adobe.target?.getOffers({
      request: {
        id: {
          marketingCloudVisitorId: mcId,
        },
        experienceCloud: {
          analytics: {
            trackingServer: reportingServer,
            logging: !isTarget ? "client_side" : "server_side"
          }
        },
        execute: {
          mboxes: mboxes.map((mboxName, idx) => {
              return {
                index: idx,
                name: mboxName,
                profileParameters: {
                "user.422": `${profileData.displayName}-${Date.now()}`,
                  "user.country": profileData.country,
                  "user.hobby": profileData.hobby,
                  "user.age": profileData.age,
                  "brand.bought": "offline"
              }
              }
            })
        }
      }
    })
      .then(response => {
        console.log(response);
        const mboxes: any[] = response.execute.mboxes;
        //content is not removed in place if it's gone missing so than
        document.querySelectorAll('[data-mbox]').forEach(element => {
          const clone = element.cloneNode(true); // Clone the element
          element.parentNode?.replaceChild(clone, element); // Replace the original with the clone
        });
        document.querySelectorAll('[data-mbox]').forEach(element => {
          //reset it to the default
          element.innerHTML = "";
        });
        let okTargeted = false;
        mboxes.forEach((el) => {
          window.adobe.target?.applyOffers({
            selector: `.mbox-name-${el.name}`,
            response: {
              execute: {
                mboxes: [el]
              }
            }
          });
          okTargeted = isTarget? sendNotificationTarget(el, conversionEvent, conversion, profileData, experienceIndex) : sendNotificationAnalytics(tntA, el, algorithmId, reportingServer, mcId, conversion, conversionEvent, conversionValue, experienceIndex);
        })
        if (experienceIndex != undefined && experienceIndex != -100 && okTargeted) {
          numberOfViews -= 1;
          setCurrent(numberOfViews);
        }
      });
    if(experienceIndex == undefined || experienceIndex == -100) {
      numberOfViews -= 1;
      setCurrent(numberOfViews);
    }
    if (numberOfViews === 0) {
      setModalVisible(false);
      clearInterval(interval);
    }
  }, 200);
}

function generateNotificationRequest(el: any, type: string, profileData: ProfileData) {
  const result = {
    id: generateToken(4),
    type: type,
    timestamp: Date.now(),
    mbox: {
      name: el.name,
      state: el.state
    },
    tokens: el.metrics?.filter((e:any) => e.type === type).map((e:any) => e.eventToken),
    parameters: el.parameters,
    profileParameters: {
      ...el.profileParameters,
      "user.422": `${profileData.displayName}-${Date.now()}`,
      "user.country": profileData.country,
      "user.hobby": profileData.hobby,
      "user.age": profileData.age,
      "brand.bought": "offline"
    },
    order: el.order,
    product: el.product
  }

  if (result.tokens == undefined) {
    return undefined;
  }
  return result;
}
export function sendNotificationTarget(el: any, event: string|undefined, conversion: boolean, profileData: ProfileData, experienceIndex?: number) {
  // window.adobe.target?.sendNotifications({
  //     request: { notifications: [generateNotificationRequest(el, 'display', profileData)] }
  //   }
  // );

  if(conversion && event && (el.options[0].responseTokens["experience.id"] == experienceIndex ||
    (experienceIndex == -100 && experienceIndex == undefined))) {
    setTimeout(() => {
      const notifications = generateNotificationRequest(el, event, profileData);
      if (notifications) {
        window.adobe.target?.sendNotifications({
            request: { notifications: [notifications] }
          }
        );
      }

    }, 50);
    return true;
  }

  return false;
}


export function sendNotificationAnalytics(tntA :string|undefined, el: any, algorithmId: number, reportingServer: string, mcId: string, conversion: boolean, conversionEvent: string|undefined, conversionValue: number, experienceIndex: number|undefined) {
  // const mcId = getMcId();
  //don't use experienceindex for analytics not sure if it's needed
  let tntaData = tntA? tntA : el.analytics.payload.tnta;
  console.log(tntA)
  //make targeted events
  tntaData = tntaData.split(',').map((event: string) => {
    //remove visits and unique visits and not conversion
    const eventBreakDown = event.split(':');
    //traffic type - targeted
    eventBreakDown[2] = conversionEvent == 'event10' ? '0' : '1';
    //algorithm id change
    if (algorithmId !== -1000) {
      let [algoId, event] = eventBreakDown[3].split('|');
      algoId = `${algorithmId}`;
      eventBreakDown[3] = `${algoId}|${event}`;
    }

    return eventBreakDown.join(':');
  }).join(',');


  const events = tntaData.split(',');
  const revenueEvent = events.filter((event: string) => {
    return event.split('|')[0].split(":").length === 4;
  })[0].split("|");

  if (tntaData.indexOf("|1") == -1) {
    tntaData = `${revenueEvent[0]}|1,${tntaData}`;
  }

  //no unique
  if (tntaData.indexOf("|0") == -1) {
    tntaData = `${revenueEvent[0]}|0,${tntaData}`;
  }

  let viewsLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${tntaData}&mid=${mcId}&c.a.target.sessionid=${el.analytics.payload["session-id"]}`
  fetch(viewsLink, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain"
    },
    // Make sure to include credentials if needed, depending on Adobe's CORS policy
    credentials: "include" // or "same-origin" if running on the same domain
  })
  if (!conversion) {
    return true;
  }

  if(conversion && conversionEvent && (el.options[0].responseTokens["experience.id"] == experienceIndex ||
    (experienceIndex == -100 && experienceIndex == undefined))) {
    viewsLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${revenueEvent[0]}|32767,${revenueEvent[0]}|${conversionEvent?.replace("event","")}|${conversionValue}&mid=${mcId}&c.a.target.sessionid=${el.analytics.payload["session-id"]}&events=${conversionEvent}=${conversionValue}`
    setTimeout(()=>{
      fetch(viewsLink, {
        method: "GET",
        headers: {
          "Content-Type": "text/plain"
        },
        // Make sure to include credentials if needed, depending on Adobe's CORS policy
        credentials: "include" // or "same-origin" if running on the same domain
      })
    }, 50);
    return true;
  }

  return false;
}