// @ts-check
import React from 'react';
import Img from 'gatsby-image';
import { useStaticQuery, graphql } from 'gatsby';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import PostList from '../components/PostList';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "Images/adityathebe.png" }) {
        childImageSharp {
          fixed(height: 200) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title="Home" keywords={['aditya thebe', 'adityathebe']} />
      <div className="home">
        <div onClick={changeTheme} className="center-block">
          <Img alt="Author's Image" fixed={data.file.childImageSharp.fixed} />
          <h2>Random Thoughts Of A Programmer</h2>
        </div>
      </div>
      <PostList />
    </Layout>
  );
};

export default IndexPage;

function changeTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('transition');
    window.setTimeout(
      () => document.documentElement.classList.remove('transition'),
      600
    );
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.classList.add('transition');
    window.setTimeout(
      () => document.documentElement.classList.remove('transition'),
      600
    );
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}
