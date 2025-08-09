// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import './index.css';

const IndexPage = () => {
  return (
    <Layout>
      <div className="home-header">
        <h1 className="home-title">Writing & Notes</h1>
        <p className="home-description">A mix of thoughts, learnings, and experiments</p>
      </div>
      <PostList />
    </Layout>
  );
};

export const Head = () => <SEOHead title="Home" keywords={['aditya thebe', 'adityathebe', 'aditya thebe blog']} />;

export default IndexPage;
