// @ts-check
import React from 'react';
import { graphql, Link } from 'gatsby';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import { formatPostDate } from '../utils/helper.js';
import { tagPath, formatTagLabel } from '../utils/tags.js';

import './post.css';

/** @typedef {import('../types/index.js').RelatedPost} RelatedPost */

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const relatedPosts = pageContext?.relatedPosts || [];
  const categories = Array.isArray(post.frontmatter.categories) ? post.frontmatter.categories : [];
  return (
    <Layout>
      <div className="post-each-info">
        <span className="post-date">
          {formatPostDate(post.frontmatter.date).full}
          {post.frontmatter.modified_date ? ` (updated: ${formatPostDate(post.frontmatter.modified_date).full})` : ''}
        </span>

        <span className="post-meta">
          {categories.map((x, idx) => (
            <Link key={idx} className="post-tag" to={tagPath(x)}>
              {formatTagLabel(x)}
            </Link>
          ))}
        </span>
      </div>

      <h1 className="post-header">{post.frontmatter.title}</h1>
      <hr />

      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      <hr />
      <RelatedPosts relatedPosts={relatedPosts} />
    </Layout>
  );
};

/**
 *
 * @param {{ relatedPosts: RelatedPost[] }} props
 * @returns
 */
function RelatedPosts({ relatedPosts }) {
  return (
    <div className="post-content">
      {relatedPosts.length > 0 ? (
        <aside className="related-posts">
          <h2>Related posts</h2>
          <ul>
            {relatedPosts.map((related) => (
              <li key={related.slug}>
                <Link to={related.url}>{related.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}

export const Head = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const siteUrl = data.site.siteMetadata.siteUrl;
  return (
    <SEOHead
      title={post.frontmatter.title}
      description={post.frontmatter.description}
      featuredImage={siteUrl + pageContext.seoImage}
      keywords={post.frontmatter.categories ? post.frontmatter.categories : []}
      ogType="article"
    />
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date
        featuredImage {
          publicURL
        }
        description
        categories
        modified_date
      }
      timeToRead
    }
  }
`;
