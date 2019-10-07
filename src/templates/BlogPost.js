// @ts-check
import React from 'react';
import { graphql } from 'gatsby';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { formatReadingTime, formatPostDate } from '../utils/helper.js';

import './post.css';

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark;
  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        featuredImage={post.frontmatter.featuredImage.publicURL}
        keywords={['blog']}
      />
      <h1 className="post-header">{post.frontmatter.title}</h1>
      <span className="post-meta">
        {post.frontmatter.categories.map((x, idx) => (
          <span key={idx} className="post-tag">
            {x}
          </span>
        ))}
        {' • '}
        {formatPostDate(post.frontmatter.date)}
        {' • '}
        {formatReadingTime(post.timeToRead)}
      </span>
      <hr style={{ margin: '1em 0' }} />
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
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
      }
      timeToRead
    }
  }
`;
