// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import PostList from '../components/PostList';

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" keywords={['aditya thebe', 'adityathebe']} />
      <div className="center-block">
        <h2>Random Thoughts Of A Programmer</h2>
      </div>
      <PostList />
    </Layout>
  );
};

export default IndexPage;
