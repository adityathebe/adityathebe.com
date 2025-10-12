// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import PostList from '../components/PostList';

const IndexPage = () => {
  return (
    <Layout>
      <PageHeader title="Writing & Notes" description="A mix of thoughts, learnings, and experiments" />
      <PostList contentPath="/content/Posts" />
    </Layout>
  );
};

export const Head = () => <SEOHead title="Home" keywords={['aditya thebe', 'adityathebe', 'aditya thebe blog']} />;

export default IndexPage;
