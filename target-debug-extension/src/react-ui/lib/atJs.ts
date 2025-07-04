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

function injectScripts(scriptNames: string[], scriptIds: string[]): Promise<boolean>[] {
  const head = document.head || document.getElementsByTagName("head")[0];

  if (!head) {
    console.error("No <head> tag found. Cannot inject scripts.");
  }

  // Remove existing scripts if present
  document.querySelectorAll("script").forEach((script) => {
    if (script.src && scriptNames.some((name) => script.src.includes(name))) {
      console.log(`Removing existing script: ${script.src}`);
      script.remove();
    }
  });

  // Inject the other required scripts
  const loadedScripts: Promise<boolean>[] = [];
  scriptNames.forEach((name, idx) => {
    loadedScripts.push(new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL(`static/${name}`);
      script.async = false; // Ensures the script executes in order
      script.onload = () => resolve(true);
      script.id = scriptIds[idx];
      script.onerror = (error) => reject(name);
      console.log(`Injecting script: ${script.src}`);
      head.appendChild(script);
    }));
  });

  return loadedScripts;

}
const requestScriptInjection = (scriptNames: string[], scriptIds: string[], resolve: any, reject: any) => {

  const requestId = `request-${Date.now()}`; // Unique ID for matching responses

  // Listen for a response from content.js
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== window || event.data.type !== "INJECT_SCRIPT_RESPONSE") return;
    if (event.data.requestId === requestId) { // Ensure it's the correct response
      console.log(event);
      resolve(true);
      window.removeEventListener("message", handleMessage); // Clean up
    }
  };

  window.addEventListener("message", handleMessage);

  window.postMessage({ type: "INJECT_SCRIPT", scriptNames: scriptNames, scriptIds:  scriptIds, requestId}, "*");
};

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
    console.log(window.adobe.target);
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


      requestScriptInjection(["at.js", "mcid.js"], ["at-js", "mcjs"], resolve, reject);
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

