// @ts-check
import React from 'react';
import { Link } from 'gatsby';
import './contentTypeBadge.css';

/**
 * Badge component to display content type (e.g., journal, bitesize, etc.)
 * @param {Object} props
 * @param {string} props.type - The content type to display
 */
const ContentTypeBadge = ({ type }) => {
  const className = `content-type-badge content-type-badge--${type.toLowerCase()}`;

  // Define routes for content types
  const routes = {
    journal: '/journal',
    bitesize: '/bitesize',
    til: '/til',
  };

  const to = routes[type.toLowerCase()];

  if (to) {
    return (
      <Link to={to} className={className}>
        {type}
      </Link>
    );
  }

  return <span className={className}>{type}</span>;
};

export default ContentTypeBadge;
