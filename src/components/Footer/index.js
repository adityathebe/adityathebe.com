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
      <div className="footer-col">
        <span className="contact-list">© 2015-2024 {data.site.siteMetadata.author}</span>
      </div>

      <div className="footer-col">
        Subscribe{' '}
        <a href="/rss.xml" rel="noopener noreferrer">
          via RSS
        </a>
      </div>
    </footer>
  );
};

export default Footer;
