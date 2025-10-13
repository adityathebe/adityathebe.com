// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';
import { Link } from 'gatsby';

const siteLinks = [
  { path: '/tags', description: 'A list of all the tags' },
  { path: '/reviews/tv', description: "A journal of all the TV shows I've watched with my ratings and reviews" },
  {
    path: '/districts-of-nepal',
    description: "An interactive map of the districts of Nepal marked with the ones I've visited",
  },
];

const techPeople = [
  { name: 'Mitchell Hashimoto', url: 'https://mitchellh.com/' },
  { name: 'Thorsten Ball', url: 'https://thorstenball.com/' },
  { name: 'Jon Gjengset', url: 'https://thesquareplanet.com' },
  { name: 'Filippo Valsorda', url: 'https://filippo.io/' },
  { name: 'Mat Ryer', url: 'https://x.com/matryer' },
  { name: 'Julia Evans', url: 'https://jvns.ca' },
  { name: 'Eli Bendersky', url: 'https://eli.thegreenplace.net' },
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

      <h3>Some of my favorite people in Tech</h3>
      <ul>
        {techPeople.map((person) => (
          <li key={person.name}>
            <a href={person.url} target="_blank" rel="noreferrer">
              {person.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </Layout>
);

export const Head = () => <SEOHead title="Links" keywords={['aditya thebe links']} />;

export default LinksPage;
