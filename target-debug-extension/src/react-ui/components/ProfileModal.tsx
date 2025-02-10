import React, { useState } from 'react';
import axios from 'axios';

interface ProfileModalProps {
  mcId: string;
  tntId: string;
  handlePersonaSave: (providedMcId?: string, providedTntId?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ mcId, tntId, isOpen, onClose, handlePersonaSave }) => {
  const [profileData, setProfileData] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputMcId, setInputMcId] = useState(mcId);
  const [inputTntId, setInputTntId] = useState(tntId);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const lambdaUrl = "https://xmw3bsgzoi.execute-api.us-west-2.amazonaws.com/default/zeusUtil";
      const admin = window.extension_data.admin || "admin3";
      const tenant = window.extension_data.tenant || "bullseye";
      const response = await axios.get(`${lambdaUrl}?token=true&admin=${admin}&client=${tenant}&mcId=${mcId}&tntId=${tntId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: false,
      });
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfileData({ error: "Failed to fetch profile data." });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchProfileData();
    }
  }, [isOpen, mcId, tntId]);

  if (!isOpen) return null;

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        <h3>User Profile</h3>
        McId: <input type="text" value={inputMcId} onChange={(e) => setInputMcId(e.target.value)} placeholder="Enter mcId" />
        TntId: <input type="text" value={inputTntId} onChange={(e) => setInputTntId(e.target.value)} placeholder="Enter tntId" />
        <button onClick={() => { handlePersonaSave(inputMcId, inputTntId); fetchProfileData(); }}>
          Impersonate
        </button>
        {loading ? <p>Loading...</p> : <pre className="json-block">{JSON.stringify(profileData, null, 2)}</pre>}
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default ProfileModal;
