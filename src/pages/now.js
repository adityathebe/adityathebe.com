// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';

const IndexPage = () => (
  <Layout>
    <div className="post-content">
      <h1 id="page-title">🕰️ Now</h1>
      <br />
      <ul>
        <li>🏠 In Kathmandu</li>
        <li>
          Working at <a href="https://flanksource.com">@Flanksource</a>
        </li>
        <li>
          Watching <a href="https://www.imdb.com/title/tt2802850/">Fargo Season II</a>
        </li>
        {/* <li> */}
        {/*   Reading{' '} */}
        {/*   <a */}
        {/*     target="_blank" */}
        {/*     href="https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" */}
        {/*     rel="noreferrer" */}
        {/*   > */}
        {/*     Designing Data-Intensive Applications */}
        {/*   </a> */}
        {/* </li> */}
        {/* <li>
          <a href="https://hevy.com/user/adityathebe">Working out</a>
        </li> */}
      </ul>
    </div>

    <p>Last Updated: 4 Dec, 2025</p>
  </Layout>
);

export const Head = () => <SEOHead title="Now" keywords={['aditya thebe currently', 'aditya thebe now']} />;

export default IndexPage;
