// @ts-check
import React from 'react';
import './tv.css';

/**
 * Renders a list of TV shows.
 * @param {{ shows: Array<{
 *   title: string;
 *   url: string;
 *   star: number;
 *   date: string;
 *   review: string;
 * }> }} props
 * @returns {JSX.Element}
 */
export const ShowList = ({ shows }) => {
  shows.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }

    return -1;
  });
  
  return (
    <ul className="tv-watch-history">
      {shows.map((show) => (
        <TVShow key={show.title} show={show} />
      ))}
    </ul>
  );
};

/**
 * Renders a single TV show review.
 * @param {{ show: {
 *   title: string;
 *   url: string;
 *   star: number;
 *   date: string;
 *   review: string;
 * }}} props
 * @returns {JSX.Element}
 */
export const TVShow = ({ show }) => {
  return (
    <li className="tv-show">
      <div className="tv-show-content">
        <div className="tv-show-info">
          <h3 className="tv-show-title">
            <a href={show.url} target="_blank" rel="noopener noreferrer">
              {show.title}
            </a>
          </h3>
          <div className="tv-show-date">{new Date(show.date).toLocaleDateString()}</div>
          <div className="tv-show-rating" aria-label={`Rating: ${show.star} out of 5 stars`}>
            {renderStars(show.star)}
          </div>
        </div>
        <div className="tv-show-review">
          <p>{show.review}</p>
        </div>
      </div>
    </li>
  );
};

/**
 * Renders star icons based on the count.
 * @param {number} count - Number of stars.
 * @returns {JSX.Element}
 */
const renderStars = (count) => {
  const validCount = Math.max(0, Math.min(count, 5)); // Ensure count is between 0 and 5
  return <span>{'★'.repeat(validCount) + '☆'.repeat(5 - validCount)}</span>;
};
