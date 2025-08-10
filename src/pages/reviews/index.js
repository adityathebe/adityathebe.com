//@ts-check
import React from 'react';
import { Head as SEOHead } from '../../components/SEO';
import Layout from '../../components/Layout';
import { Link } from 'gatsby';

const Reviews = () => {
  return (
    <Layout>
      <Link to="/reviews/tv">TV</Link>
    </Layout>
  );
};

export const Head = () => <SEOHead title="All Reviews" />;

export default Reviews;
