import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { formatPostDate } from '../utils/helper.js';

export default () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/WeeklyJournal/" } }
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
    <div className="journal-list">
      {allMarkdownRemark.edges.map(edge => {
        return (
          <>
            <div>
              <Link className="journal-link" to={edge.node.frontmatter.slug}>
                {edge.node.frontmatter.title}
              </Link>
            </div>
            <time className="journal-date">
              {formatPostDate(edge.node.frontmatter.date)}
            </time>
          </>
        );
      })}
    </div>
  );
};
