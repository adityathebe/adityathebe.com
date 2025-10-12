// @ts-check
import React from 'react';

import Layout from '../components/Layout';
import { Head as SEOHead } from '../components/SEO';
import PageHeader from '../components/PageHeader';
import PostList from '../components/PostList';
import { formatTagLabel } from '../utils/tags.js';

/**
 * @param {Object} props
 * @param {Object} props.pageContext
 * @param {string} [props.pageContext.tagSlug]
 * @param {string[]} [props.pageContext.tagAliases]
 */
const TagTemplate = ({ pageContext }) => {
  const tagDisplayName = formatTagLabel(pageContext.tagSlug || pageContext.tagAliases?.[0] || '');
  // Use the first tag alias for filtering (all aliases should match the same content)
  const filterTag = pageContext.tagAliases?.[0] || pageContext.tagSlug;

  return (
    <Layout>
      <PageHeader title={`Tagged "${tagDisplayName}"`} description={`Posts and notes on ${tagDisplayName}`} />
      <PostList filterTag={filterTag} />
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
