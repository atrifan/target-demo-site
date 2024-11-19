import React, { useState } from 'react';
import AtJs, { generateViewsWithConversions } from '../lib/atJs';

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
                                                               }) => {
  const [uniqueVisitors, setUniqueVisitors] = useState(true);
  const [revenueValue, setRevenueValue] = useState(1);

  const generateViews = (number: string) => {
    generateViewsWithConversions(
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
      experienceIndex
    );
  };

  const generateConversions = (number: string) => {
    generateViewsWithConversions(
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
      experienceIndex
    );
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
    </div>
);
};

export default GeneratorComponent;
