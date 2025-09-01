import React, { useEffect, useRef, useState } from 'react';
import AtJs, { generateViewsWithConversions as generateViewsWithConversionsAtJs } from '../lib/atJs';
import { generateViewsWithConversions as generateViewsWithConversionsAlloy } from '../lib/alloyJs';
import HitsModal from './HitsModal';
import './TrafficGenerator.css';

interface GeneratorComponentProps {
  displayName: string;
  country: string;
  hobby: string;
  age: string;
  experienceIndex: number;
  setExperienceIndex?: React.Dispatch<React.SetStateAction<number>>;
  showExperienceIndex?: boolean;
  setAlgorithmId?: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTrafficModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTrafficModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTrafficData: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  setTestDuration: React.Dispatch<React.SetStateAction<number>>;
  algorithmId?: number;
  selectAlgorithm?: boolean;
  conversionEvent?: string;
  reportingServer?: string;
  isTarget: boolean;
  tntA?: string;
  mboxes: string;
  multiplier?: number;
}

const GeneratorComponent: React.FC<GeneratorComponentProps> = ({
                                                                 displayName,
                                                                 country,
                                                                 hobby,
                                                                 age,
                                                                 experienceIndex,
                                                                 setExperienceIndex = () => {},
                                                                 setAlgorithmId = () => {},
                                                                 showExperienceIndex = false,
                                                                 setTotal,
                                                                 setCurrent,
                                                                 setModalVisible,
                                                                 setTrafficModalOpen,
                                                                 algorithmId = undefined,
                                                                 selectAlgorithm = false,
                                                                 conversionEvent = undefined,
                                                                 reportingServer = '',
                                                                 tntA = undefined,
                                                                 isTarget,
                                                                 mboxes,
                                                                 multiplier = 0,
                                                                  setTrafficModalVisible,
                                                                  setTrafficData,
                                                                  setTestDuration
                                                               }) => {
  const [uniqueVisitors, setUniqueVisitors] = useState(true);
  const [revenueValue, setRevenueValue] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const [event, setEvent] = useState('click');  // Default to 'click'
  const [mboxesInput, setMboxesInput] = useState(mboxes);
  const [isTargetCheckbox, setIsTargetCheckbox] = useState(true);  // Default to true
  const [selectAlgorithmCheckbox, setSelectAlgorithmCheckbox] = useState(false);  // Default to false
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<number | undefined>(algorithmId);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Determine which generateViewsWithConversions to use based on SDK
  const generateViewsWithConversions = window.extension_data?.sdkType === 'websdk'
    ? generateViewsWithConversionsAlloy 
    : generateViewsWithConversionsAtJs;

  const algorithmDetails = [
    { id: 1, name: 'touch_clarity', description: 'Residual Variance', date: '2017-05-25 11:07:23', flag: 0 },
    { id: 2, name: 'e_greedy_rf', description: 'Random Forest', date: '2017-05-25 11:07:23', flag: 0 },
    { id: 3, name: 'ltv', description: 'Lifetime Value', date: '2017-05-25 11:07:23', flag: 0 },
    { id: 4, name: 'thompson_sampling', description: 'Thompson Sampling', date: '2017-05-25 11:07:23', flag: 0 },
    { id: 5, name: 'tesla', description: 'Tesla', date: '2017-05-25 11:07:23', flag: 0 },
    { id: 6, name: 'darwin', description: 'Darwin', date: '2017-05-25 11:07:23', flag: 0 },
    { id: 7, name: 'urandom_visitor', description: 'Uniform Random by Visitor', date: '2017-05-25 11:07:23', flag: 0 },
    { id: 8, name: 'urandom_visit', description: 'Uniform Random by Visit', date: '2019-03-12 23:08:37', flag: 0 },
    { id: 9, name: 'urandom_visitor_coldstart', description: 'Uniform Random by Visitor Cold Start', date: '2019-03-12 23:08:37', flag: 0 },
    { id: 10, name: 'urandom_visit_coldstart', description: 'Uniform Random by Visit Cold Start', date: '2019-03-12 23:08:37', flag: 0 },
    { id: 11, name: 'custom_dsw', description: 'BYOM Decision Stack', date: '2020-06-24 08:14:16', flag: 0 },
    { id: 12, name: 'model_experiment', description: 'Model Experimentation Decision Stack', date: '2020-10-22 12:11:08', flag: 0 },
  ];

  const generateViews = async (number: string) => {
    setTrafficModalOpen(false);
    const startTime = Date.now();
    const mboxesToSend = mboxesInput.length > 0 ? mboxesInput.split(',') : [];
    const stats = await generateViewsWithConversions(
      uniqueVisitors,
      number,
      setTotal,
      setCurrent,
      setModalVisible,
      reportingServer,
      { displayName, country, hobby, age },
      mboxesToSend,
      tntA,
      false,
      event,
      revenueValue,
      algorithmId,
      isTargetCheckbox,
      experienceIndex + multiplier
    );
    const endTime = Date.now();
    setTrafficModalVisible(true);
    setTrafficData(stats);
    setTestDuration(endTime - startTime);
  };

  const generateConversions = async (number: string) => {
    setTrafficModalOpen(false);
    const startTime = Date.now();
    const mboxesToSend = mboxesInput.length > 0 ? mboxesInput.split(',') : [];
    const stats = await generateViewsWithConversions(
      uniqueVisitors,
      number,
      setTotal,
      setCurrent,
      setModalVisible,
      reportingServer,
      { displayName, country, hobby, age },
      mboxesToSend,
      tntA,
      true,
      event,
      revenueValue,
      algorithmId,
      isTargetCheckbox,
      experienceIndex + multiplier
    );
    const endTime = Date.now();
    setTrafficModalVisible(true);
    setTrafficData(stats);
    setTestDuration(endTime - startTime);
  };

  const changeExperienceId = (number: string) => {
    if (number.length === 0) {
      setExperienceIndex(-100);
      return;
    }
    setExperienceIndex(parseInt(number) - 1);
  };

  const changeAlgorithmId = (number: string) => {
    if (number.length === 0) {
      return;
    }
    setAlgorithmId(parseInt(number));
  };

  const handleAlgorithmChange = (value: string) => {
    if (value === '') {
      setSelectedAlgorithmId(undefined);
      if (setAlgorithmId) {
        setAlgorithmId(-1); // Use -1 or another default value instead of undefined
      }
    } else {
      const id = parseInt(value);
      setSelectedAlgorithmId(id);
      if (setAlgorithmId) {
        setAlgorithmId(id);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTooltip]);

  return (
    <div className="profile-modal">
        <div className="profile-modal-content">
          <button onClick={() => setTrafficModalOpen(false)} className="close-button">Close</button>
          {/* Event Input */}

          {/* Unique Visitors Checkbox */}
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={uniqueVisitors}
                onChange={() => setUniqueVisitors(!uniqueVisitors)}
              />
              Unique Visitors
            </label>
          </div>

          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={isTargetCheckbox}
                onChange={() => setIsTargetCheckbox(!isTargetCheckbox)}
              />
              Is Target Reporting
            </label>
          </div>

          {/* Generate Views without Conversions Section */}
          <div className="section">
            <h4>Generate Views without Conversions</h4>
            <input type="number" placeholder="Enter number of views" id="viewsWithoutConversions"/>
            <button
              onClick={() => {
                const number = (document.getElementById('viewsWithoutConversions') as HTMLInputElement)?.value;
                generateViews(number);
              }}
            >
              Generate Views
            </button>
          </div>

          {/* Generate Views with Conversions Section */}
          <div className="section">
            <h4>Generate Views with Conversions</h4>
            <input type="number" placeholder="Enter number of views" id="viewsWithConversions"/>
            <button
              onClick={() => {
                const number = (document.getElementById('viewsWithConversions') as HTMLInputElement)?.value;
                generateConversions(number);
              }}
            >
              Generate Views with Conversions
            </button>
            <span>
              for experience {experienceIndex === -100 ? 'All' : experienceIndex + 1}
            </span>
          </div>

          {/* Change Experience ID Section */}
          {showExperienceIndex && (
            <div className="section">
              <h4>Target Experience Conversions</h4>
              <input type="number" placeholder="Target experienceId" id="experienceId"/>
              <button
                onClick={() => {
                  const number = (document.getElementById('experienceId') as HTMLInputElement)?.value;
                  changeExperienceId(number);
                }}
              >
                Save Targeted Experience
              </button>
            </div>
          )}

          {/* Change Algorithm ID Section */}
          {selectAlgorithm && (
            <div className="section">
              <h4>Change Algorithm Id</h4>
              <select 
                value={selectedAlgorithmId || ''} 
                onChange={(e) => handleAlgorithmChange(e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '200px' }}
              >
                <option value="">None (Default)</option>
                {algorithmDetails.map((algo) => (
                  <option key={algo.id} value={algo.id}>
                    {algo.id} - {algo.name} ({algo.description})
                  </option>
                ))}
              </select>
              <span>or enter custom ID:</span>
              <input 
                type="number" 
                placeholder="Custom algorithm ID" 
                id="algorithmId"
                style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
              />
              <button
                onClick={() => {
                  const number = (document.getElementById('algorithmId') as HTMLInputElement)?.value;
                  if (number) {
                    const id = parseInt(number);
                    setSelectedAlgorithmId(id);
                    setAlgorithmId(id);
                  }
                }}
                style={{ marginLeft: '10px', padding: '5px 10px' }}
              >
                Set Custom ID
              </button>
            </div>
          )}

          <div className="section">
            <h4>Event</h4>
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="Enter event (default: click)"
            />
          </div>

          {/* Mboxes Input */}
          <div className="section">
            <h4>Mboxes (comma separated)</h4>
            <input
              type="text"
              value={mboxesInput}
              onChange={(e) => setMboxesInput(e.target.value)}
              placeholder="Enter mboxes"
            />
          </div>

          {/* Select Revenue Value */}
          <div className="section">
            <h4>Set Revenue Value</h4>
            <input type="number" placeholder="Change revenue value" id="revenue"/>
            <button
              onClick={() => {
                const number = (document.getElementById('revenue') as HTMLInputElement)?.value;
                setRevenueValue(number.length > 0 ? parseFloat(number) : 1);
              }}
            >
              Save Revenue Value
            </button>
          </div>
        </div>
    </div>
  );
};

export default GeneratorComponent;
