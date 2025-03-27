// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import './index.css';

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" keywords={['aditya thebe', 'adityathebe']} />
      <div className="home-header">
        <h1 className="home-title">Writing & Notes</h1>
        <p className="home-description">A mix of thoughts, learnings, and experiments</p>
      </div>
      <PostList />
    </Layout>
  );
};

export default IndexPage;
