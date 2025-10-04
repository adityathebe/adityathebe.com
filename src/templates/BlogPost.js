// @ts-check
import React from 'react';
import { graphql, Link } from 'gatsby';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import { formatPostDate } from '../utils/helper.js';
import { tagPath, formatTagLabel } from '../utils/tags.js';

import './post.css';

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark;
  return (
    <Layout>
      <div className="post-each-info">
        <span className="post-date">
          {formatPostDate(post.frontmatter.date).full}
          {post.frontmatter.modified_date ? ` (updated: ${formatPostDate(post.frontmatter.modified_date).full})` : ''}
        </span>

        <span className="post-meta">
          {post.frontmatter.categories.map((x, idx) => (
            <Link key={idx} className="post-tag" to={tagPath(x)}>
              {formatTagLabel(x)}
            </Link>
          ))}
        </span>
      </div>

      <h1 className="post-header">{post.frontmatter.title}</h1>

      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  );
};

export const Head = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const siteUrl = data.site.siteMetadata.siteUrl;
  return (
    <SEOHead
      title={post.frontmatter.title}
      description={post.frontmatter.description}
      featuredImage={siteUrl + pageContext.seoImage}
      keywords={post.frontmatter.keywords ? post.frontmatter.keywords : []}
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
        keywords
        modified_date
      }
      timeToRead
    }
  }
`;
