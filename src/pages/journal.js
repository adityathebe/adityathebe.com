// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import WeeklyJournalList from '../components/WeeklyJournalList';

const JournalPage = () => {
  return (
    <Layout>
      <SEO
        title="Weekly Journals"
        keywords={[
          'aditya thebe journals',
          'adityathebe journals',
          'aditya thebe weekly journals',
        ]}
      />
      <WeeklyJournalList />
    </Layout>
  );
};

export default JournalPage;
