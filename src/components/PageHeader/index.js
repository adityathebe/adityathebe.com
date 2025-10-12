// @ts-check
import React from 'react';
import './index.css';

/**
 * @param {Object} props
 * @param {string} props.title - The main page title
 * @param {string} props.description - The page description/subtitle
 */
const PageHeader = ({ title, description }) => {
  return (
    <div className="home-header">
      <h1 className="home-title">{title}</h1>
      <p className="home-description">{description}</p>
    </div>
  );
};

export default PageHeader;
