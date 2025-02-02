import React, { useState } from "react";
import "./HitsModal.css"; // Optional: Add your styles here

interface ModalProps {
  data: {[key:string]: number}; // Key is experienceId, value is hits
  visible: boolean;
  testDuration: number;
  setVisible: (isVisible: boolean) => void;
}

const HitsModal: React.FC<ModalProps> = ({ data, visible, testDuration, setVisible }) => {
  const totalHits = Object.values(data).reduce((sum, hits) => sum + hits, 0);
  const rps = testDuration > 0 ? (totalHits / (testDuration / 1000)).toFixed(2) : "N/A";


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
        <p><strong>Test Duration:</strong> {testDuration} ms</p>
        <p><strong>Requests Per Second (RPS):</strong> {rps}</p>
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
