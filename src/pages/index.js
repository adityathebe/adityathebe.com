import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PostList from '../components/postList';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <PostList />
  </Layout>
);

export default IndexPage;
