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
    <footer className="flex flex-col items-center gap-4 border-t text-sm mt-12 py-8 md:flex-row md:justify-between md:items-start">
      <div className="footer-col">
        <span className="contact-list list-none ml-0">© 2015-2026 {data.site.siteMetadata.author}</span>
      </div>

      <div className="footer-col">
        Subscribe{' '}
        <a href="/rss.xml" rel="noopener noreferrer" className="underline text-primary-text-color hover:underline">
          via RSS
        </a>
      </div>
    </footer>
  );
};

export default Footer;