export function getQueryParameter(param: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export const generateViewsWithConversions = (uniqueVisitors: boolean, number: string, setTotal: any, setCurrent: any, setModalVisible: any, reportingServer: string, profileData: ProfileData, mboxes: string[], tntA?: string, conversion: boolean = false,
                                             conversionEvent?: string, conversionValue: number = 1, algorithmId: number=-1000, isTarget = false, experienceIndex?: number): Promise<{[key: string]: number}> => {

  return new Promise((resolve, reject) => {
    if (number.length === 0) {
      return;
    }
    let numberOfViews = parseInt(number);
    setTotal(numberOfViews);
    setCurrent(numberOfViews)
    setModalVisible(true);
    let viewMap: {[key: string]: number} = {};
    const interval = setInterval(() => {
      //mboxSession generates a new user unique entry // TODO: set profile attributes
      //update visitorid
      //I don't care about this if not unique it will take current query params
      let mcId: any;
      if (uniqueVisitors) {
        mcId = `${generateToken(2)}-${generateToken(2)}`;
        updateQueryParams("MCID", mcId);
        updateQueryParams("PC", getNewCookiePCValue(generateToken()));
        updateQueryParams('mboxSession', generateToken());
      } else {
        mcId = getQueryParameter("MCID") || getMcId();
      }

      let parameters = {};

      if(window.extension_data.mboxParams) {
        parameters = window.extension_data.mboxParams
      }

      const mboxParams: any = mboxes.length > 0 ? mboxes.map((mboxName, idx) => {
        const element = document.getElementsByClassName(`mbox-name-${mboxName}`)[0];
        return JSON.parse(element.getAttribute('data-mboxparams') || '{}');
      }) : {}

      window.adobe.target?.getOffers({
        request: {
          property: {
            token: window.extension_data.atProperty,
          },
          id: {
            marketingCloudVisitorId: mcId,
          },
          experienceCloud: {
            analytics: {
              trackingServer: reportingServer || `${window.extension_data.tenant}.com.sc.omtrdc.net`,
              trackingServerSecure: reportingServer || `${window.extension_data.tenant}.com.ssl.sc.omtrdc.net`,
              logging: !isTarget ? "client_side" : "server_side"
            }
          },
          execute: {
            mboxes: mboxes.length > 0 ? mboxes.map((mboxName, idx) => {
              return {
                index: idx,
                name: mboxName,
                parameters: {
                  ...parameters,
                  ...mboxParams[idx]
                },
                profileParameters: {
                  "user.422": `${profileData.displayName}-${Date.now()}`,
                  "user.country": profileData.country,
                  "user.hobby": profileData.hobby,
                  "user.age": profileData.age,
                  "brand.bought": "offline",
                  ...window.extension_data.profileParameters
                }
              }
            }) : undefined,
            pageLoad: mboxes.length == 0 ? {
              parameters: {
                ...parameters
              },
              profileParameters: {
                "user.422": `${profileData.displayName}-${Date.now()}`,
                "user.country": profileData.country,
                "user.hobby": profileData.hobby,
                "user.age": profileData.age,
                "brand.bought": "offline",
                ...window.extension_data.profileParameters
              }
            } : undefined
          }
        }
      })
        .then(response => {
          console.log(response);

          //all my elements should be with data-mbox
          document.querySelectorAll('[data-mbox]').forEach(element => {
            const clone = element.cloneNode(true); // Clone the element
            element.parentNode?.replaceChild(clone, element); // Replace the original with the clone
          });
          document.querySelectorAll('[data-mbox]').forEach(element => {
            //reset it to the default
            element.innerHTML = "";
          });

          let okTargeted: Promise<boolean>[] = [];
          if (response.execute.mboxes) {
            const mboxes: any[] = response.execute.mboxes;
            //content is not removed in place if it's gone missing so than
            mboxes.forEach((el) => {
              window.adobe.target?.applyOffers({
                selector: `.mbox-name-${el.name}`,
                response: {
                  execute: {
                    mboxes: [el]
                  }
                }
              });
              okTargeted.push(isTarget? sendNotificationTarget(el, conversionEvent, conversion, profileData, experienceIndex, true, viewMap) : sendNotificationAnalytics(tntA, el, algorithmId, reportingServer, mcId, conversion, conversionEvent, conversionValue, experienceIndex, viewMap));
            })

          } else {
            window.adobe.target?.applyOffers({response: response});
            okTargeted.push(isTarget? sendNotificationTarget(response.execute.pageLoad, conversionEvent, conversion, profileData, experienceIndex, false, viewMap) : sendNotificationAnalytics(tntA, response.execute.pageLoad, algorithmId, reportingServer, mcId, conversion, conversionEvent, conversionValue, experienceIndex, viewMap));
          }

          Promise.all(okTargeted).then((okTargeted) => {
            const converted = okTargeted.filter((e) => e).length;
            if (experienceIndex != undefined && experienceIndex != -100 && converted > 0) {
              numberOfViews -= 1;
              setCurrent(numberOfViews);
            }
          });
        });
      if(experienceIndex == undefined || experienceIndex == -100) {
        numberOfViews -= 1;
        setCurrent(numberOfViews);
      }
      if (numberOfViews === -1) {
        setModalVisible(false);
        resolve(viewMap);
        clearInterval(interval);
      }
    }, 400);
  })
}

export function generateNotificationRequest(el: any, type: string, profileData?: ProfileData, useMbox: boolean = true) {
  const result = {
    id: generateToken(4),
    type: type,
    timestamp: Date.now(),
    mbox: useMbox ? {
      name: el.name,
      state: el.state
    } : undefined,
    tokens: el.metrics?.filter((e:any) => e.type === type).map((e:any) => e.eventToken),
    parameters: el.parameters,
    profileParameters: profileData ? {
      ...el.profileParameters,
      "user.422": `${profileData.displayName}-${Date.now()}`,
      "user.country": profileData.country,
      "user.hobby": profileData.hobby,
      "user.age": profileData.age,
      "brand.bought": "offline",
      ...window.extension_data.profileParameters
    }: undefined,
    order: el.order,
    product: el.product
  }

  if (result.tokens == undefined && type !== 'display') {
    return undefined;
  }
  return result;
}
export function sendNotificationTarget(el: any, event: string|undefined, conversion: boolean, profileData: ProfileData, experienceIndex?: number, useMbox: boolean = true,
                                       viewMap?: any): Promise<boolean>{
  // window.adobe.target?.sendNotifications({
  //     request: { notifications: [generateNotificationRequest(el, 'display', profileData)] }
  //   }
  // );

  if (!viewMap[el?.options?.[0]?.responseTokens["experience.id"]]) {
    viewMap[`${el?.options?.[0]?.responseTokens["experience.id"]}`] = 1;
  } else {
    viewMap[`${el?.options?.[0]?.responseTokens["experience.id"]}`] += 1;
  }

  return new Promise((resolve, reject) => {
    if(conversion && event && (el?.options?.[0]?.responseTokens["experience.id"] == experienceIndex ||
      (experienceIndex == -100 || experienceIndex == undefined))) {
      setTimeout(() => {
        const notifications = generateNotificationRequest(el, event, profileData, useMbox);
        if (notifications) {
          window.adobe.target?.sendNotifications({
              request: { notifications: [notifications] }
            }
          );
        }
        resolve(true);
      }, 100);
      return;
    } else if((el?.options?.[0]?.responseTokens["experience.id"] == experienceIndex ||
      (experienceIndex == -100 || experienceIndex == undefined))) {
      resolve(true);
      return;
    }

    resolve(false);
  })

}


export function sendNotificationAnalytics(tntA :string|undefined, el: any, algorithmId: number, reportingServer: string, mcId: string, conversion: boolean, conversionEvent: string|undefined, conversionValue: number, experienceIndex: number|undefined,
                                          viewMap: any): Promise<boolean> {
  // const mcId = getMcId();
  //don't use experienceindex for analytics not sure if it's needed
  if (!viewMap[el?.options?.[0]?.responseTokens["experience.id"]]) {
    viewMap[`${el?.options?.[0]?.responseTokens["experience.id"]}`] = 1;
  } else {
    viewMap[`${el?.options?.[0]?.responseTokens["experience.id"]}`] += 1;
  }

  return new Promise((resolve, reject) => {
    let tntaData = tntA? tntA : el.analytics.payload.tnta;
    console.log(tntA)
    //make targeted events
    tntaData = tntaData.split(',').map((event: string) => {
      //remove visits and unique visits and not conversion
      const eventBreakDown = event.split(':');
      //traffic type - targeted for AT
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

    let viewsLink = `https://${reportingServer}/b/ss/${window.extension_data.reportSuite || 'atetrifandemo' }/0/TA-1.0?pe=tnt&tnta=${tntaData}&mid=${mcId}&c.a.target.sessionid=${el.analytics.payload["session-id"]}`
    fetch(viewsLink, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain"
      },
      // Make sure to include credentials if needed, depending on Adobe's CORS policy
      credentials: "include" // or "same-origin" if running on the same domain
    }).finally(() => {
      if (!conversion && (el?.options?.[0]?.responseTokens["experience.id"] == experienceIndex ||
        (experienceIndex == -100 || experienceIndex == undefined))) {
        resolve(true);
        return;
      }

      if(conversion && conversionEvent && (el.options[0].responseTokens["experience.id"] == experienceIndex ||
        (experienceIndex == -100 || experienceIndex == undefined))) {
        viewsLink = `https://${reportingServer}/b/ss/${window.extension_data.reportSuite || 'atetrifandemo' }/0/TA-1.0?pe=tnt&tnta=${revenueEvent[0]}|32767,${revenueEvent[0]}|${conversionEvent?.replace("event","")}|${conversionValue}&mid=${mcId}&c.a.target.sessionid=${el.analytics.payload["session-id"]}&events=${conversionEvent}=${conversionValue}`
        setTimeout(()=>{
          fetch(viewsLink, {
            method: "GET",
            headers: {
              "Content-Type": "text/plain"
            },
            // Make sure to include credentials if needed, depending on Adobe's CORS policy
            credentials: "include" // or "same-origin" if running on the same domain
          })
          resolve(true);
        }, 100);
        return;
      }
      resolve(false);
    })
  });

}