// alloyjs.ts

import getMcId from './visitor';
import Cookies from 'js-cookie';

// ── UTILITIES ────────────────────────────────────────────────────────────────

export const clearAllCookies = () => {
  document.cookie.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  localStorage.clear();
  sessionStorage.clear();
};

export function updateQueryParams(key: string, value?: string) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  if (value) params.set(key, value);
  else params.delete(key);
  window.history.pushState({}, '', `${url.pathname}?${params.toString()}`);
}

export function generateToken(length: number = 32): string {
  const digits: string[] = [];
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);

  // Ensure the first digit is never '0'
  digits.push(((array[0] % 9) + 1).toString()); // Map byte to 1-9 to avoid 0 as the first digit

  for (let i = 1; i < length; i++) {
    digits.push((array[i] % 10).toString()); // Map byte to 0–9
  }

  return digits.join('');
}


function injectScripts(names: string[], ids: string[]): Promise<boolean[]> {
  const head = document.head!;
  // remove old
  document.querySelectorAll('script').forEach(s => {
    if (s.src && names.some(n => s.src.includes(n))) s.remove();
  });
  // inject new
  return Promise.all(names.map((name, i) => new Promise<boolean>((res, rej) => {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(`static/${name}`);
    s.async = false;
    s.id = ids[i];
    s.onload  = () => res(true);
    s.onerror = () => rej(`Failed to load ${name}`);
    head.appendChild(s);
  })));
}

// ── CORE INIT ───────────────────────────────────────────────────────────────

const requestScriptInjection = (scriptNames: string[], scriptIds: string[], resolve: any, reject: any) => {

  const requestId = `request-${Date.now()}`; // Unique ID for matching responses

  // Listen for a response from content.js
  const handleMessage = (event: MessageEvent) => {
    if (event.source !== window || event.data.type !== "INJECT_SCRIPT_RESPONSE") return;
    if (event.data.requestId === requestId) { // Ensure it's the correct response
      console.log(event);
    if (window.extension_data.sdkType === "websdk" && (window as any).alloy) {

      window.alloy("configure", {
        datastreamId: window.extension_data.dataStreamId,
        orgId: window.extension_data.org,
        debugEnabled: true, // Enable debugging as before
        // thirdPartyCookiesEnabled: false, // Keep cookies enabled
        // idMigrationEnabled: true, // Enable ID migration
        // targetMigrationEnabled: true, // Enable target migration
        // personalizationStorageEnabled: true, // Enable personalization storage (same as Reactor version)
        // autoCollectPropositionInteractions: {
        //   AJO: "always", // Auto-collect AJO propositions
        //   TGT: "always" // Do not auto-collect TGT propositions
        // },
        // context: [
        //   "web",
        //   "device",
        //   "environment",
        //   "placeContext"
        // ],
        // clickCollectionEnabled: true, // Keep click collection disabled (or enable it based on need)
        // clickCollection: {
        //   internalLinkEnabled: true,
        //   externalLinkEnabled: true,
        //   downloadLinkEnabled: true,
        //   sessionStorageEnabled: true,
        //   eventGroupingEnabled: false
        // },
        // downloadLinkQualifier: "\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$",
        // edgeDomain: "edge.adobedc.net",
        // edgeBasePath: "ee",
        edgeConfigOverrides: {
          com_adobe_target: {
            propertyToken: window.extension_data.atProperty // Override Target Property Token
          }
        },
      }).then((configureData: any) => {
        console.log("Alloy.js configured successfully:", configureData);
        resolve(true);
      });

    }
      window.removeEventListener("message", handleMessage); // Clean up
    }
  };

  window.addEventListener("message", handleMessage);

  window.postMessage({ type: "INJECT_SCRIPT", scriptNames: scriptNames, scriptIds:  scriptIds, requestId}, "*");
};

