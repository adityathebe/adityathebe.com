// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import PostList from '../components/PostList';

const TILPage = () => {
  return (
    <Layout>
      <PageHeader title="TIL" description="Today I Learned - quick notes and discoveries" />
      <PostList filterContentType="til" showContentTypeBadge={false} />
    </Layout>
  );
};

export const Head = () => (
  <SEOHead title="TIL" keywords={['aditya thebe til', 'adityathebe today i learned', 'aditya thebe learnings']} />
);

export default TILPage;
