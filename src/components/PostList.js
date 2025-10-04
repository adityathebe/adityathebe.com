import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { formatPostDate } from '../utils/helper.js';
import { tagPath } from '../utils/tags.js';

const PostList = () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/Posts/" } }
        sort: { frontmatter: { date: DESC } }
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

  allMarkdownRemark.edges.forEach((edge) => {
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
      posts: posts,
    }))
    .sort((a, b) => b.title - a.title);

  return (
    <div>
      {postGroups.map((group) => (
        <div key={group.title} className="post-group">
          <h2 className="year-heading">{group.title}</h2>
          <ul className="post-list">
            {group.posts.map((edge) => (
              <li key={edge.node.id}>
                <div className="post-content-wrapper">
                  <span className="post-date">
                    <span className="post-date-desktop">{formatPostDate(edge.node.frontmatter.date).short}</span>
                    <span className="post-date-mobile">{formatPostDate(edge.node.frontmatter.date).full}</span>
                  </span>

                  <div className="post-item">
                    <Link className="post-link" to={edge.node.frontmatter.slug}>
                      {edge.node.frontmatter.title}
                    </Link>

                    <div className="post-meta">
                      {edge.node.frontmatter.categories.map((x, idx) => (
                        <Link key={idx} className="post-tag" to={tagPath(x)}>
                          {x}
                        </Link>
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

export default PostList;
