// @ts-check
import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/Layout';
import { Head as SEOHead } from '../components/SEO';
import { formatPostDate } from '../utils/helper.js';
import { tagPath, formatTagLabel } from '../utils/tags.js';

const TagTemplate = ({ data, pageContext }) => {
  const allContent = data.allMarkdownRemark.edges;
  const tagDisplayName = formatTagLabel(pageContext.tagSlug || pageContext.tagAliases?.[0] || '');

  // Separate posts and journals
  const posts = allContent.filter(({ node }) => node.fileAbsolutePath.includes('/Posts/'));
  const journals = allContent.filter(({ node }) => node.fileAbsolutePath.includes('/WeeklyJournal/'));

  const renderList = (items, emptyMessage) => {
    if (items.length === 0) {
      return <p>{emptyMessage}</p>;
    }
    return (
      <ul className="post-list">
        {items.map(({ node }) => (
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
    );
  };

  return (
    <Layout>
      <div className="tag-page">
        <h2 className="post-header">Posts tagged "{tagDisplayName}"</h2>
        {renderList(posts, 'No posts found.')}

        {journals.length > 0 && (
          <>
            <h2 className="post-header" style={{ marginTop: '3rem' }}>
              Weekly Journals tagged "{tagDisplayName}"
            </h2>
            {renderList(journals, 'No journals found.')}
          </>
        )}
      </div>
    </Layout>
  );
};

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
