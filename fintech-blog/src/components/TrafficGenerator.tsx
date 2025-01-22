import React, { useEffect, useRef, useState } from 'react';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';
import HitsModal from './HitsModal';

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
  algorithmId?: number;
  selectAlgorithm?: boolean;
  conversionEvent?: string;
  reportingServer?: string;
  isTarget: boolean;
  tntA?: string;
  mboxes: string[];
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
                                                                 algorithmId = undefined,
                                                                 selectAlgorithm = false,
                                                                 conversionEvent = undefined,
                                                                 reportingServer = '',
                                                                 tntA = undefined,
                                                                  isTarget,
                                                                 mboxes,
                                                                  multiplier = 0
                                                               }) => {
  const [uniqueVisitors, setUniqueVisitors] = useState(true);
  const [revenueValue, setRevenueValue] = useState(1);
  const [isTrafficModalVisible, setTrafficModalVisible] = useState(false);
  const [trafficData, setTrafficData] = useState<{[key:string]: number}>({})

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const algorithmDetails = [
    { id: 1, name: "touch_clarity", description: "Residual Variance", date: "2017-05-25 11:07:23", flag: 0 },
    { id: 2, name: "e_greedy_rf", description: "Random Forest", date: "2017-05-25 11:07:23", flag: 0 },
    { id: 3, name: "ltv", description: "Lifetime Value", date: "2017-05-25 11:07:23", flag: 0 },
    { id: 4, name: "thompson_sampling", description: "Thompson Sampling", date: "2017-05-25 11:07:23", flag: 0 },
    { id: 5, name: "tesla", description: "Tesla", date: "2017-05-25 11:07:23", flag: 0 },
    { id: 6, name: "darwin", description: "Darwin", date: "2017-05-25 11:07:23", flag: 0 },
    { id: 7, name: "urandom_visitor", description: "Uniform Random by Visitor", date: "2017-05-25 11:07:23", flag: 0 },
    { id: 8, name: "urandom_visit", description: "Uniform Random by Visit", date: "2019-03-12 23:08:37", flag: 0 },
    { id: 9, name: "urandom_visitor_coldstart", description: "Uniform Random by Visitor Cold Start", date: "2019-03-12 23:08:37", flag: 0 },
    { id: 10, name: "urandom_visit_coldstart", description: "Uniform Random by Visit Cold Start", date: "2019-03-12 23:08:37", flag: 0 },
    { id: 11, name: "custom_dsw", description: "BYOM Decision Stack", date: "2020-06-24 08:14:16", flag: 0 },
    { id: 12, name: "model_experiment", description: "Model Experimentation Decision Stack", date: "2020-10-22 12:11:08", flag: 0 },
  ];

  const generateViews = async (number: string) => {
    const stats = await generateViewsWithConversions(
      uniqueVisitors,
      number,
      setTotal,
      setCurrent,
      setModalVisible,
      reportingServer,
      { displayName, country, hobby, age },
      mboxes,
      tntA,
      false,
      conversionEvent,
      revenueValue,
      algorithmId,
      isTarget,
      experienceIndex + multiplier
    );
    setTrafficModalVisible(true);
    setTrafficData(stats);
  };

  const generateConversions = async (number: string) => {
    const stats = await generateViewsWithConversions(
      uniqueVisitors,
      number,
      setTotal,
      setCurrent,
      setModalVisible,
      reportingServer,
      { displayName, country, hobby, age },
      mboxes,
      tntA,
      true,
      conversionEvent,
      revenueValue,
      algorithmId,
      isTarget,
      experienceIndex + multiplier
    );
    setTrafficModalVisible(true);
    setTrafficData(stats);
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
    <div>
      {/* Unique Visitors Check */}
      <div style={{ marginTop: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={uniqueVisitors}
            onChange={() => setUniqueVisitors(!uniqueVisitors)}
            style={{ marginRight: '10px' }}
          />
          Unique Visitors
        </label>
      </div>

      {/* Generate Views without Conversions Section */}
      <div style={{ marginTop: '20px' }}>
        <h4>Generate Views without Conversions</h4>
        <input
          type="number"
          placeholder="Enter number of views"
          id="viewsWithoutConversions"
          style={{ marginRight: '10px', padding: '5px', width: '100px' }}
        />
        <button
          onClick={() => {
            const number = (
              document.getElementById('viewsWithoutConversions') as HTMLInputElement
            )?.value;
            generateViews(number);
          }}
          style={{ padding: '5px 10px' }}
        >
          Generate Views
        </button>
      </div>

      {/* Generate Views with Conversions Section */}
      <div style={{ marginTop: '20px' }}>
        <h4>Generate Views with Conversions</h4>
        <input
          type="number"
          placeholder="Enter number of views"
          id="viewsWithConversions"
          style={{ marginRight: '10px', padding: '5px', width: '100px' }}
        />
        <button
          onClick={() => {
            const number = (
              document.getElementById('viewsWithConversions') as HTMLInputElement
            )?.value;
            generateConversions(number);
          }}
          style={{ padding: '5px 10px' }}
        >
          Generate Views with Conversions
        </button>
        <span>
          for experience {experienceIndex === -100 ? 'All' : experienceIndex + 1}
        </span>
      </div>

      {/* Change Experience ID Section */}
      {showExperienceIndex && (
        <div style={{ marginTop: '20px' }}>
          <h4>Target Experience Conversions</h4>
          <input
            type="number"
            placeholder="Target experienceId"
            id="experienceId"
            style={{ marginRight: '10px', padding: '5px', width: '100px' }}
          />
          <button
            onClick={() => {
              const number = (
                document.getElementById('experienceId') as HTMLInputElement
              )?.value;
              changeExperienceId(number);
            }}
            style={{ padding: '5px 10px' }}
          >
            Save Targeted Experience
          </button>
        </div>
      )}

      {/* Change Algorithm ID Section */}
      {selectAlgorithm && (
        <div style={{ marginTop: '20px' }}>
          <h4>Change Algorithm Id</h4>
          <input
            type="number"
            placeholder="Change algorithmId"
            id="algorithmId"
            style={{ marginRight: '10px', padding: '5px', width: '100px' }}
          />
          <button
            onClick={() => {
              const number = (
                document.getElementById('algorithmId') as HTMLInputElement
              )?.value;
              changeAlgorithmId(number);
            }}
            style={{ padding: '5px 10px' }}
          >
            Save Algorithm ID
          </button>
          <span
            onClick={(event: React.MouseEvent) => {event.preventDefault(); event.stopPropagation(); setShowTooltip(!showTooltip)}}
            style={{
              marginLeft: '10px',
              width: '24px',
              height: '24px',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            ?
            {showTooltip && (
              <div
                ref={tooltipRef}
                style={{
                  position: 'absolute',
                  bottom: '40px', // Position above the question mark
                  left: '-120px',
                  width: '300px',
                  padding: '10px',
                  backgroundColor: '#333',
                  color: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  textAlign: 'left',
                  zIndex: 10,
                }}
              >
                <h5 style={{ margin: '0 0 10px' }}>Algorithm Details</h5>
                <ul style={{ padding: '0 10px', listStyle: 'none', margin: 0 }}>
                  {algorithmDetails.map((algo) => (
                    <li key={algo.id} style={{ marginBottom: '5px' }}>
                      <strong>{algo.id}</strong>, {algo.name}, {algo.description}, {algo.date}, {algo.flag}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: '10px solid #333',
                  }}
                />
              </div>
            )}
          </span>
        </div>
      )}

      {/* Select Revenue Value */}
      <div style={{ marginTop: '20px' }}>
        <h4>Set Revenue Value</h4>
        <input
          type="number"
          placeholder="Change revenue value"
          id="revenue"
          style={{ marginRight: '10px', padding: '5px', width: '100px' }}
        />
        <button
          onClick={() => {
            const number = (
              document.getElementById('revenue') as HTMLInputElement
            )?.value;
            setRevenueValue(number.length > 0 ? parseFloat(number) : 1);
          }}
          style={{ padding: '5px 10px' }}
        >
          Save Revenue Value
        </button>
      </div>

      <HitsModal
        data={trafficData}
        visible={isTrafficModalVisible}
        setVisible={setTrafficModalVisible}
      />
    </div>
  );
};

export default GeneratorComponent;
