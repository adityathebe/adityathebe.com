// @ts-check
const path = require('path');

const createTagSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  // Create pages for blog posts
  const blogPostTemplate = path.resolve(`./src/templates/BlogPost.js`);
  const tagTemplate = path.resolve(`./src/templates/Tag.js`);
  const blogPosts = graphql(`
    {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/Posts/" } }
        sort: { frontmatter: { date: DESC } }
        limit: 1000
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date
              slug
              categories
              featuredImage {
                publicURL
              }
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges;

    const tagMap = new Map();

    posts.forEach((post) => {
      let seoImage = '';
      if (post.node.frontmatter.featuredImage) {
        seoImage = post.node.frontmatter.featuredImage.publicURL;
      }

      createPage({
        path: post.node.frontmatter.slug,
        component: blogPostTemplate,
        context: {
          slug: post.node.frontmatter.slug,
          seoImage: seoImage,
        },
      });

      const categories = post.node.frontmatter.categories || [];
      categories
        .map((category) => (category ? category.trim() : ''))
        .filter(Boolean)
        .forEach((category) => {
          const slug = createTagSlug(category);
          if (!slug) {
            return;
          }

          if (!tagMap.has(slug)) {
            tagMap.set(slug, {
              aliases: new Set([category]),
            });
            return;
          }

          const existing = tagMap.get(slug);
          existing.aliases.add(category);
        });
    });

    tagMap.forEach(({ aliases }, slug) => {
      createPage({
        path: `/tags/${slug}/`,
        component: tagTemplate,
        context: {
          tagSlug: slug,
          tagAliases: Array.from(aliases),
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
        sort: { frontmatter: { date: DESC } }
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
  `).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

    // Create weekly journal pages.
    const posts = result.data.allMarkdownRemark.edges;
    posts.forEach((post) => {
      createPage({
        path: post.node.frontmatter.slug,
        component: weeklyJournalTemplate,
        context: {
          slug: post.node.frontmatter.slug,
          seoImage: '',
        },
      });
    });
  });

  return Promise.all([blogPosts, weeklyJournals]);
};

// Need to define the type explicity to handle nullable fields
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type TvYaml implements Node {
      title: String!    
      status: String!   
      tier: Float       
      year: Int         
      review: String    
    }
  `;

  createTypes(typeDefs);
};
