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
      {allMarkdownRemark.edges.map((edge) => {
        return (
          <li key={edge.node.id}>
            <span className="post-date">{formatPostDate(edge.node.frontmatter.date)}</span>

            <div className="post-item">
              <Link className="post-link" to={edge.node.frontmatter.slug}>
                {edge.node.frontmatter.title}
              </Link>

              <div className="post-meta">
                {edge.node.frontmatter.categories.map((x, idx) => (
                  <span key={idx} className="post-tag">
                    #{x}
                  </span>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
