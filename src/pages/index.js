// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import PostList from '../components/PostList';

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" keywords={['aditya thebe', 'adityathebe']} />
      <PostList />
    </Layout>
  );
};

export default IndexPage;
