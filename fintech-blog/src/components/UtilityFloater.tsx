import React, { useState, useEffect } from 'react';
import './UtilityFloater.css';
import axios from 'axios';

interface UtilityFloaterProps {
  handlePersonaSave: () => void;
  mcId: string;
  tntId: string;
}

const UtilityFloater: React.FC<UtilityFloaterProps> = ({ handlePersonaSave, mcId, tntId }) => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  const openProfileModal = async () => {
    setProfileModalOpen(true);
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

  const closeProfileModal = () => setProfileModalOpen(false);

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
    </>
  );
};

export default UtilityFloater;
