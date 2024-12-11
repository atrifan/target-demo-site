import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const VariationsGrid = ({ handleSetToken, destination, previewToken, hide }: { handleSetToken: (token: string, index: number, variation: number) => void, destination: string, previewToken: string, hide?: boolean}) => {
  const variations = Array.from({ length: 8 }, (_, i) => i + 1); // Generate variations 1 to 8

  const [searchParams] = useSearchParams();
  return (
    <section style={{ marginTop: '20px', marginBottom: '40px', visibility: hide ? 'hidden' : 'visible'}}>
      <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Choose a Variation</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Adjusts column count based on available space
          gap: '15px', // Space between grid items
        }}
      >
        {variations.map((variation) => (
          <Link
            key={variation}
            to={{
              pathname: destination,
              search: new URLSearchParams({
                ...Object.fromEntries(searchParams.entries()), // Keep the existing search params
                at_preview_token: previewToken,
                at_preview_index: `1_${variation}`,
                at_preview_listed_activities_only: 'true',
                at_preview_evaluate_as_true_audience_ids: '3440621',
              }).toString(),
            }}
            style={{
              color: '#000',
              padding: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onClick={() => handleSetToken('ZkuLDeLZ6SdSR9RthgNI2osfdKGAJyg5DsJ3XxNj67A', 1, variation)}
          >
            Go to Variation {variation}
          </Link>
        ))}
      </div>
    </section>
  );

};

export default VariationsGrid;