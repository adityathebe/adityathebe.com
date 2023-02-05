import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { formatReadingTime, formatPostDate } from '../utils/helper.js';

export default () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/Posts/" } }
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            id
            timeToRead
            frontmatter {
              title
              date
              slug
              categories
            }
          }
        }
      }
    }
  `);

  return (
    <ul className="post-list">
      {allMarkdownRemark.edges.map(edge => {
        return (
          <li key={edge.node.id}>
            <div className="post-meta">
              {edge.node.frontmatter.categories.map((x, idx) => (
                <span key={idx} className="post-tag">
                  {x}
                </span>
              ))}
              {' • '}
              {formatPostDate(edge.node.frontmatter.date)}
              {' • '}
              {formatReadingTime(edge.node.timeToRead)}
            </div>
            <h2>
              <Link className="post-link" to={edge.node.frontmatter.slug}>
                {edge.node.frontmatter.title}
              </Link>
            </h2>
          </li>
        );
      })}
    </ul>
  );
};
