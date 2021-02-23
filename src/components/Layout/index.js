// @ts-check
import React from 'react';
import PropTypes from 'prop-types';

import Navbar from '../Navbar/';
import Footer from '../Footer/';

import './layout.css';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main className="page-content">
      <div className="wrapper">{children}</div>
    </main>
    <Footer />
    <script
      data-goatcounter="https://adityakosite.goatcounter.com/count"
      async
      src="//gc.zgo.at/count.js"
    />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
