// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';

const items = [
  { id: 'location', label: '🏠 In Kathmandu' },
  {
    id: 'work',
    label: 'Working at',
    link: { href: 'https://flanksource.com', text: '@Flanksource' },
  },
  {
    id: 'watching',
    label: 'Watching',
    link: { href: 'https://www.imdb.com/title/tt2802850/', text: 'Fargo Season II' },
  },
  // {
  //   id: 'reading',
  //   label: 'Reading',
  //   link: {
  //     href: 'https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/',
  //     text: 'Designing Data-Intensive Applications',
  //   },
  // },
  // {
  //   id: 'workout',
  //   label: 'Working out',
  //   link: { href: 'https://hevy.com/user/adityathebe', text: 'Hevy' },
  // },
];

const IndexPage = () => (
  <Layout>
    <div className="post-content">
      <h1 id="page-title">🕰️ Now</h1>
      <br />
      <ul>
        {items.map(({ id, label, link }) => (
          <li key={id}>
            {label}
            {link ? (
              <>
                {' '}
                <a href={link.href}>{link.text}</a>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </div>

    <p>Last Updated: 4 Dec, 2025</p>
  </Layout>
);

export const Head = () => <SEOHead title="Now" keywords={['aditya thebe currently', 'aditya thebe now']} />;

export default IndexPage;
