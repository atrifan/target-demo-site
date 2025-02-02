import React, { useState, useEffect } from 'react';

const STORAGE_KEY = "target-debug-extension";

const App: React.FC = () => {
  const [tenant, setTenant] = useState<string>("");
  const [analyticsReportSuite, setAnalyticsReportSuite] = useState<string>("");
  const [org, setOrg] = useState<string>("");
  const [analyticsReportingServer, setAnalyticsReportingServer] = useState<string>("");
  const [mboxName, setMboxName] = useState<string>("");

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
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Save values to localStorage whenever they change
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tenant,
      org,
      analyticsReportingServer,
      analyticsReportSuite
    }));
  }, [tenant, org, analyticsReportingServer, analyticsReportSuite]);

  const handleStartDebugging = (): void => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'INIT_EXTENSION',
          tenant,
          org,
          analyticsReportingServer,
          analyticsReportSuite
        });
      }
    });
  };

  const handleAddMboxName = (): void => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'ADD_MBOX',
          mboxName
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
      <br />
      <label>
        Org:
        <input
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="Enter Org ID"
        />
      </label>
      <br />
      <label>
        Analytics Reporting Server:
        <input
          type="text"
          value={analyticsReportingServer}
          onChange={(e) => setAnalyticsReportingServer(e.target.value)}
          placeholder="Enter Reporting Server"
        />
      </label>
      <br />
      <label>
        Analytics Report Suite:
        <input
          type="text"
          value={analyticsReportSuite}
          onChange={(e) => setAnalyticsReportSuite(e.target.value)}
          placeholder="Enter Report Suite"
        />
      </label>
      <br />
      <label>
        MboxName:
        <input
          type="text"
          value={mboxName}
          onChange={(e) => setMboxName(e.target.value)}
          placeholder="Enter MboxName"
        />
      </label>
      <br />
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
