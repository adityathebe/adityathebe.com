// @ts-check
import React, { useRef, useState } from 'react';
import districts from './districts.json';
import './nepalMap.css';

/**
 * Renders precomputed geometry in the initial HTML; tooltips and mobile zoom need JavaScript.
 * @param {{visitedDistricts?: {name: string, notes: string}[]}} props
 */
const NepalMap = ({ visitedDistricts = [] }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState('');
  const [zoom, setZoom] = useState(1);
  const viewport = useRef(/** @type {HTMLDivElement | null} */ (null));
  const visited = new Map(visitedDistricts.map((district) => [district.name.toLowerCase(), district]));
  const districtInfo = visited.get(hoveredDistrict.toLowerCase());

  /** Keep the same map center while changing magnification; let the browser handle touch panning. */
  const changeZoom = (nextZoom) => {
    const element = viewport.current;
    if (!element) return;
    const left = ((element.scrollLeft + element.clientWidth / 2) / zoom) * nextZoom - element.clientWidth / 2;
    const top = ((element.scrollTop + element.clientHeight / 2) / zoom) * nextZoom - element.clientHeight / 2;
    setHoveredDistrict('');
    setZoom(nextZoom);
    requestAnimationFrame(() => element.scrollTo({ left, top, behavior: 'instant' }));
  };

  return (
    <div className="nepal-map-container">
      <div className="nepal-map-wrapper">
        <div className="nepal-map-controls" role="group" aria-label="Map zoom">
          <button type="button" aria-label="Zoom out" disabled={zoom === 1} onClick={() => changeZoom(zoom - 1)}>
            −
          </button>
          <button type="button" aria-label="Reset map zoom" disabled={zoom === 1} onClick={() => changeZoom(1)}>
            {zoom}×
          </button>
          <button type="button" aria-label="Zoom in" disabled={zoom === 4} onClick={() => changeZoom(zoom + 1)}>
            +
          </button>
        </div>
        <div className="nepal-map-viewport" ref={viewport}>
          <svg
            style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
            viewBox="0 0 1000 500"
            width="1000"
            height="500"
            role="group"
            aria-label="Nepal’s 77 districts"
          >
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
        </div>

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
