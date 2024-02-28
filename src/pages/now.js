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
        <li>Working at <a href="flanksource.com">@Flanksource</a></li>
        <li><a href="https://hevy.com/user/adityathebe">Working out</a></li>
        <li>Working on redesigning this website and adding new stuff</li>
        <li>Using neovim part-time. Hoping to move to it soon</li>
        <li>Learning <a href="https://github.com/adityathebe/nixos-config">NixOS</a></li>
        <li>Building <a href="https://github.com/adityathebe/homelab">homelab</a></li>
      </ul>
    </div>

    <p>Last Updated: 28 Feb 2024</p>
  </Layout>
);

export default IndexPage;
