// @ts-check
import React from 'react';
import './contentTypeBadge.css';

/**
 * Badge component to display content type (e.g., journal, tutorial, etc.)
 * @param {Object} props
 * @param {string} props.type - The content type to display
 */
const ContentTypeBadge = ({ type }) => {
  return <span className={`content-type-badge content-type-badge--${type.toLowerCase()}`}>{type}</span>;
};

export default ContentTypeBadge;
