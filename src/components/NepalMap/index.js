// @ts-check
import React, { useRef, useState } from 'react';
import districts from './districts.json';
import './nepalMap.css';

/**
 * Renders precomputed geometry in the initial HTML; only district details need JavaScript.
 * @param {{visitedDistricts?: {name: string, notes: string}[]}} props
 */
const NepalMap = ({ visitedDistricts = [] }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0, alignRight: false, alignUp: false });
  const wrapperRef = useRef(null);
  const visited = new Map(visitedDistricts.map((district) => [district.name.toLowerCase(), district]));
  const districtInfo = visited.get(hoveredDistrict.toLowerCase());

  const positionTooltip = (clientX, clientY) => {
    const wrapperBounds = wrapperRef.current?.getBoundingClientRect();
    if (!wrapperBounds) return;

    const x = clientX - wrapperBounds.left;
    const y = clientY - wrapperBounds.top;
    setTooltipPosition({
      left: x + (x > wrapperBounds.width / 2 ? -16 : 16),
      top: y + (y > wrapperBounds.height / 2 ? -16 : 16),
      alignRight: x > wrapperBounds.width / 2,
      alignUp: y > wrapperBounds.height / 2,
    });
  };

  return (
    <div className="nepal-map-container">
      <div className="nepal-map-wrapper" ref={wrapperRef}>
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
                  if (event.pointerType === 'mouse') {
                    setHoveredDistrict(name);
                    positionTooltip(event.clientX, event.clientY);
                  }
                }}
                onPointerMove={(event) => {
                  if (event.pointerType === 'mouse') positionTooltip(event.clientX, event.clientY);
                }}
                onPointerLeave={() => setHoveredDistrict('')}
                onFocus={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  setHoveredDistrict(name);
                  positionTooltip(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
                }}
                onBlur={() => setHoveredDistrict('')}
                onClick={(event) => {
                  setHoveredDistrict(name);
                  positionTooltip(event.clientX, event.clientY);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setHoveredDistrict(name);
                  } else if (event.key === 'Escape') {
                    setHoveredDistrict('');
                  }
                }}
              />
            );
          })}
        </svg>

        {hoveredDistrict && (
          <div
            className="nepal-map-tooltip"
            role="status"
            style={{
              left: tooltipPosition.left,
              top: tooltipPosition.top,
              transform: `translate(${tooltipPosition.alignRight ? '-100%' : '0'}, ${tooltipPosition.alignUp ? '-100%' : '0'})`,
            }}
          >
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
