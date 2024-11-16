import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PersonalizationAT from './pages/PersonalizationAT';
import PersonalizationATXP from './pages/PersonalizedATXP';
import { PersonaProvider, usePersona } from './components/Persona';
import PersonalizationAAA4T from './pages/PersonalizationAAA4T';
import PersonalizationAAA4TXP from './pages/PersonalizationAAA4TXP';
import PersonalizationAAXP from './pages/PersonalizationAAXP';
import PersonalizationAA from './pages/PersonalizationAA';
import PersonalizationATA4TXP from './pages/PersonalizedATA4TXP';
import PersonalizationATA4T from './pages/PersonalizationATA4T';
import { generateToken, getNewCookiePCValue, updateQueryParam } from './lib/atJs';
import ABManual from './pages/ABManual';
import ABManualXP from './pages/ABManualXP';
import PersonalizationAP from './pages/PersonalizationAP';
import PersonalizationAPXP from './pages/PersonalizationAPXP';

const App: React.FC = () => {
  const [token, setToken] = useState('');
  const [tntA, setTntA] = useState('');
  const [activityIndex, setActivityIndex] = useState(0);
  const [experienceIndex, setExperienceIndex] = useState(0);
  const [trueAudienceId, setTrueAudienceId] = useState(0);
  const [reportingServer, setReportingServer] = useState('adobetargeteng.d1.sc.omtrdc.net');
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [hobby, setHobby] = useState('');
  const [age, setAge] = useState('');
  const [mcId, setMcId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePersonaSave = () => {
    // Increment the refresh key to trigger re-render
    updateQueryParam('mboxSession', generateToken());
    //new tntId
    updateQueryParam("PC", getNewCookiePCValue(generateToken()));
    //new mcid
    setMcId(generateToken());
    setRefreshKey(prevKey => prevKey + 1);
  };
  useEffect(() => {
    // Check if the Adobe Target library is loaded
    // if (window.adobe && window.adobe.target) {
    //   window.adobe.target.init();
    // }
    window.targetGlobalSettings = {
      clientCode: "bullseye",
      imsOrgId: "011B56B451AE49A90A490D4D@AdobeOrg"
    }
  }, []);
  return (
    <PersonaProvider>
      <Router basename="/target-demo-site">
        <Header refreshOnSave={handlePersonaSave}/>
        <Routes>
          <Route
            path="/target-demo-site/personalization/aa/a4t"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationAAA4T
                    displayName={displayName}
                    token={token}
                    setToken={setToken}
                    activityIndex={activityIndex}
                    setActivityIndex={setActivityIndex}
                    experienceIndex={experienceIndex}
                    setExperienceIndex={setExperienceIndex}
                    trueAudienceId={trueAudienceId}
                    setTrueAudienceId={setTrueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    reportingServer={reportingServer}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />
          <Route
            path="/target-demo-site/personalization/aa/a4t/xp"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationAAA4TXP
                    displayName={displayName}
                    token={token}
                    activityIndex={activityIndex}
                    experienceIndex={experienceIndex}
                    trueAudienceId={trueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    reportingServer={reportingServer}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />

          <Route
            path="/target-demo-site/personalization/at/a4t"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationATA4T
                    displayName={displayName}
                    token={token}
                    setToken={setToken}
                    activityIndex={activityIndex}
                    setActivityIndex={setActivityIndex}
                    experienceIndex={experienceIndex}
                    setExperienceIndex={setExperienceIndex}
                    trueAudienceId={trueAudienceId}
                    setTrueAudienceId={setTrueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    reportingServer={reportingServer}
                    setTntA={setTntA}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />
          <Route
            path="/target-demo-site/personalization/at/a4t/xp"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationATA4TXP
                    displayName={displayName}
                    token={token}
                    activityIndex={activityIndex}
                    experienceIndex={experienceIndex}
                    trueAudienceId={trueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    reportingServer={reportingServer}
                    tntA={tntA}
                    setTntA={setTntA}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />

          <Route
            path="/target-demo-site/personalization/aa"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationAA
                    displayName={displayName}
                    token={token}
                    setToken={setToken}
                    activityIndex={activityIndex}
                    setActivityIndex={setActivityIndex}
                    experienceIndex={experienceIndex}
                    setExperienceIndex={setExperienceIndex}
                    trueAudienceId={trueAudienceId}
                    setTrueAudienceId={setTrueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />
          <Route
            path="/target-demo-site/personalization/aa/xp"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationAAXP
                    displayName={displayName}
                    token={token}
                    activityIndex={activityIndex}
                    experienceIndex={experienceIndex}
                    trueAudienceId={trueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />

          <Route
            path="/target-demo-site/personalization/ap"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationAP
                    displayName={displayName}
                    token={token}
                    setToken={setToken}
                    activityIndex={activityIndex}
                    setActivityIndex={setActivityIndex}
                    experienceIndex={experienceIndex}
                    setExperienceIndex={setExperienceIndex}
                    trueAudienceId={trueAudienceId}
                    setTrueAudienceId={setTrueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />
          <Route
            path="/target-demo-site/personalization/ap/xp"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationAPXP
                    displayName={displayName}
                    token={token}
                    activityIndex={activityIndex}
                    experienceIndex={experienceIndex}
                    trueAudienceId={trueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />


          <Route
            path="/target-demo-site/personalization/at"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationAT
                    displayName={displayName}
                    token={token}
                    setToken={setToken}
                    activityIndex={activityIndex}
                    setActivityIndex={setActivityIndex}
                    experienceIndex={experienceIndex}
                    setExperienceIndex={setExperienceIndex}
                    trueAudienceId={trueAudienceId}
                    setTrueAudienceId={setTrueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />
          <Route
            path="/target-demo-site/personalization/at/xp"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <PersonalizationATXP
                    displayName={displayName}
                    token={token}
                    activityIndex={activityIndex}
                    experienceIndex={experienceIndex}
                    trueAudienceId={trueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />

          <Route
            path="/target-demo-site/ab"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <ABManual
                    displayName={displayName}
                    token={token}
                    setToken={setToken}
                    activityIndex={activityIndex}
                    setActivityIndex={setActivityIndex}
                    experienceIndex={experienceIndex}
                    setExperienceIndex={setExperienceIndex}
                    trueAudienceId={trueAudienceId}
                    setTrueAudienceId={setTrueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />
          <Route
            path="/target-demo-site/ab/xp"
            element={
              <PersonaConsumer>
                {({ displayName, country, hobby, age }) => (
                  <ABManualXP
                    displayName={displayName}
                    token={token}
                    setToken={setToken}
                    activityIndex={activityIndex}
                    setActivityIndex={setActivityIndex}
                    experienceIndex={experienceIndex}
                    setExperienceIndex={setExperienceIndex}
                    trueAudienceId={trueAudienceId}
                    setTrueAudienceId={setTrueAudienceId}
                    country={country}
                    hobby={hobby}
                    age={age}
                    refreshKey={refreshKey}
                    mcId={mcId}
                  />
                )}
              </PersonaConsumer>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </PersonaProvider>
  );

}

const PersonaConsumer: React.FC<{ children: (value: any) => React.ReactNode }> = ({ children }) => {
  const persona = usePersona(); // Hook to access persona context
  return <>{children(persona)}</>; // Pass persona context to children
};

export default App;