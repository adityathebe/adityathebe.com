import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { formatPostDate } from '../utils/helper.js';

const WeeklyJournal = () => {
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
    <ul className="post-list">
      {allMarkdownRemark.edges.map((edge) => {
        return (
          <li key={edge.node.id}>
            <time className="post-date">{formatPostDate(edge.node.frontmatter.date).full}</time>
            <div className="post-item">
              <Link className="post-link" to={edge.node.frontmatter.slug}>
                {edge.node.frontmatter.title}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default WeeklyJournal;
