import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

export default () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              title
              date
              slug
            }
          }
        }
      }
    }
  `);

  return (
    <div className="post-lists">
      {allMarkdownRemark.edges.map((edge) => {
        return (
          <div key={edge.node.id} className="post-list-meta">
            <Link to={edge.node.frontmatter.slug}>
              <h1>{edge.node.frontmatter.title}</h1>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
