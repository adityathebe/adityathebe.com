import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import './footer.css';

const Footer = () => {
  const data = useStaticQuery(graphql`
    query SiteMeta {
      site {
        siteMetadata {
          title
          author
          description
          social {
            github
            twitter
          }
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
              <li>© 2021 {data.site.siteMetadata.author}</li>
            </ul>
          </div>

          <div className="footer-col footer-col-3">
            Subscribe{' '}
            <a href="/rss.xml" rel="noopener noreferrer">
              via RSS
            </a>
          </div>
        </div>

        <div className="footer-baseline">
          <p>
            Built with{' '}
            <span role="img" aria-label="heart-icon">
              ❤
            </span>{' '}
            using Gatsby
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
