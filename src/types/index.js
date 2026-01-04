/**
 * @typedef {Object} NodeEdge
 * @property {Object} node
 * @property {string} node.id
 * @property {Object} node.frontmatter
 * @property {string} node.frontmatter.title
 * @property {"journal"|"bitesize"} node.frontmatter.contentType
 * @property {string} node.frontmatter.date
 * @property {string} node.frontmatter.slug
 * @property {string[]} [node.frontmatter.categories]
 */

/**
 * @typedef {Object} PostForEmbedding
 * @property {string} slug
 * @property {string} title
 * @property {string} content
 * @property {string} url
 */

/**
 * @typedef {Object} RelatedPost
 * @property {string} slug
 * @property {string} title
 * @property {number} score
 * @property {string} url
 */

export {};
