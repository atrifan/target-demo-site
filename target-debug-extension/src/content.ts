const head = document.head || document.getElementsByTagName("head")[0];

if (!head) {
  console.error("No <head> tag found. Cannot inject scripts.");
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INIT_EXTENSION') {
    console.log(message);
    const { tenant, org, analyticsReportingServer, analyticsReportSuite, mboxParams, environment, customEdgeHost, admin, profileParameters, atProperty } = message;

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
        console.log("PROFILE: ", profileParameters);
        chrome.runtime.sendMessage({
          action: 'executeAdobeTargetScript',
          tenant: tenant,
          org: org,
          analyticsReportingServer: analyticsReportingServer,
          reportSuite: analyticsReportSuite,
          mboxParams: mboxParams,
          environment: environment,
          customEdgeHost: customEdgeHost,
          admin: admin,
          profileParameters: profileParameters,
          atProperty: atProperty
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

let lastHoveredElement: any = null;
let inModal = false;

document.addEventListener("mouseover", (event) => {
  if (!mboxName || inModal) return;

  if (lastHoveredElement) {
    lastHoveredElement.style.outline = ""; // Reset previous element
  }

  lastHoveredElement = event.target;
  lastHoveredElement.style.outline = "2px solid red"; // Highlight element
});

// Add a click event listener to the document to capture click events
// Handle click to open modal and process mbox assignment
document.addEventListener("click", (event) => {
  if (!mboxName) return;
  inModal = true;

  event.preventDefault();
  event.stopImmediatePropagation();

  const targetElement = lastHoveredElement || event.target;

  // Remove outline to prevent further visual changes
  targetElement.style.outline = "";

  // Check if modal already exists
  let existingModal = document.getElementById("jsonInputModal");
  if (existingModal) return;

  // Create the modal
  const modal = document.createElement("div");
  modal.id = "jsonInputModal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.padding = "20px";
  modal.style.backgroundColor = "white";
  modal.style.border = "1px solid #ccc";
  modal.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  modal.style.zIndex = "1000";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";

  // Modal title
  const title = document.createElement("h3");
  title.innerText = "Parameters";
  modal.appendChild(title);

  // JSON input textarea
  const textarea = document.createElement("textarea");
  textarea.style.width = "300px";
  textarea.style.height = "100px";
  textarea.placeholder = "Enter JSON parameters here...";
  textarea.value = "{}";
  modal.appendChild(textarea);

  // Save button (styled as a red div)
  const saveButton = document.createElement("div");
  saveButton.innerText = "Save";
  saveButton.style.marginTop = "10px";
  saveButton.style.padding = "10px 20px";
  saveButton.style.backgroundColor = "red";
  saveButton.style.color = "white";
  saveButton.style.cursor = "pointer";
  saveButton.style.textAlign = "center";
  saveButton.style.borderRadius = "5px";
  saveButton.style.width = "80px";

  modal.appendChild(saveButton);

  // Append modal to body
  document.body.appendChild(modal);

  // Prevent click propagation inside modal
  modal.addEventListener("click", (e) => e.stopPropagation());

  // Save button click handler
  saveButton.addEventListener("click", () => {
    let jsonParams = {};
    try {
      jsonParams = JSON.parse(textarea.value);
    } catch (e) {
      alert("Invalid JSON");
      return;
    }

    // Remove modal from DOM
    document.body.removeChild(modal);

    // Update the target element
    targetElement.setAttribute("mbox-name", mboxName);
    targetElement.setAttribute("data-mboxparams", JSON.stringify(jsonParams));

    // Append or update class with mbox-name-{mboxName}
    const classToAdd = `mbox-name-${mboxName}`;

    if (targetElement.className) {
      // If class attribute exists, append the new class if not already present
      if (!targetElement.classList.contains(classToAdd)) {
        targetElement.classList.add(classToAdd);
      }
    } else {
      // If class attribute does not exist, create it with the new value
      targetElement.setAttribute("class", classToAdd);
    }

    targetElement.style.outline = "2px solid red"

    // Reset mboxName so the process can be repeated
    mboxName = '';
    inModal = false;
  });
});


function injectScripts(scriptNames: string[], scriptIds: string[]): Promise<boolean>[] {
  const head = document.head || document.getElementsByTagName("head")[0];

  if (!head) {
    console.error("No <head> tag found. Cannot inject scripts.");
  }

  // Remove existing scripts if present
  document.querySelectorAll("script").forEach((script) => {
    // if (script.src && script.src.includes('launch')) {
    //   console.log(`Removing existing script: ${script.src}`);
    //   script.remove();
    // }
    // if (script.src && script.src.includes('bizible')) {
    //   console.log(`Removing existing script: ${script.src}`);
    //   script.remove();
    // }
    // if (script.src && script.src.includes('adobetm')) {
    //   console.log(`Removing existing script: ${script.src}`);
    //   script.remove();
    // }
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