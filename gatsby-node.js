// @ts-check
const path = require('path');

const { tagSlug } = require('./src/utils/tags.js');
const { getRelatedPosts } = require('./utils/related-posts.js');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPostTemplate = path.resolve(`./src/templates/BlogPost.js`);
  const tagTemplate = path.resolve(`./src/templates/Tag.js`);

  // Fetch both blog posts and journals
  const [blogPostsResult, journalsResult] = await Promise.all([
    graphql(`
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
    `),
    graphql(`
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
    `),
  ]);

  if (blogPostsResult.errors || journalsResult.errors) {
    throw blogPostsResult.errors || journalsResult.errors;
  }

  const posts = blogPostsResult.data.allMarkdownRemark.edges;
  const journals = journalsResult.data.allMarkdownRemark.edges;

  // Build shared tagMap from both posts and journals
  const tagMap = new Map();

  const addCategoriesToTagMap = (categories) => {
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
  };

  // Create blog post pages and add to tagMap
  const postSummaries = posts.map((post) => ({
    slug: post.node.frontmatter.slug,
    title: post.node.frontmatter.title,
    content: post.node.rawMarkdownBody || '',
    url: post.node.frontmatter.slug,
  }));

  const relatedMap = await getRelatedPosts(postSummaries, { maxRelated: 4, minScore: 0.6 });

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
    addCategoriesToTagMap(categories);
  });

  // Create journal pages and add to tagMap
  journals.forEach((journal) => {
    createPage({
      path: journal.node.frontmatter.slug,
      component: blogPostTemplate,
      context: {
        slug: journal.node.frontmatter.slug,
        seoImage: '',
      },
    });

    const categories = journal.node.frontmatter.categories || [];
    addCategoriesToTagMap(categories);
  });

  // Create tag pages from the shared tagMap
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
