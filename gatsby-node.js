// @ts-check
const path = require('path');

const { tagSlug } = require('./src/utils/tags.js');
const { getRelatedPosts } = require('./utils/related-posts.js');

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
            rawMarkdownBody
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
  `).then(async (result) => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    /**
     * @type {Array<{ node: { id: string; rawMarkdownBody: string; frontmatter: { title: string; date: string; slug: string; categories?: Array<string>; featuredImage?: { publicURL: string } } } }>}
     */
    const posts = result.data.allMarkdownRemark.edges;

    const postSummaries = posts.map((post) => ({
      slug: post.node.frontmatter.slug,
      title: post.node.frontmatter.title,
      content: post.node.rawMarkdownBody || '',
      url: post.node.frontmatter.slug,
    }));

    const relatedMap = await getRelatedPosts(postSummaries, { maxRelated: 4, minScore: 0.6 });

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
          relatedPosts: relatedMap[post.node.frontmatter.slug] || [],
        },
      });

      const categories = post.node.frontmatter.categories || [];
      categories
        .map((category) => (category ? category.trim() : ''))
        .filter(Boolean)
        .forEach((category) => {
          const slug = tagSlug(category);
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
              categories
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
        component: blogPostTemplate,
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

    type MarkdownRemarkFrontmatter {
      categories: [String!] @default(value: [])
    }
  `;

  createTypes(typeDefs);
};
