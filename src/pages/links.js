// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { Link } from 'gatsby';

const LinksPage = () => (
  <Layout>
    <SEO title="Links" keywords={['aditya thebe links']} />
    <div className="post-content">
      <h1 id="page-title">Links</h1>
      <h2>Movies watch history</h2>
      <a href="https://movies.adityathebe.com/users/adityathebe/dashboard" target="_blank">
        https://movies.adityathebe.com/users/adityathebe/dashboard
      </a>

      <h2>TV Shows watch history</h2>
      <Link to="/reviews/tv" >
        /reviews/tv
      </Link>

      <h2>Some of my favorite people in Tech</h2>
      <ul>
        <li>
          Mitchell Hashimoto:{' '}
          <a href="https://mitchellh.com/" target="_blank">
            https://mitchellh.com/
          </a>
        </li>
        <li>
          Thorsten Ball{' '}
          <a href="https://thorstenball.com/" target="_blank">
            https://thorstenball.com/
          </a>
        </li>
        <li>
          Jon Gjengset{' '}
          <a href="https://thesquareplanet.com" target="_blank">
            https://thesquareplanet.com
          </a>
        </li>
        <li>
          Filippo Valsorda{' '}
          <a href="https://filippo.io/" target="_blank">
            https://filippo.io/
          </a>
        </li>
        <li>
          Mat Ryer{' '}
          <a href="https://x.com/matryer" target="_blank">
            https://x.com/matryer
          </a>
        </li>
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
