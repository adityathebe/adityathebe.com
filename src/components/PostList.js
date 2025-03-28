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

  // Group posts by year
  const postsByYear = {};
  
  allMarkdownRemark.edges.forEach(edge => {
    const postYear = new Date(edge.node.frontmatter.date).getFullYear();
    if (!postsByYear[postYear]) {
      postsByYear[postYear] = [];
    }
    postsByYear[postYear].push(edge);
  });

  // Create an array of groups sorted by year (descending)
  const postGroups = Object.entries(postsByYear)
    .map(([year, posts]) => ({
      title: year,
      posts: posts
    }))
    .sort((a, b) => b.title - a.title);

  return (
    <div>
      {postGroups.map(group => (
        <div key={group.title} className="post-group">
          <h2 className="year-heading">{group.title}</h2>
          <ul className="post-list">
            {group.posts.map(edge => (
              <li key={edge.node.id}>
                <div className="post-content-wrapper">
                  <span className="post-date">
                    <span className="post-date-desktop">
                      {formatPostDate(
                        edge.node.frontmatter.date
                      ).short}
                    </span>
                    <span className="post-date-mobile">
                      {formatPostDate(
                        edge.node.frontmatter.date
                      ).full}
                    </span>
                  </span>

                  <div className="post-item">
                    <Link className="post-link" to={edge.node.frontmatter.slug}>
                      {edge.node.frontmatter.title}
                    </Link>

                    <div className="post-meta">
                      {edge.node.frontmatter.categories.map((x, idx) => (
                        <span key={idx} className="post-tag">
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
