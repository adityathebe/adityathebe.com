// @ts-check
import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/Layout';
import { Head as SEOHead } from '../components/SEO';
import { formatPostDate } from '../utils/helper.js';
import { tagPath } from '../utils/tags.js';

const TagTemplate = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges;
  const tagLabel = pageContext.tag;

  return (
    <Layout>
      <div className="tag-page">
        <h1 className="post-header">Posts tagged “{tagLabel}”</h1>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <ul className="post-list">
            {posts.map(({ node }) => (
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
                          {category}
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

export const Head = ({ pageContext }) => {
  const tagLabel = pageContext.tag;
  return <SEOHead title={`Posts tagged ${tagLabel}`} description={`Posts tagged ${tagLabel}`} keywords={[tagLabel]} />;
};

export default TagTemplate;

export const pageQuery = graphql`
  query TagPage($tagAliases: [String!]!) {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/Posts/" }
        frontmatter: { categories: { in: $tagAliases } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
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
`;
