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
        <li>🏠 In Kathmandu</li>
        <li>
          Working at <a href="https://flanksource.com">@Flanksource</a>
        </li>
        {/* <li>Getting into the roots of low-level networking fundamentals</li> */}
        <li>
          Reading <a target='_blank' href='https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/'>
            Designing Data-Intensive Applications
          </a>
        </li>
        <li>
          Watching <a target='_blank' href="https://www.imdb.com/title/tt3581920/">The Last of Us - Season 2</a>
        </li>
        {/* <li>
          <a href="https://hevy.com/user/adityathebe">Working out</a>
        </li> */}
      </ul>
    </div>

    <p>Last Updated: 17 May, 2025</p>
  </Layout>
);

export default IndexPage;
