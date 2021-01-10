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
              <li>© 2020 {data.site.siteMetadata.author}</li>
              <li>
                <a href="mailto:thebeaditya@gmail.com">thebeaditya@gmail.com</a>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-col-2">
            <ul className="social-media-list">
              <li>
                <a href="https://github.com/adityathebe">
                  <span className="icon icon--github">
                    <svg viewBox="0 0 16 16" width="16px" height="16px">
                      <path
                        fill="#828282"
                        d="M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z"
                      />
                    </svg>
                  </span>
                  <span className="username">
                    {data.site.siteMetadata.social.github}
                  </span>
                </a>
              </li>
              <li>
                <a href="https://twitter.com/adityathebe">
                  <span className="icon icon--twitter">
                    <svg viewBox="0 0 16 16" width="16px" height="16px">
                      <path
                        fill="#828282"
                        d="M15.969,3.058c-0.586,0.26-1.217,0.436-1.878,0.515c0.675-0.405,1.194-1.045,1.438-1.809c-0.632,0.375-1.332,0.647-2.076,0.793c-0.596-0.636-1.446-1.033-2.387-1.033c-1.806,0-3.27,1.464-3.27,3.27 c0,0.256,0.029,0.506,0.085,0.745C5.163,5.404,2.753,4.102,1.14,2.124C0.859,2.607,0.698,3.168,0.698,3.767 c0,1.134,0.577,2.135,1.455,2.722C1.616,6.472,1.112,6.325,0.671,6.08c0,0.014,0,0.027,0,0.041c0,1.584,1.127,2.906,2.623,3.206 C3.02,9.402,2.731,9.442,2.433,9.442c-0.211,0-0.416-0.021-0.615-0.059c0.416,1.299,1.624,2.245,3.055,2.271 c-1.119,0.877-2.529,1.4-4.061,1.4c-0.264,0-0.524-0.015-0.78-0.046c1.447,0.928,3.166,1.469,5.013,1.469 c6.015,0,9.304-4.983,9.304-9.304c0-0.142-0.003-0.283-0.009-0.423C14.976,4.29,15.531,3.714,15.969,3.058z"
                      />
                    </svg>
                  </span>
                  <span className="username">
                    {data.site.siteMetadata.social.twitter}
                  </span>
                </a>
              </li>
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
