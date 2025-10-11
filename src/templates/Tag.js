// @ts-check
import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/Layout';
import { Head as SEOHead } from '../components/SEO';
import { formatPostDate } from '../utils/helper.js';
import { tagPath, formatTagLabel } from '../utils/tags.js';

/**
 * @typedef {Object} ContentNode
 * @property {string} id
 * @property {string} fileAbsolutePath
 * @property {Object} frontmatter
 * @property {string} frontmatter.title
 * @property {string} frontmatter.date
 * @property {string} frontmatter.slug
 * @property {string[]} frontmatter.categories
 */

/**
 * @typedef {Object} ContentEdge
 * @property {ContentNode} node
 */

/**
 * @param {Object} props
 * @param {any} props.data
 * @param {Object} props.pageContext
 * @param {string} [props.pageContext.tagSlug]
 * @param {string[]} [props.pageContext.tagAliases]
 */
const TagTemplate = ({ data, pageContext }) => {
  /** @type {ContentEdge[]} */
  const allContent = data.allMarkdownRemark.edges;
  const tagDisplayName = formatTagLabel(pageContext.tagSlug || pageContext.tagAliases?.[0] || '');

  return (
    <Layout>
      <div className="tag-page">
        <h2 className="post-header">Tagged "{tagDisplayName}"</h2>
        {allContent.length === 0 ? (
          <p>No content found.</p>
        ) : (
          <ul className="post-list">
            {allContent.map(({ node }) => (
              <li key={node.id}>
                <div className="post-content-wrapper">
                  <span className="post-date">
                    <span className="post-date-desktop">{formatPostDate(node.frontmatter.date).short}</span>
                    <span className="post-date-mobile">{formatPostDate(node.frontmatter.date).full}</span>
                  </span>

                  <div className="post-item">
                    <Link className="post-link" to={node.frontmatter.slug}>
                      {node.frontmatter.title}
                    </Link>

                    <div className="post-meta">
                      {(node.frontmatter.categories || []).map((category, idx) => (
                        <Link key={idx} className="post-tag" to={tagPath(category)}>
                          {formatTagLabel(category)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

/**
 * @param {Object} props
 * @param {Object} props.pageContext
 * @param {string} [props.pageContext.tagSlug]
 * @param {string[]} [props.pageContext.tagAliases]
 */
export const Head = ({ pageContext }) => {
  const tagDisplayName = formatTagLabel(pageContext.tagSlug || pageContext.tagAliases?.[0] || '');
  return (
    <SEOHead
      title={`Aditya Thebe on ${tagDisplayName}`}
      description={`Aditya Thebe on ${tagDisplayName}`}
      keywords={[tagDisplayName]}
      appendSiteTitle={false}
    />
  );
};

export default TagTemplate;

export const pageQuery = graphql`
  query TagPage($tagAliases: [String!]!) {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/(Posts|WeeklyJournal)/" }
        frontmatter: { categories: { in: $tagAliases } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          id
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
`;
