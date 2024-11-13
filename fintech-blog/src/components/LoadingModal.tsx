import React, { useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner'; // Example spinner, can be replaced with your own

interface LoadingModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Loading, please wait...</h3>
        <TailSpin height="80" width="80" color="grey" />
      </div>
    </div>
  );
};

export default LoadingModal;
