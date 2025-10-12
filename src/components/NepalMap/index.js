// @ts-check
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import './nepalMap.css';

const geoUrl = '/nepal-districts.json';

/**
 * @param {{visitedDistricts?: {name: string,  notes: string}[]}} props
 */
const NepalMap = ({ visitedDistricts = [] }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState(/** @type {{name: string, info: any} | null} */ (null));

  const isVisited = (districtName) => {
    if (!districtName) return false;
    return visitedDistricts.some((visited) => visited.name.toLowerCase() === districtName.toLowerCase());
  };

  const getDistrictInfo = (districtName) => {
    if (!districtName) return null;
    return visitedDistricts.find((visited) => visited.name.toLowerCase() === districtName.toLowerCase());
  };

  return (
    <div className="nepal-map-container">
      <div className="nepal-map-wrapper" style={{ height: '100%' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 4000 : 6500,
            center: [84.2, 28.4],
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              if (!geographies || geographies.length === 0) {
                return (
                  <text x="50%" y="50%" textAnchor="middle" fill="#6b7280">
                    Loading...
                  </text>
                );
              }

              return geographies.map((geo) => {
                const districtName =
                  geo.properties.DIST_EN || geo.properties.DISTRICT || geo.properties.NAME || geo.properties.name;
                const visited = isVisited(districtName);
                const districtInfo = getDistrictInfo(districtName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setHoveredDistrict({ name: districtName, info: districtInfo });
                    }}
                    onMouseLeave={() => {
                      setHoveredDistrict(null);
                    }}
                    style={{
                      default: {
                        fill: visited ? 'var(--primary-color)' : 'var(--nord2)',
                        stroke: 'var(--secondary-text-color)',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: visited ? 'var(--primary-color)' : 'var(--nord3)',
                        stroke: 'var(--secondary-text-color)',
                        strokeWidth: 1,
                        outline: 'none',
                        opacity: 0.8,
                      },
                      pressed: {
                        fill: visited ? 'var(--primary-color)' : 'var(--nord1)',
                        stroke: 'var(--secondary-text-color)',
                        strokeWidth: 1,
                        outline: 'none',
                        opacity: 0.7,
                      },
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ComposableMap>

        {hoveredDistrict && (
          <div className="nepal-map-tooltip">
            <h3>{hoveredDistrict.name}</h3>
            {hoveredDistrict.info ? (
              <div>
                {hoveredDistrict.info.notes && <p className="nepal-map-tooltip-notes">{hoveredDistrict.info.notes}</p>}
              </div>
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
