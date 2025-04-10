// Listen for the message from content.ts
const extensionId = 'nninfhmoefimbadppcbgeffenjkakkja';


chrome.runtime.onInstalled.addListener(() => {
  console.log("🎉 Background script installed!");
  chrome.storage.local.set({ initialized: true });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'executeAdobeTargetScript') {
    console.log(message);
    const { tenant, org, analyticsReportingServer, reportSuite, mboxParams, environment, customEdgeHost, admin, profileParameters, atProperty } = message;

    // Get the tabId (you'll need to get it from the sender if necessary)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId !== undefined) {
        // Execute the script in the page’s main execution context
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          world: 'MAIN', // Runs in the page’s main execution context
          func: (tenant, org, analyticsReportingServer, reportSuite, extensionId, mboxParams, environment, customEdgeHost, admin, profileParameters, atProperty) => {
            let edgeHost = `${tenant}.tt.omtrdc.net`;
            if (environment === 'stage') {
              edgeHost = 'mboxedge1.tt-stage1.omtrdc.net';
            }

            if (customEdgeHost && customEdgeHost !== '') {
              edgeHost = customEdgeHost;
            }

            if ((window as any).adobe && (window as any).adobe.target) {
              (window as any).adobe.target.init(window, document, {
                clientCode: tenant,
                imsOrgId: org,
                serverDomain: edgeHost,
                trackingServer: analyticsReportingServer || `${tenant}.com.sc.omtrdc.net`,
                trackingServerSecure: analyticsReportingServer || `${tenant}.com.ssl.sc.omtrdc.net` ,
                crossDomain: 'disabled',
                timeout: 5000,
                globalMboxName: 'target-global-mbox',
                version: '2.11.5',
                defaultContentHiddenStyle: 'visibility: hidden;',
                defaultContentVisibleStyle: 'visibility: visible;',
                bodyHiddenStyle: 'body {opacity: 0 !important}',
                bodyHidingEnabled: true,
                deviceIdLifetime: 63244800000,
                sessionIdLifetime: 1860000,
                selectorsPollingTimeout: 5000,
                visitorApiTimeout: 2000,
                overrideMboxEdgeServer: false,
                overrideMboxEdgeServerTimeout: 1860000,
                optoutEnabled: false,
                optinEnabled: false,
                secureOnly: false,
                supplementalDataIdParamTimeout: 30,
                authoringScriptUrl: '//cdn.tt.omtrdc.net/cdn/target-vec.js',
                urlSizeLimit: 2048,
                endpoint: '/rest/v1/delivery',
                pageLoadEnabled: true,
                viewsEnabled: true,
                analyticsLogging: 'server_side',
                serverState: {},
                decisioningMethod: 'server-side',
                legacyBrowserSupport: false,
                allowHighEntropyClientHints: false,
                aepSandboxId: null,
                aepSandboxName: null,
              });
              (window as any).extension_data = {
                tenant,
                org,
                analyticsReportingServer,
                reportSuite,
                mboxParams,
                environment,
                edgeHost,
                admin,
                profileParameters,
                atProperty
              };

            } else {
              console.error('Adobe Target is not available on this page.');
            }
          },
          args: [tenant, org, analyticsReportingServer, reportSuite, extensionId, mboxParams, environment, customEdgeHost, admin, profileParameters, atProperty],
        }, (injectionResults) => {
          // Handle the results of the injected script
          const [result] = injectionResults;
          if (result && result.result) {
            sendResponse({ success: true, data: result.result });
          } else {
            sendResponse({ success: false, message: 'Script execution failed' });
          }
        });
      }
    });
  }
  return true;
});
