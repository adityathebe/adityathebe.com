// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import PostList from '../components/PostList';

const JournalPage = () => {
  return (
    <Layout>
      <PageHeader title="Weekly Journals" description="Reflections and updates from my week" />
      <PostList contentPath="/content/WeeklyJournal/" showContentTypeBadge={false} />
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
