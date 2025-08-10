// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import { Link } from 'gatsby';

const LinksPage = () => (
  <Layout>
    <div className="post-content">
      <h1 id="page-title">Links</h1>
      <h2>Movies watch history</h2>
      <a href="https://movies.adityathebe.com/users/adityathebe/dashboard" target="_blank" rel="noreferrer">
        https://movies.adityathebe.com/users/adityathebe/dashboard
      </a>

      <h2>TV Shows watch history</h2>
      <Link to="/reviews/tv">/reviews/tv</Link>

      <h2>Some of my favorite people in Tech</h2>
      <ul>
        <li>
          Mitchell Hashimoto:{' '}
          <a href="https://mitchellh.com/" target="_blank" rel="noreferrer">
            https://mitchellh.com/
          </a>
        </li>
        <li>
          Thorsten Ball{' '}
          <a href="https://thorstenball.com/" target="_blank" rel="noreferrer">
            https://thorstenball.com/
          </a>
        </li>
        <li>
          Jon Gjengset{' '}
          <a href="https://thesquareplanet.com" target="_blank" rel="noreferrer">
            https://thesquareplanet.com
          </a>
        </li>
        <li>
          Filippo Valsorda{' '}
          <a href="https://filippo.io/" target="_blank" rel="noreferrer">
            https://filippo.io/
          </a>
        </li>
        <li>
          Mat Ryer{' '}
          <a href="https://x.com/matryer" target="_blank" rel="noreferrer">
            https://x.com/matryer
          </a>
        </li>
        <li>
          Julia Evans:{' '}
          <a href="https://juliaevans.ca" target="_blank" rel="noreferrer">
            https://juliaevans.ca
          </a>
        </li>
        <li>
          Eli Bendersky:{' '}
          <a href="https://eli.thegreenplace.net" target="_blank" rel="noreferrer">
            https://eli.thegreenplace.net
          </a>
        </li>
      </ul>
    </div>
  </Layout>
);

export const Head = () => <SEOHead title="Links" keywords={['aditya thebe links']} />;

export default LinksPage;
