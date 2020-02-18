// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import PostList from '../components/PostList';

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" keywords={['aditya thebe', 'adityathebe']} />
      <div className="center-block">
        <h2>Random Thoughts Of A Programmer</h2>
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
