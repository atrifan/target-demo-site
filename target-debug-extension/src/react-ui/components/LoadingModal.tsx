import React, { useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner'; // Example spinner, can be replaced with your own

interface LoadingModalProps {
  isVisible: boolean;
  onClose: () => void;
  total: number; // Total value for progress calculation
  current: number; // Current value to track progress
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isVisible, onClose, total, current }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress percentage
    const percentage = ((total - current) / total) * 100;
    setProgress(percentage);
  }, [current, total]);

  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Loading, please wait...</h3>
        <TailSpin height="25" width="25" color="white" />
        <div className="progress-bar-container" style={{ marginTop: '20px', width: '100%' }}>
          <div
            className="progress-bar"
            style={{
              height: '20px',
              width: `${progress}%`,
              backgroundColor: 'blue',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <p>{Math.round(progress)}% Complete</p>
      </div>
    </div>
  );
};

export default LoadingModal;
