// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import WeeklyJournalList from '../components/WeeklyJournalList';

const JournalPage = () => {
  return (
    <Layout>
      <WeeklyJournalList />
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
