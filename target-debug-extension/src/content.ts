chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INIT_EXTENSION') {
    console.log(message);
    const { tenant, org, analyticsReportingServer, analyticsReportSuite } = message;

    // Ensure the data is available
    if (!tenant || !org) {
      console.error('Missing required extension data');
      return;
    }

    // Initialize Adobe Target or other logic here
    const scriptNames = ["at.js", "mcid.js"];
    const scriptIds = ["at-js", "mcjs"];
    const loadedScripts = injectScripts(scriptNames, scriptIds);


    Promise.all(loadedScripts)
      .then(() => {
        console.log("All scripts loaded successfully");
        console.log((window as any).adobe);

        // Send a message to background.ts with the required parameters
        chrome.runtime.sendMessage({
          action: 'executeAdobeTargetScript',
          tenant: tenant,
          org: org,
          analyticsReportingServer: analyticsReportingServer,
          reportSuite: analyticsReportSuite,
        }, (response) => {
          console.log(`Response from background.ts: ${response}`);
          const scriptNames = ["AppMeasurement.js"];
          const scriptIds = ["app-measurement"];
          const loadedScripts = injectScripts(scriptNames, scriptIds);
          Promise.all(loadedScripts).then(() => {
            const rootElement = document.createElement('div');
            rootElement.id = 'react-root';  // Give it a unique ID so you can target it

// Apply CSS to make the root element cover the full viewport and sit on top
            rootElement.style.position = 'absolute';
            rootElement.style.pointerEvents = 'auto';
            rootElement.style.top = '0';
            rootElement.style.left = '0';
            rootElement.style.width = '100vw';
            rootElement.style.height = '100vh';
            rootElement.style.zIndex = '999';  // Ensure it is on top of everything else

            document.body.appendChild(rootElement);
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL('dist/content.bundle.js');
            script.onload = () => {
              console.log('React app injected successfully.');
              // Optionally, send a message back to confirm
              sendResponse({ success: true });
            };
            script.onerror = () => {
              console.error('Error injecting the React app.');
              sendResponse({ success: false });
            };
            document.body.appendChild(script);
          });
        });
        // Initialize adobe.target with received data
      })
      .catch((err) => {
        console.error(`Failed to load all scripts: ${err}`);
      });
    // Once all scripts are loaded, initialize adobe.target
  }

  return true;
});

// content.ts

let mboxName: string = "";  // Variable to store the mboxName

// Listen for the message from the extension to set the mboxName
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ADD_MBOX' && message.mboxName) {
    mboxName = message.mboxName;  // Set the mboxName from the received message
    console.log(`MboxName set to: ${mboxName}`);
  }
});

// Add a click event listener to the document to capture click events
document.addEventListener('click', (event) => {
  if (mboxName) {
    event.preventDefault();
    event.stopPropagation();
    const mboxDiv = document.createElement('div');
    mboxDiv.setAttribute('mbox-name', mboxName);
    mboxDiv.className = `mbox-name-${mboxName}`;
    mboxDiv.style.position = 'absolute';
    mboxDiv.style.top = `${event.clientY}px`;
    mboxDiv.style.left = `${event.clientX}px`;
    mboxDiv.style.padding = '10px';
    mboxDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    mboxDiv.style.border = '1px solid #ccc';
    mboxDiv.style.zIndex = '400';
    mboxDiv.innerText = `MboxName: ${mboxName}`;

    // Append the div to the body
    document.body.appendChild(mboxDiv);
    mboxName = "";  // Reset the mboxName
  }
});


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


window.addEventListener("message", (event) => {
  // Ensure the message comes from the same page
  if (event.source !== window) return;

  if (event.data.type === "INJECT_SCRIPT" && event.data.scriptNames) {
    console.log(`Received message to inject scripts: ${event.data.scriptNames}`);
    const requestId = event.data.requestId;
    Promise.all(injectScripts(event.data.scriptNames, event.data.scriptIds)).then(() => {
      window.postMessage({ type: "INJECT_SCRIPT_RESPONSE", requestId, status: "Script Loaded" }, "*");
    }).catch((err) => {
      window.postMessage({ type: "INJECT_SCRIPT_RESPONSE", requestId, status: "Script Load Failed" }, "*");
    });
  }
});