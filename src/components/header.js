import { Link, graphql, useStaticQuery } from 'gatsby';
import React from 'react';

const Styles = {
  header: {
    background: `rebeccapurple`,
    marginBottom: `1.45rem`,
  },
  div: {
    margin: `0 auto`,
    maxWidth: 960,
    padding: `1.45rem 1.0875rem`,
  },
  link: {
    color: `white`,
    textDecoration: `none`,
  },
};

const Header = () => {
  const { site } = useStaticQuery(
    graphql`
      query HeadingQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  return (
    <header style={Styles.header}>
      <div style={Styles.div}>
        <h1 style={{ margin: 0 }}>
          <Link to="/" style={Styles.link}>
            {site.siteMetadata.title}
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;
