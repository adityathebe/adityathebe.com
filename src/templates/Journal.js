// @ts-check
import React from 'react';
import { graphql } from 'gatsby';

import Head from '../components/SEO';
import Layout from '../components/Layout';
import { formatPostDate } from '../utils/helper.js';

const WeeklyJournalTemplate = ({ data, pageContext }) => {
  const journal = data.markdownRemark;
  const siteUrl = data.site.siteMetadata.siteUrl;
  return (
    <Layout>
      <Head
        title={journal.frontmatter.title + ' - Weekly Journal'}
        description={journal.frontmatter.description}
        featuredImage={siteUrl + '/' + pageContext.seoImage}
        keywords={journal.frontmatter.keywords}
        ogType="article"
      />
      <h1 className="post-header">{journal.frontmatter.title}</h1>
      <span className="post-meta">{formatPostDate(journal.frontmatter.date).full}</span>
      <hr style={{ margin: '1em 0' }} />
      <div className="post-content journal-content" dangerouslySetInnerHTML={{ __html: journal.html }} />
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
        description
        modified_date
        keywords
      }
      timeToRead
    }
  }
`;
