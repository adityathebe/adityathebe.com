// @ts-check
const path = require('path');
const generateImage = require('./gen-social-image');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  // Create pages for blog posts
  const blogPostTemplate = path.resolve(`./src/templates/BlogPost.js`);
  const blogPosts = graphql(`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/Posts/" } }
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges;
    posts.forEach(post => {
      createPage({
        path: post.node.frontmatter.slug,
        component: blogPostTemplate,
        context: {
          slug: post.node.frontmatter.slug,
        },
      });
    });
  });

  // Create pages for weekly journals
  const weeklyJournalTemplate = path.resolve(`./src/templates/Journal.js`);
  const weeklyJournals = graphql(`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/WeeklyJournal/" } }
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create weekly journal pages.
    const posts = result.data.allMarkdownRemark.edges;
    posts.forEach(post => {
      const seoImage = generateImage({
        title: post.node.frontmatter.title,
        slug: post.node.frontmatter.slug,
        pathPrefix: 'static/images/',
      });

      createPage({
        path: post.node.frontmatter.slug,
        component: weeklyJournalTemplate,
        context: {
          slug: post.node.frontmatter.slug,
          seoImage: seoImage,
        },
      });
    });
  });

  return Promise.all([blogPosts, weeklyJournals]);
};
