// @ts-check
import React from 'react';
import { graphql } from 'gatsby';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import { formatPostDate } from '../utils/helper.js';

const IndexPage = ({ data }) => {
  const now = data?.markdownRemark;
  const title = now?.frontmatter?.title || 'Now';
  const updated = now?.frontmatter?.updated ? formatPostDate(now.frontmatter.updated).full : null;

  return (
    <Layout>
      <div className="post-content">
        <h1 id="page-title">{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: now?.html || '' }} />
      </div>

      {updated ? <p>Last Updated: {updated}</p> : null}
    </Layout>
  );
};

export const Head = ({ data }) => {
  const frontmatter = data?.markdownRemark?.frontmatter || {};
  return (
    <SEOHead
      title={frontmatter.title || 'Now'}
      description={frontmatter.description}
      keywords={['aditya thebe currently', 'aditya thebe now']}
    />
  );
};

export const query = graphql`
  query NowPage {
    markdownRemark(frontmatter: { slug: { eq: "/now" } }) {
      html
      frontmatter {
        title
        description
        updated
      }
    }
  }
`;

export default IndexPage;
