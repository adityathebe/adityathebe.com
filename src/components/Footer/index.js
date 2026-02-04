import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

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
    <footer className="mt-12 flex flex-col items-center gap-4 border-t py-8 text-sm md:flex-row md:items-start md:justify-between">
      <div className="footer-col">
        <span className="contact-list ml-0 list-none">© 2015-2026 {data.site.siteMetadata.author}</span>
      </div>

      <div className="footer-col">
        Subscribe{' '}
        <a href="/rss.xml" rel="noopener noreferrer" className="text-primary-text-color underline hover:underline">
          via RSS
        </a>
      </div>
    </footer>
  );
};

export default Footer;
