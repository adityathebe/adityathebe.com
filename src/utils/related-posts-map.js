import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { getAllPosts } from './posts.js';
import { getRelatedPosts } from './related-posts.js';

let cachedRelated = null;

const resolveFilePath = (relativePath) => {
  if (!relativePath) return null;
  try {
    return fileURLToPath(new URL(relativePath, import.meta.url));
  } catch (error) {
    return null;
  }
};

export async function getRelatedPostsMap() {
  if (cachedRelated) {
    return cachedRelated;
  }

  const posts = await getAllPosts();
  const summaries = await Promise.all(
    posts.map(async (post) => {
      const filePath = resolveFilePath(post.frontmatter.filePath);
      let content = '';
      if (filePath) {
        const raw = await fs.readFile(filePath, 'utf8');
        const parsed = matter(raw);
        content = parsed.content || '';
      }

      return {
        slug: post.frontmatter.slug,
        title: post.frontmatter.title,
        content,
        url: post.frontmatter.slug,
      };
    })
  );

  cachedRelated = await getRelatedPosts(summaries, { maxRelated: 4, minScore: 0.6 });
  return cachedRelated;
}
