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
      file(relativePath: { eq: "adityathebe.png" }) {
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
      <SEO
        title="Home"
        keywords={[`gatsby`, `application`, `react`]}
      />
      <div className="home">
        <div className="center-block">
          <Img alt="Author's Image" fixed={data.file.childImageSharp.fixed} />
          <h2 id="site-title">Random Thoughts Of A Programmer</h2>
        </div>
      </div>
      <PostList />
    </Layout>
  );
};

export default IndexPage;
