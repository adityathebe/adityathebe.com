import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';

import './footer.css';

const Footer = () => {
  const data = useStaticQuery(graphql`
    query SiteMeta {
      site {
        siteMetadata {
          title
          author
          description
        }
      }
    }
  `);

  return (
    <footer className="site-footer">
      <div className="wrapper">
        <div className="footer-col-wrapper">
          <div className="footer-col footer-col-1">
            <ul className="contact-list">
              <li>Aditya</li>
              <li>
                <Link to="mailto:thebeaditya@gmail.com">
                  thebeaditya@gmail.com
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-col-2">
            <ul className="social-media-list">
              <li>Github</li>
              <li>Twitter</li>
            </ul>
          </div>

          <div className="footer-col footer-col-3">
            {data.site.siteMetadata.description}  <br />
            subscribe <Link to="/rss.xml">via RSS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
