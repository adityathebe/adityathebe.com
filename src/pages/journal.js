// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import PostList from '../components/PostList';
import './index.css';

const JournalPage = () => {
  return (
    <Layout>
      <div className="home-header">
        <h1 className="home-title">Weekly Journals</h1>
        <p className="home-description">Reflections and updates from my week</p>
      </div>
      <PostList contentPath="/content/WeeklyJournal/" />
    </Layout>
  );
};

export const Head = () => (
  <SEOHead
    title="Weekly Journals"
    keywords={['aditya thebe journals', 'adityathebe journals', 'aditya thebe weekly journals']}
  />
);

export default JournalPage;
