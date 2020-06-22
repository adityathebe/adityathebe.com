// @ts-check
import React from 'react';
import PropTypes from 'prop-types';

import Navbar from '../Navbar/';
import Footer from '../Footer/';

import './layout.css';

const Layout = ({ children }) => (
  <>
    <head>
      <meta name="yandex-verification" content="0e3d760f663fd964" />
    </head>
    <Navbar />
    <main className="page-content">
      <div className="wrapper">{children}</div>
    </main>
    <Footer />
    <script async defer src="https://cdn.simpleanalytics.io/hello.js" />
    <noscript>
      <img src="https://api.simpleanalytics.io/hello.gif" alt="" />
    </noscript>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
