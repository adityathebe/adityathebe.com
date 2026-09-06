// @ts-check
import React, { useState } from 'react';
import districts from './districts.json';
import './nepalMap.css';

/**
 * Renders precomputed geometry in the initial HTML; only district tooltips need JavaScript.
 * @param {{visitedDistricts?: {name: string, notes: string}[]}} props
 */
const NepalMap = ({ visitedDistricts = [] }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState('');
  const visited = new Map(visitedDistricts.map((district) => [district.name.toLowerCase(), district]));
  const districtInfo = visited.get(hoveredDistrict.toLowerCase());

  return (
    <div className="nepal-map-container">
      <div className="nepal-map-wrapper">
        <svg viewBox="0 0 1000 500" width="1000" height="500" role="group" aria-label="Nepal’s 77 districts">
          {districts.map(({ name, path }) => {
            const info = visited.get(name.toLowerCase());
            return (
              <path
                key={name}
                d={path}
                className={`nepal-map-district${info ? ' visited' : ''}${hoveredDistrict === name ? ' active' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${name} — ${info ? 'Visited' : 'Not visited yet'}`}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setHoveredDistrict(name);
                }}
                onPointerLeave={() => setHoveredDistrict('')}
                onFocus={() => setHoveredDistrict(name)}
                onBlur={() => setHoveredDistrict('')}
                onClick={() => setHoveredDistrict(name)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setHoveredDistrict(name);
                  } else if (event.key === 'Escape') {
                    setHoveredDistrict('');
                  }
                }}
              >
                <title>
                  {name} — {info ? `Visited${info.notes ? `: ${info.notes}` : ''}` : 'Not visited yet'}
                </title>
              </path>
            );
          })}
        </svg>

        {hoveredDistrict && (
          <div className="nepal-map-tooltip" role="status">
            <h3>{hoveredDistrict}</h3>
            {districtInfo ? (
              districtInfo.notes && <p className="nepal-map-tooltip-notes">{districtInfo.notes}</p>
            ) : (
              <p className="not-visited-status">Not visited yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NepalMap;