export default async function AlloyJs(initParams?: () => any): Promise<void> {
  // reset any previous state
  window.targetPageParams = initParams || (() => ({}));

  if (window.alloy) {
    window.alloy = undefined;
    clearAllCookies();
  }

  // reset any leftover mbox DOM state
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
    if (!window.alloy) {
      //get script element from head with id at-js
      const oldScript = document.getElementById("alloy-js");
      const oldEnforceAlloy = document.getElementById("enforce-alloy");
      const mcjs = document.getElementById("mcjs");

      const oldScriptAt = document.getElementById("at-js");
      const oldAppServiceAt = document.getElementById("app-service");
      //if oldScript is present than delete it
      if (oldScriptAt) {
        oldScriptAt.remove();
      }
      if (oldAppServiceAt) {
        oldAppServiceAt.remove();
      }
      if (mcjs) {
        mcjs.remove();
      }

      //if oldScript is present than delete it
      if (oldScript) {
        oldScript.remove();
      }
      if (oldEnforceAlloy) {
        oldEnforceAlloy.remove();
      }
      if (mcjs) {
        mcjs.remove();
      }


      const scriptNames = ['enforce_alloy.js','alloy.js','mcid.js'];
      const scriptIds   = ['enforce-alloy','alloy-js','mcjs'];

      requestScriptInjection(scriptNames, scriptIds, resolve, reject);
    }
  })

}

// ── PROFILE & QUERY HELPERS ─────────────────────────────────────────────────

export interface ProfileData {
  displayName: string;
  country:     string;
  hobby:       string;
  age:         string;
}

export function getNewCookiePCValue(newPC: string): string {
  const mboxCookie = Cookies.get('mbox') || '';
  const parts = mboxCookie.split('|');
  for (const p of parts) {
    if (p.startsWith('PC#')) {
      const version = p.split('#')[1].split('.')[1];
      return `${newPC}.${version}`;
    }
  }
  return `${newPC}.37_0`;
}

export function getQueryParameter(param: string): string | null {
  return new URLSearchParams(window.location.search).get(param);
}

// ── DRIVE VIEWS + CONVERSIONS ────────────────────────────────────────────────

