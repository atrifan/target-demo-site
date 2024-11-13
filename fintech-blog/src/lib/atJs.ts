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

export function updateQueryParam(key: string, value?: string) {
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

export function generateToken() {
    const array = new Uint32Array(4);  // Adjust size as needed
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(16)).join('');
}

export default async function AtJs() {
  if (window.adobe && window.adobe.target) {
    window.adobe.target = undefined;
    clearAllCookies();
  }
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
    console.error('mbox cookie not found.');
    return;
  }

  // Extract the mbox cookie value and split by '|'
  const parts = mboxCookie.split('|');

  // Iterate over parts to find and update the 'PC' value
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('PC#')) {
      const currentPC = parts[i].split('#')[1];
      const version = currentPC.split('.')[1];  // Retain version "37_0"
      return `${newPCValue}.${version}`
    }
  }

  return undefined;
}

export const generateViewsWithConversions = (number: string, setModalVisible: any, reportingServer: string, profileData: ProfileData, mboxName: string, tntA?: string, conversion: boolean = false,
                                             conversionEvent?: string, conversionValue: number = 1) => {
  let numberOfViews = parseInt(number);
  setModalVisible(true);
  const interval = setInterval(() => {
    //mboxSession generates a new user unique entry // TODO: set profile attributes
    //update visitorid
    const mcId = generateToken();
    updateQueryParam("PC", getNewCookiePCValue(generateToken()));
    updateQueryParam('mboxSession', generateToken());
    window.adobe.target?.getOffers({
      request: {
        id: {
          marketingCloudVisitorId: mcId,
        },
        experienceCloud: {
          analytics: {
            trackingServer: reportingServer,
            logging: "client_side"
          }
        },
        execute: {
          mboxes: [{
            index: 0,
            name: mboxName,
            profileParameters: {
              "user.422": `${profileData.displayName}-${Date.now()}`,
              "user.country": profileData.country,
              "user.hobby": profileData.hobby,
              "user.age": profileData.age,
              "brand.bought": "offline"
            }
          }]
        }
      }
    })
      .then(response => {
        console.log(response);
        const mboxes: any[] = response.execute.mboxes;
        mboxes.forEach((el) => {
          // const mcId = getMcId();
          let tntaData = tntA? tntA : el.analytics.payload.tnta;
          //make targeted events
          tntaData = tntaData.split(',').map((event: string) => {
            //remove visits and unique visits and not conversion
            const eventBreakDown = event.split(':');
            //traffic type - targeted
            eventBreakDown[2] = '1';
            return eventBreakDown.join(':');
          }).join(',');
          const events = tntaData.split(',');
          const revenueEvent = events.filter((event: string) => {
            return event.split('|')[0].split(":").length === 4;
          })[0].split("|");

          let viewsLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${tntaData}&mid=${mcId}&session-id=${el.analytics.payload["session-id"]}`
          if(conversion) {
            viewsLink = `https://${reportingServer}/b/ss/atetrifandemo/0/TA-1.0?pe=tnt&tnta=${tntaData},${revenueEvent[0]}|32767&mid=${mcId}&session-id=${el.analytics.payload["session-id"]}&events=${conversionEvent}=${conversionValue}`
          }
          fetch(viewsLink, {
            method: "GET",
            headers: {
              "Content-Type": "text/plain"
            },
            // Make sure to include credentials if needed, depending on Adobe's CORS policy
            credentials: "include" // or "same-origin" if running on the same domain
          })
        })
      });
    numberOfViews -= 1;
    if (numberOfViews === 0) {
      setModalVisible(false);
      clearInterval(interval);
    }
  }, 100);
}