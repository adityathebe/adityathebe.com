// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import { Link } from 'gatsby';

const siteLinks = [
  { path: '/reviews/tv', description: "A journal of all the TV shows I've watched with my ratings and reviews" },
  {
    path: '/districts-of-nepal',
    description: "An interactive map of the districts of Nepal marked with the ones I've visited",
  },
];

const LinksPage = () => (
  <Layout>
    <div className="post-content">
      <h1 id="page-title">🔗 Links</h1>
      <h3>Site</h3>
      <ul>
        {siteLinks.map((link) => (
          <li key={link.path}>
            <Link to={link.path}>{link.path}</Link>
            <span>: {link.description}</span>
          </li>
        ))}
      </ul>

      <h3>Movies watch history</h3>
      <a href="https://movies.adityathebe.com/users/adityathebe/dashboard" target="_blank" rel="noreferrer">
        https://movies.adityathebe.com/users/adityathebe/dashboard
      </a>
    </div>
  </Layout>
);

export const Head = () => <SEOHead title="Links" keywords={['aditya thebe links']} />;

export default LinksPage;
