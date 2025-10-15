// @ts-check
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_MODEL = 'text-embedding-3-small';
const DEFAULT_CACHE_PATH = path.join(process.cwd(), 'data', 'related-posts-cache.json');
const DEFAULT_CONTENT_LENGTH_LIMIT = 10_000;
const DEFAULT_MIN_SCORE = 0.50;
const CACHE_PATH = process.env.RELATED_POST_CACHE_PATH
  ? path.resolve(process.cwd(), process.env.RELATED_POST_CACHE_PATH)
  : DEFAULT_CACHE_PATH;

/** @typedef {import('../src/types/index.js').PostForEmbedding} PostForEmbedding */
/** @typedef {import('../src/types/index.js').RelatedPost} RelatedPost */

/**
 * Load embeddings cache from disk.
 * @returns {Promise<Record<string, { hash: string; embedding: number[] }>>}
 */
async function loadCache() {
  try {
    const raw = await fs.promises.readFile(CACHE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

/**
 * Persist embeddings cache to disk.
 * @param {Record<string, { hash: string; embedding: number[] }>} cache
 */
async function saveCache(cache) {
  const directory = path.dirname(CACHE_PATH);
  await fs.promises.mkdir(directory, { recursive: true });
  await fs.promises.writeFile(CACHE_PATH, JSON.stringify(cache));
}

/**
 * Compute a stable hash for a post's embedding source content.
 * @param {PostForEmbedding} post
 */
function hashPost(post) {
  const hash = crypto.createHash('sha256');
  hash.update(post.slug);
  hash.update('\n');
  hash.update(post.title);
  hash.update('\n');
  hash.update(post.content);
  return hash.digest('hex');
}

/**
 * Retrieve an embedding vector for the given text from the OpenAI API.
 * @param {string} input
 * @param {string} apiKey
 * @param {string} [model]
 * @returns {Promise<number[]>}
 */
async function fetchEmbedding(input, apiKey, model = DEFAULT_MODEL) {
  if (!globalThis.fetch) {
    throw new Error('Global fetch API not available in Node.js runtime');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input,
      model,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI embeddings request failed (${response.status}): ${text}`);
  }

  const json = await response.json();
  /* eslint-disable-next-line camelcase */
  const embedding = json?.data?.[0]?.embedding;
  if (!Array.isArray(embedding)) {
    throw new Error('Missing embedding vector in OpenAI response');
  }
  return embedding;
}

/**
 * Compute cosine similarity between two embedding vectors.
 * @param {number[]} a
 * @param {number[]} b
 */
function cosineSimilarity(a, b) {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < length; i += 1) {
    const valA = a[i];
    const valB = b[i];
    dot += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Build the text used to generate an embedding for a post.
 * @param {PostForEmbedding} post
 */
function embeddingInput(post) {
  const trimmedContent =
    post.content.length > DEFAULT_CONTENT_LENGTH_LIMIT
      ? `${post.content.slice(0, DEFAULT_CONTENT_LENGTH_LIMIT)}...`
      : post.content;
  return `${post.title}\n\n${trimmedContent}`;
}

/**
 * Compute related posts using AI embeddings.
 * @param {PostForEmbedding[]} posts
 * @param {{ maxRelated?: number; minScore?: number }} [options]
 * @returns {Promise<Record<string, RelatedPost[]>>}
 */
async function getRelatedPosts(posts, options = {}) {
  const maxRelated = options.maxRelated ?? 4;
  const resolvedMinScore = (() => {
    const envValue = process.env.RELATED_POST_MIN_SCORE;
    if (envValue) {
      const parsed = Number.parseFloat(envValue);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
    if (options.minScore != null && Number.isFinite(options.minScore)) {
      return options.minScore;
    }
    return DEFAULT_MIN_SCORE;
  })();

  const cache = await loadCache();

  /**
   * @type {Record<string, number[]>}
   */
  const embeddings = {};
  let cacheChanged = false;
  const postsToRefresh = [];

  for (const post of posts) {
    const hash = hashPost(post);
    const cached = cache[post.slug];
    if (cached && Array.isArray(cached.embedding)) {
      embeddings[post.slug] = cached.embedding;
      if (cached.hash === hash) {
        continue;
      }
    }

    postsToRefresh.push({ post, hash });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (postsToRefresh.length > 0) {
    if (!apiKey) {
      console.warn(
        `Skipping embedding refresh for ${postsToRefresh.length} post${postsToRefresh.length === 1 ? '' : 's'}: OPENAI_API_KEY is not set.`
      );
    } else {
      const model = process.env.OPENAI_EMBEDDING_MODEL || DEFAULT_MODEL;
      for (const { post, hash } of postsToRefresh) {
        console.log(`Fetching embedding for post "${post.slug}" using model "${model}"...`);
        const embedding = await fetchEmbedding(embeddingInput(post), apiKey, model);
        cache[post.slug] = { hash, embedding };
        embeddings[post.slug] = embedding;
        cacheChanged = true;
      }
    }
  }

  if (cacheChanged) {
    await saveCache(cache);
  }

  /** @type {Record<string, RelatedPost[]>} */
  const related = {};

  for (const source of posts) {
    const sourceEmbedding = embeddings[source.slug];
    if (!sourceEmbedding) {
      console.warn(`No embedding available for post "${source.slug}", skipping related posts computation.`);
      continue;
    }

    const scored = posts
      .filter((target) => target.slug !== source.slug)
      .map((target) => {
        const targetEmbedding = embeddings[target.slug];
        const score = targetEmbedding ? cosineSimilarity(sourceEmbedding, targetEmbedding) : -1;
        return {
          slug: target.slug,
          title: target.title,
          url: target.url,
          score,
        };
      })
      .filter((item) => item.score >= resolvedMinScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRelated);

    if (scored.length !== 0) {
      console.log(
        `Related posts for "${source.slug}":`,
        scored.map((item) => `${item.slug} (${item.score.toFixed(3)})`).join(', ')
      );
      related[source.slug] = scored;
    }
  }

  return related;
}

module.exports = {
  getRelatedPosts,
  embeddingInput,
  cosineSimilarity,
};
