//@ts-check
import React from 'react';
import SEO from '../../components/SEO';
import Layout from '../../components/Layout';
import { Link } from 'gatsby';

const Reviews = () => {
  return (
    <Layout>
      <SEO title="All Reviews" />

      <Link to="/reviews/tv">TV</Link>
    </Layout>
  );
};

export default Reviews;
