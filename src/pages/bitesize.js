// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import PostList from '../components/PostList';

const BitesizePage = () => {
  return (
    <Layout>
      <PageHeader title="Bitesize" description="Short reads and quick insights" />
      <PostList filterContentType="bitesize" showContentTypeBadge={false} />
    </Layout>
  );
};

export const Head = () => (
  <SEOHead
    title="Bitesize"
    keywords={['aditya thebe bitesize', 'adityathebe bitesize', 'aditya thebe short articles']}
  />
);

export default BitesizePage;
