import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { formatPostDate } from '../utils/helper.js';
import ContentTypeBadge from './ContentTypeBadge';

/** @typedef {import('../types/index.js').NodeEdge} NodeEdge */

/**
 * @param {Object} props
 * @param {string} [props.filterTag] - Tag to filter posts by (matches against frontmatter.categories)
 * @param {string} [props.filterContentType] - Content type to filter by (e.g., 'journal', 'bitesize')
 * @param {boolean} [props.showContentTypeBadge] - Whether to show content type badges (default: true)
 */
const PostList = ({ filterTag = null, filterContentType = null, showContentTypeBadge = true }) => {
  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        edges {
          node {
            id
            timeToRead
            frontmatter {
              title
              date
              slug
              categories
              contentType
            }
          }
        }
      }
    }
  `);

  // Filter posts based on filterTag and filterContentType
  /** @type {NodeEdge[]} */
  let filteredEdges = data.allMarkdownRemark.edges;

  if (filterTag) {
    // Filter by tag in frontmatter.categories
    filteredEdges = filteredEdges.filter((edge) =>
      edge.node.frontmatter.categories?.map((x) => x.toLowerCase()).includes(filterTag.toLowerCase())
    );
  }

  if (filterContentType) {
    // Filter by content type
    filteredEdges = filteredEdges.filter((edge) => edge.node.frontmatter.contentType === filterContentType);
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
            {group.posts.map((edge) => {
              const contentType = edge.node.frontmatter.contentType;
              return (
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
                      {showContentTypeBadge && contentType && <ContentTypeBadge type={contentType} />}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PostList;
