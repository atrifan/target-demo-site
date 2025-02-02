import React, { useState, useEffect } from 'react';
import './UtilityFloater.css';
import axios from 'axios';
import TrafficGenerator from './TrafficGenerator';
import LoadingModal from './LoadingModal';
import HitsModal from './HitsModal'; // Import the TrafficGenerator component

interface UtilityFloaterProps {
  handlePersonaSave: () => void;
  mcId: string;
  tntId: string;
  displayName: string;
  country: string;
  hobby: string;
  age: string;
  experienceIndex: number;
  setExperienceIndex: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UtilityFloater: React.FC<UtilityFloaterProps> = ({
                                                         handlePersonaSave,
                                                         mcId,
                                                         tntId,
                                                         displayName,
                                                         country,
                                                         hobby,
                                                         age,
                                                         experienceIndex,
                                                         setExperienceIndex,
                                                         setTotal,
                                                         setCurrent,
                                                         setModalVisible,
                                                       }) => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isTrafficModalOpen, setTrafficModalOpen] = useState(false); // State for Traffic Modal
  const [profileData, setProfileData] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  const [event, setEvent] = useState('click'); // Default event is click
  const [isTrafficModalVisible, setTrafficModalVisible] = useState(false);
  const [trafficData, setTrafficData] = useState<{ [key: string]: number }>({});
  const [testDuration, setTestDuration] = useState(0);
  const [mboxes, setMboxes] = useState(''); // Default mbox
  const [isTarget, setIsTarget] = useState(true); // Default checkbox value
  const [isAlgorithm, setIsAlgorithm] = useState(false); // Default checkbox value
  const [selectAlgorithm, setSelectAlgorithm] = useState(false); // Default selectAlgorithm value
  const [algorithmId, setAlgorithmId] = useState<number>(1); // Default to empty string to handle unset state
  const [reportingServer, setReportingServer] = useState<string | undefined>(window.extension_data?.analyticsReportingServer || null);

  // Function to extract mboxes from DOM
  const extractMboxesFromDOM = () => {
    const mboxElements = document.querySelectorAll('[mbox-name]');
    const mboxValues = Array.from(mboxElements).map((element) => element.getAttribute('mbox-name'));
    console.log("mboxes: ",mboxValues);
    setMboxes(mboxValues.join(',')); // Join them into a string
  };

  useEffect(() => {
    // Extract mboxes on component mount
  }, [mcId, tntId]);

  const openProfileModal = async () => {
    setProfileModalOpen((prevState) => !prevState);
    setLoading(true);
    try {
      // Fetch profile data from a remote endpoint
      const lambdaUrl =
        "https://xmw3bsgzoi.execute-api.us-west-2.amazonaws.com/default/zeusUtil";

      try {
        let response = await axios.get(`${lambdaUrl}?token=true&admin=admin3&client=bullseye&mcId=${mcId}&tntId=${tntId}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: false,
        });
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching models from Lambda:", error);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setProfileData({ error: 'Failed to fetch profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const openTrafficModal = () => {
    extractMboxesFromDOM();
    setTrafficModalOpen((prevState) => !prevState);
  };

  const closeProfileModal = () => setProfileModalOpen(false);
  const closeTrafficModal = () => setTrafficModalOpen(false); // Function to close Traffic Modal

  return (
    <>
      {/* Refresh Button */}
      <div className="floating-refresh-button" onClick={handlePersonaSave}>
        <img
          src="https://cdn-icons-png.freepik.com/256/10152/10152078.png?semt=ais_hybrid"
          alt="Refresh"
        />
      </div>

      {/* Profile Button */}
      <div className="floating-profile-button" onClick={openProfileModal}>
        <img
          src="https://cdn-icons-png.freepik.com/256/847/847969.png"
          alt="Profile"
        />
      </div>

      {/* Traffic Generator Button */}
      <div className="floating-traffic-button" onClick={openTrafficModal}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/17076/17076762.png" // Replace with your own traffic icon
          alt="Traffic Generator"
        />
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <h3>User Profile</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <pre className="json-block">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            )}
            <button onClick={closeProfileModal} className="close-button">Close</button>
          </div>
        </div>
      )}

      {/* Traffic Modal */}
      {isTrafficModalOpen && (
        <div className="traffic-modal">
          <div className="traffic-modal-content">
            <TrafficGenerator
              displayName={displayName}
              country={country}
              hobby={hobby}
              age={age}
              experienceIndex={experienceIndex}
              setExperienceIndex={setExperienceIndex}
              showExperienceIndex={true}
              isTarget={isTarget}
              conversionEvent={event}
              setTotal={setTotal}
              setCurrent={setCurrent}
              setModalVisible={setModalVisible}
              setTrafficModalOpen={setTrafficModalOpen}
              mboxes={mboxes}
              algorithmId={algorithmId}
              setAlgorithmId={setAlgorithmId} selectAlgorithm={true}
              reportingServer={reportingServer}
              setTrafficData={setTrafficData}
              setTestDuration={setTestDuration}
              setTrafficModalVisible={setTrafficModalVisible}
            />
          </div>
        </div>
      )}

      <HitsModal
        data={trafficData}
        testDuration={testDuration}
        visible={isTrafficModalVisible}
        setVisible={setTrafficModalVisible}
      />
    </>
  );
};

export default UtilityFloater;
