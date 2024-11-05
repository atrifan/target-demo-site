import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PersonalizationAT from './pages/PersonalizationAT';
import PersonalizationATXP from './pages/PersonalizedATXP';

const App: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [token, setToken] = useState('');
  const [activityIndex, setActivityIndex] = useState(0);
  const [experienceIndex, setExperienceIndex] = useState(0);
  const [trueAudienceId, setTrueAudienceId] = useState(0);
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
    <Router>
      <Header displayName={displayName} setDisplayName={setDisplayName} />
      <Routes>
        <Route path="/target-demo-site/personalization/at" element={<PersonalizationAT displayName={displayName} token={token} setToken={setToken} activityIndex={activityIndex}
                                                                                       setActivityIndex={setActivityIndex} experienceIndex={experienceIndex} setExperienceIndex={setExperienceIndex}
                                                                                       trueAudienceId={trueAudienceId} setTrueAudienceId={setTrueAudienceId}/>} />
        <Route path="/target-demo-site/personalization/at/xp" element={<PersonalizationATXP displayName={displayName} token={token} activityIndex={activityIndex}
                                                                experienceIndex={experienceIndex} trueAudienceId={trueAudienceId}/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;