// @ts-check
import React from 'react';
import { Link } from 'gatsby';
import './contentTypeBadge.css';

/**
 * Badge component to display content type (e.g., journal, tutorial, etc.)
 * @param {Object} props
 * @param {string} props.type - The content type to display
 * @param {string} [props.to] - Optional link destination
 */
const ContentTypeBadge = ({ type, to }) => {
  const className = `content-type-badge content-type-badge--${type.toLowerCase()}`;

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
