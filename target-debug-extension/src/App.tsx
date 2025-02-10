import React, { useState, useEffect } from "react";

const STORAGE_KEY = "target-debug-extension";

const App: React.FC = () => {
  const [tenant, setTenant] = useState<string>("");
  const [analyticsReportSuite, setAnalyticsReportSuite] = useState<string>("");
  const [org, setOrg] = useState<string>("");
  const [analyticsReportingServer, setAnalyticsReportingServer] = useState<string>("");
  const [mboxName, setMboxName] = useState<string>("");
  const [admin, setAdmin] = useState<string>("");
  const [mboxParams, setMboxParams] = useState<string>("{}"); // JSON parameters input
  const [environment, setEnvironment] = useState<string>("prod"); // Default to prod
  const [customEdgeHost, setCustomEdgeHost] = useState<string>(""); // State for custom edge host

  useEffect(() => {
    // Load saved values from localStorage
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTenant(parsedData.tenant || "");
        setOrg(parsedData.org || "");
        setAnalyticsReportingServer(parsedData.analyticsReportingServer || "");
        setAnalyticsReportSuite(parsedData.analyticsReportSuite || "");
        setEnvironment(parsedData.environment || "prod"); // Default to prod
        setCustomEdgeHost(parsedData.customEdgeHost || ""); // Load customEdgeHost from storage
        // Ensure mboxParams is always a valid JSON string
        setMboxParams(
          parsedData.mboxParams ? JSON.stringify(parsedData.mboxParams, null, 2) : "{}"
        );
        setAdmin(parsedData.admin || "");
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        localStorage.removeItem(STORAGE_KEY); // Clear corrupted storage
      }
    }
  }, []);

  useEffect(() => {
    try {
      // Ensure mboxParams is valid before saving
      const parsedParams = JSON.parse(mboxParams);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          tenant,
          org,
          analyticsReportingServer,
          analyticsReportSuite,
          environment,
          mboxParams: parsedParams,
          customEdgeHost, // Save customEdgeHost to localStorage
          admin
        })
      );
    } catch (error) {
      console.error("Invalid JSON in mboxParams, not saving:", error);
    }
  }, [tenant, org, analyticsReportingServer, analyticsReportSuite, environment, mboxParams, customEdgeHost, admin]);

  const handleStartDebugging = (): void => {
    try {
      const parsedParams = JSON.parse(mboxParams); // Validate JSON
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id !== undefined) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "INIT_EXTENSION",
            tenant,
            org,
            analyticsReportingServer,
            analyticsReportSuite,
            environment, // Include environment in the payload
            mboxParams: parsedParams, // Send parsed JSON params
            customEdgeHost, // Send customEdgeHost to content script
            admin
          });
        }
      });
    } catch (error) {
      console.error("Invalid JSON in mboxParams:", error);
      alert("Invalid JSON in JSON Parameters. Please fix it before debugging.");
    }
  };

  const handleAddMboxName = (): void => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "ADD_MBOX",
          mboxName,
        });
      }
    });
  };

  const isStartDebuggingDisabled = !(tenant && org);

  return (
    <div className="App">
      <h1>Target Debug Extension</h1>
      <label>
        Tenant:
        <input
          type="text"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
          placeholder="Enter Tenant ID"
        />
      </label>
      <br/>
      <label>
        Org:
        <input
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="Enter Org ID"
        />
      </label>
      <br/>
      <label>
        Analytics Reporting Server:
        <input
          type="text"
          value={analyticsReportingServer}
          onChange={(e) => setAnalyticsReportingServer(e.target.value)}
          placeholder="Enter Reporting Server"
        />
      </label>
      <br/>
      <label>
        Analytics Report Suite:
        <input
          type="text"
          value={analyticsReportSuite}
          onChange={(e) => setAnalyticsReportSuite(e.target.value)}
          placeholder="Enter Report Suite"
        />
      </label>
      <br/>
      <label>
        Environment:
        <select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
          <option value="prod">Production</option>
          <option value="stage">Staging</option>
        </select>
      </label>
      <label>
        Admin:
        <input
          type="text"
          value={admin}
          onChange={(e) => setAdmin(e.target.value)}
          placeholder="Enter Admin"
        />
      </label>
      <br/>
      <label>
        MboxName:
        <input
          type="text"
          value={mboxName}
          onChange={(e) => setMboxName(e.target.value)}
          placeholder="Enter MboxName"
        />
      </label>
      <br/>
      <label>
        JSON Parameters:
        <textarea
          value={mboxParams}
          onChange={(e) => setMboxParams(e.target.value)}
          placeholder="Enter JSON Parameters"
          style={{ width: "100px", height: "100px" }}
        />
      </label>
      <br/>
      <label>
        Custom Edge Host:
        <input
          type="text"
          value={customEdgeHost}
          onChange={(e) => setCustomEdgeHost(e.target.value)}
          placeholder="Enter Custom Edge Host"
        />
      </label>
      <br/>
      <button onClick={handleStartDebugging} disabled={isStartDebuggingDisabled}>
        Start Debugging
      </button>
      <button onClick={handleAddMboxName} disabled={!mboxName}>
        Add MboxName
      </button>
    </div>
  );
};

export default App;
