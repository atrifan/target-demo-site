import React, { useState } from "react";
import "./HitsModal.css"; // Optional: Add your styles here

interface ModalProps {
  data: {[key:string]: number}; // Key is experienceId, value is hits
  visible: boolean;
  setVisible: (isVisible: boolean) => void;
}

const HitsModal: React.FC<ModalProps> = ({ data, visible, setVisible }) => {
  const totalHits = Object.values(data).reduce((sum, hits) => sum + hits, 0);

  const closeModal = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          ×
        </button>
        <h2>Traffic Report</h2>
        <p><strong>Total Hits:</strong> {totalHits}</p>
        <ul>
          {Object.entries(data).map(([experienceId, hits]) => (
            <li key={experienceId}>
              <strong>{experienceId}</strong>: {hits} hits (
              {((hits / totalHits) * 100).toFixed(2)}%)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HitsModal;
