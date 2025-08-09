// @ts-check
import React from 'react';

import Navbar from '../Navbar/';
import Footer from '../Footer/';

import './layout.css';

const Layout = ({ children }) => (
  <div className="main-wrapper">
    <Navbar />
    <main className="page-content">{children}</main>
    <Footer />
  </div>
);

export default Layout;
