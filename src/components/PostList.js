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

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  // Group posts into three categories: current year, last year, and older
  const currentYearPosts = [];
  const lastYearPosts = [];
  const olderPosts = [];
  
  allMarkdownRemark.edges.forEach(edge => {
    const postYear = new Date(edge.node.frontmatter.date).getFullYear();
    
    if (postYear === currentYear) {
      currentYearPosts.push(edge);
    } else if (postYear === lastYear) {
      lastYearPosts.push(edge);
    } else {
      olderPosts.push(edge);
    }
  });

  // Create an array of groups to render
  const postGroups = [
    { title: currentYear.toString(), posts: currentYearPosts },
    { title: lastYear.toString(), posts: lastYearPosts },
    { title: "Older", posts: olderPosts }
  ].filter(group => group.posts.length > 0); // Only show groups with posts

  return (
    <div>
      {postGroups.map(group => (
        <div key={group.title}>
          <h2 className="year-heading">{group.title}</h2>
          <ul className="post-list">
            {group.posts.map(edge => (
              <li key={edge.node.id}>
                <span className="post-date">
                  {formatPostDate(
                    edge.node.frontmatter.date, 
                    'en-US', 
                    group.title === "Older" 
                  )}
                </span>

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
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
