// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';

const LinksPage = () => (
  <Layout>
    <SEO title="Links" keywords={['aditya thebe links']} />
    <div className="post-content">
      <h1 id="page-title">Links</h1>
      <h2>Movies watch history</h2>
      <a href="https://movies.adityathebe.com/users/adityathebe/dashboard" target="_blank">
        https://movies.adityathebe.com/users/adityathebe/dashboard
      </a>
      <h2>Some of my favorite blogs</h2>
      <ul>
        <li>
          Julia Evans:{' '}
          <a href="https://juliaevans.ca" target="_blank">
            https://juliaevans.ca
          </a>
        </li>
        <li>
          Eli Bendersky:{' '}
          <a href="https://eli.thegreenplace.net" target="_blank">
            https://eli.thegreenplace.net
          </a>
        </li>
      </ul>
    </div>
  </Layout>
);

export default LinksPage;