export const generateViewsWithConversions = async (
  uniqueVisitors: boolean,
  countStr: string,
  setTotal: (n: number) => void,
  setCurrent: (n: number) => void,
  setModalVisible: (v: boolean) => void,
  reportingServer: string,
  profileData: ProfileData,
  mboxes: string[],
  tntA?: string,
  conversion = false,
  conversionEvent?: string,
  conversionValue = 1,
  algorithmId = -1000,
  isTarget = false,
  experienceIndex?: number
): Promise<Record<string,number>> => {
  let total = parseInt(countStr, 10);
  setTotal(total);
  setCurrent(total);
  setModalVisible(true);

  const viewMap: Record<string,number> = {};
  let remaining = total;

  const loop = async () => {
    // manage MCID/PC/mboxSession
    let mcid: string;
    if (uniqueVisitors) {
      mcid = `${generateToken(38)}`;
      updateQueryParams('MCID', mcid);
      updateQueryParams('PC', getNewCookiePCValue(generateToken()));
      updateQueryParams('mboxSession', generateToken());
    } else {
      mcid = getQueryParameter('MCID') || getMcId();
    }

    // build XDM envelope
    const xdmProfile = {
      'user.422': `${profileData.displayName}-${Date.now()}`,
      'user.country': profileData.country,
      'user.hobby': profileData.hobby,
      'user.age': profileData.age,
      'brand.bought': 'offline',
      ...window.extension_data.profileParameters
    };

    let parameters = {};

    if(window.extension_data.mboxParams) {
      parameters = window.extension_data.mboxParams
    }

    // sendEvent → get propositions

    const mboxParams: any = mboxes.length > 0 ? mboxes.map((mboxName, idx) => {
      const element = document.getElementsByClassName(`mbox-name-${mboxName}`)[0];
      return JSON.parse(element.getAttribute('data-mboxparams') || '{}');
    }) : {}

    const resp = await window.alloy!('sendEvent', {
      renderDecisions: true,
      decisionScopes: mboxes.length > 0 ? mboxes : ["__view__"],
      xdm: {
        profile: xdmProfile,
        identityMap: {
          ECID: [{ id: mcid, authenticatedState: "ambiguous" }]
        }
      },
      data: {
        __adobe: {
          target: {
            parameters: parameters,
            profileParameters: xdmProfile,
            mboxes: mboxes.map((name, index) => ({
              id: index,
              name,
              parameters: {
                ...parameters,
                ...(mboxParams[index] || {})
              }
            }))
          }
        }
      }
    });

    console.log(`### the response is ${JSON.stringify(resp, null, 2)}`);

    // apply personalization to page
    //await window.alloy!('applyPropositions', { propositions: resp.propositions });
    resp.propositions.forEach((proposition: any) => {
      // Extract the scope and the content
      const { scope, items } = proposition;

      // Loop through all items in the proposition
      items.forEach((item: any) => {
        // Get the content data from the item
        const content = item.data.content;

        // Find elements with the class "mbox-name-${scope}"
        const targetElements = document.querySelectorAll(`.mbox-name-${scope}`);

        // Loop through all matching elements and set their innerHTML
        targetElements.forEach(element => {
          element.innerHTML = content;
        });
      });
    });

    // track views + optionally notify analytics/target
    const promises: Promise<boolean>[] = [];
    for (const dec of resp.propositions || []) {
      const scope = dec.scope;
      viewMap[scope] = (viewMap[scope]||0) + 1;

      if (conversion && conversionEvent) {
        promises.push(window.alloy!('sendEvent', {
          decisionScopes: [],
          renderDecisions: true,
          xdm: {
            _experience: {
              decisioning: {
                propositions: [dec],
                propositionEventType: { interact: 1 }
              }
            },
            commerce: { order: { priceTotal: conversionValue } }
          }
        }).then(() => true).catch(() => false));
      } else {
        promises.push(Promise.resolve(true));
      }
    }

    await Promise.all(promises);

    // update remaining & UI
    if (experienceIndex != null && experienceIndex !== -100) {
      remaining--;
    } else {
      remaining--;
    }
    setCurrent(remaining);

    if (remaining <= 0) {
      setModalVisible(false);
      return viewMap;
    }

    // schedule next iteration
    return new Promise<Record<string,number>>(res => {
      setTimeout(async () => res(await loop()), 400);
    });
  };

  return loop();
};

export async function getAndApplyOffers(deliveryRequest: any, mcIdToUse: string, addCampaignId: (id: string) => void): Promise<void> {
  if (!window.alloy) {
    console.error("Alloy.js not initialized.");
    return;
  }

  window.alloy("sendEvent", {
    decisionScopes: [
      ...deliveryRequest.decisionScopes,
      ...(window.extension_data.decisionScopes.length > 0 ? window.extension_data.decisionScopes.split(",") : []),
    ],
    xdm: {
      eventType: "web.webpagedetails.pageViews",
      identityMap: {
        ECID: [{ id: mcIdToUse, authenticatedState: "ambiguous" }]
      },
      ...deliveryRequest.xdm
    },
    data: {
      ...deliveryRequest.data
    },
    renderDecisions: true
  }).then((result: any) => {
    console.log(`### the result is ${JSON.stringify(result, null, 2)}`);
    // Apply propositions to the page for mboxes
    result.propositions.forEach((proposition: any) => {
      // Extract the scope and the content
      const { scope, items } = proposition;

      // Loop through all items in the proposition
      items.forEach((item: any) => {
        // Get the content data from the item
        const content = item.data.content;

        // Find elements with the class "mbox-name-${scope}"
        const targetElements = document.querySelectorAll(`.mbox-name-${scope}`);

        // Loop through all matching elements and set their innerHTML
        targetElements.forEach(element => {
          element.innerHTML = content;
        });
      });
    });

    // await window.alloy("applyPropositions", { propositions: result.propositions });
    const decisions = result?.decisions || [];
    decisions.forEach((decision: any) => {
      const activityId = decision.items?.[0]?.data?.activity?.id;
      if (activityId) {
        addCampaignId(activityId);
      }
    });
  }).catch((err: any) => {
    console.error("Alloy.js sendEvent failed:", err);
  });

}
