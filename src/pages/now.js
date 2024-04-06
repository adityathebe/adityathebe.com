// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';

const IndexPage = () => (
  <Layout>
    <SEO title="Now" keywords={['aditya thebe currently', 'aditya thebe now']} />
    <div className="post-content">
      <h1 id="page-title">Now</h1>
      <ul>
        <li>
          Working at <a href="https://flanksource.com">@Flanksource</a>
        </li>
        <li>
          <a href="https://hevy.com/user/adityathebe">Working out</a>
        </li>
        <li>In the process of using neovim full-time</li>
        <li>
          Reading <a href="https://theartofpostgresql.com/">The Art Of PostgreSQL</a>
        </li>
        <li>Playing Pubg</li>
        <li>
          Watching <a href="https://www.imdb.com/title/tt2788316/">Shogun</a>
        </li>
      </ul>
    </div>

    <p>Last Updated: 06 Apr 2024</p>
  </Layout>
);

export default IndexPage;
