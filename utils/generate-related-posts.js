// @ts-check
// Computes related posts from OpenAI embeddings and writes them to
// data/related-posts.json, which gatsby-node.js reads at build time.
// Run via `task related_posts` after adding or editing posts.
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const { getRelatedPosts } = require('./related-posts.js');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'Posts');
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'related-posts.json');

/** @typedef {import('../src/types/index.js').PostForEmbedding} PostForEmbedding */

/** @returns {PostForEmbedding[]} */
function readPosts() {
  /** @type {PostForEmbedding[]} */
  const posts = [];
  for (const dir of fs.readdirSync(POSTS_DIR).sort()) {
    const file = ['index.md', 'index.mdx']
      .map((name) => path.join(POSTS_DIR, dir, name))
      .find((candidate) => fs.existsSync(candidate));
    if (!file) {
      continue;
    }

    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    posts.push({ slug: data.slug, title: data.title, content, url: data.slug });
  }
  return posts;
}

async function main() {
  const related = await getRelatedPosts(readPosts(), { maxRelated: 4 });

  // Only slugs and scores are stored; gatsby-node.js resolves titles and URLs
  // at build time so they never go stale.
  /** @type {Record<string, { slug: string; score: number }[]>} */
  const output = {};
  for (const slug of Object.keys(related).sort()) {
    output[slug] = related[slug].map((item) => ({
      slug: item.slug,
      score: Number(item.score.toFixed(3)),
    }));
  }

  await fs.promises.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(
    `Wrote related posts for ${Object.keys(output).length} posts to ${path.relative(process.cwd(), OUTPUT_PATH)}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
