import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { formatPostDate } from '../utils/helper.js';
import { tagPath, formatTagLabel } from '../utils/tags.js';

/** @typedef {import('../types/index.js').NodeEdge} NodeEdge */

/**
 * @param {Object} props
 * @param {string} [props.contentPath] - Path to filter content by (supports regex patterns)
 * @param {string} [props.filterTag] - Tag to filter posts by (matches against frontmatter.categories)
 */
const PostList = ({ contentPath = null, filterTag = null }) => {
  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        edges {
          node {
            id
            timeToRead
            fileAbsolutePath
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

  // Filter posts based on the contentPath prop or filterTag
  /** @type {NodeEdge[]} */
  let filteredEdges = data.allMarkdownRemark.edges;

  if (filterTag) {
    // Filter by tag in frontmatter.categories
    filteredEdges = filteredEdges.filter((edge) =>
      edge.node.frontmatter.categories?.map((x) => x.toLowerCase()).includes(filterTag.toLowerCase())
    );
  }

  if (contentPath) {
    // Filter by content path (supports both string matching and regex patterns)
    if (contentPath.includes('(') || contentPath.includes('|')) {
      // Treat as regex pattern
      const regex = new RegExp(contentPath);
      filteredEdges = filteredEdges.filter((edge) => regex.test(edge.node.fileAbsolutePath));
    } else {
      // Simple string matching
      filteredEdges = filteredEdges.filter((edge) => edge.node.fileAbsolutePath.includes(contentPath));
    }
  }

  const allMarkdownRemark = { edges: filteredEdges };

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
    .sort((a, b) => Number(b.title) - Number(a.title));

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
                      {edge.node.frontmatter.categories?.slice(0, 4).map((x, idx) => (
                        <Link key={idx} className="post-tag" to={tagPath(x)}>
                          {formatTagLabel(x)}
                        </Link>
                      ))}
                      {edge.node.frontmatter.categories?.length > 4 && (
                        <span className="post-tag post-tag-more">+{edge.node.frontmatter.categories.length - 4}</span>
                      )}
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
