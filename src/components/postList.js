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
            <span className="post-meta">
            {edge.node.frontmatter.date}
            <b> - </b>
            {edge.node.frontmatter.categories}
            </span>
            <h2>
              <Link
                className="post-link"
                to={edge.node.frontmatter.slug}
              >
                {edge.node.frontmatter.title}
              </Link>
            </h2>
          </li>
        );
      })}
    </ul>
  );
};
