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
        <li>
          Binging <a href="https://www.rottentomatoes.com/tv/homeland">Homeland (@season 4)</a>
        </li>
        <li>
          Taking{' '}
          <a href="https://www.youtube.com/playlist?list=PLSE8ODhjZXjYDBpQnSymaectKjxCy6BYq">
            CMU Intro to Database Systems
          </a>
        </li>
      </ul>
    </div>

    <p>Last Updated: 28 Jan 2025</p>
  </Layout>
);

export default IndexPage;
