import React, { useState } from 'react';
import './UtilityFloater.css';
import TrafficGenerator from './TrafficGenerator';
import HitsModal from './HitsModal';
import ProfileModal from './ProfileModal';
import ProductUtil from './ProductUtil';

interface UtilityFloaterProps {
  handlePersonaSave: (providedMcId?: string, providedTntId?: string) => void;
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
  const [isTrafficModalOpen, setTrafficModalOpen] = useState(false);
  const [isProductUtilOpen, setProductUtilOpen] = useState(false);
  const [trafficData, setTrafficData] = useState<{ [key: string]: number }>({});
  const [testDuration, setTestDuration] = useState(0);
  const [mboxes, setMboxes] = useState('');
  const [isTrafficModalVisible, setTrafficModalVisible] = useState(false);
  const [algorithmId, setAlgorithmId] = useState<number>(1);
  const [reportingServer, setReportingServer] = useState<string | undefined>(window.extension_data?.analyticsReportingServer || null);

  const extractMboxesFromDOM = () => {
    const mboxElements = document.querySelectorAll('[mbox-name]');
    const mboxValues = Array.from(mboxElements).map((element) => element.getAttribute('mbox-name'));
    setMboxes(mboxValues.join(','));
  };

  const openTrafficModal = () => {
    extractMboxesFromDOM();
    setTrafficModalOpen((prevState) => !prevState);
  };

  const openProductUtil = () => {
    extractMboxesFromDOM();
    setProductUtilOpen((prevState) => !prevState);
  }

  return (
    <>
      {/* Refresh Button */}
      <div className="floating-refresh-button" onClick={() => handlePersonaSave()}>
        <img src="https://cdn-icons-png.freepik.com/256/10152/10152078.png?semt=ais_hybrid" alt="Refresh" />
      </div>

      {/* Profile Button */}
      <div className="floating-profile-button" onClick={() => setProfileModalOpen(true)}>
        <img src="https://cdn-icons-png.freepik.com/256/847/847969.png" alt="Profile" />
      </div>

      {/* Traffic Generator Button */}
      <div className="floating-traffic-button" onClick={openTrafficModal}>
        <img src="https://cdn-icons-png.flaticon.com/512/17076/17076762.png" alt="Traffic Generator" />
      </div>

      {/* Product Utility Button */}
      <div className="floating-product-button" onClick={openProductUtil}>
        <img src="https://cdn-icons-png.freepik.com/256/12783/12783710.png?semt=ais_hybrid" alt="Product Util" />
      </div>

      {/* Profile Modal */}
      <ProfileModal
        mcId={mcId}
        tntId={tntId}
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        handlePersonaSave={handlePersonaSave}
      />

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
              isTarget={true}
              conversionEvent="click"
              setTotal={setTotal}
              setCurrent={setCurrent}
              setModalVisible={setModalVisible}
              setTrafficModalOpen={setTrafficModalOpen}
              mboxes={mboxes}
              algorithmId={algorithmId}
              setAlgorithmId={setAlgorithmId}
              selectAlgorithm={true}
              reportingServer={reportingServer}
              setTrafficData={setTrafficData}
              setTestDuration={setTestDuration}
              setTrafficModalVisible={setTrafficModalVisible}
            />
          </div>
        </div>
      )}

      {/* Product Utility Modal */}
      {isProductUtilOpen && (
        <ProductUtil
          mcId={mcId}
          tntId={tntId}
          isOpen={isProductUtilOpen}
          onClose={() => setProductUtilOpen(false)}
          mboxes={mboxes}
        />
      )}

      {/* Hits Modal */}
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
