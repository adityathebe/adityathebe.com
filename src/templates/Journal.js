// @ts-check
import React from 'react';
import { graphql } from 'gatsby';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { formatPostDate } from '../utils/helper.js';

import './journal.css';

const WeeklyJournalTemplate = ({ data }) => {
  const journal = data.markdownRemark;
  const siteUrl = data.site.siteMetadata.siteUrl;
  return (
    <Layout>
      <SEO
        title={journal.frontmatter.title + " - Weekly Journal"}
        description={journal.frontmatter.description}
        featuredImage={siteUrl + journal.frontmatter.featuredImage.publicURL}
        keywords={journal.frontmatter.keywords}
        meta={[{ property: 'og:type', content: 'article' }]}
      />
      <h1 className="post-header">{journal.frontmatter.title}</h1>
      <span className="post-meta">
        {formatPostDate(journal.frontmatter.date)}
      </span>
      <hr style={{ margin: '1em 0' }} />
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: journal.html }}
      />
    </Layout>
  );
};

export default WeeklyJournalTemplate;

export const pageQuery = graphql`
  query WeeklyJournalBySlug($slug: String!) {
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
        modified_date
        keywords
      }
      timeToRead
    }
  }
`;