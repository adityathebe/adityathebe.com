# adityathebe.com

My personal blog. Visit here - [https://adityathebe.com](https://adityathebe.com)

## AI Related Posts

Related posts are computed from OpenAI embeddings by a standalone task. After adding or editing posts, run:

```sh
OPENAI_API_KEY=... task related_posts
```

This writes `data/related-posts.json` (each post's related slugs and similarity scores), which `gatsby-node.js` reads at build time. Commit it along with the post.

Embeddings are cached in `data/related-posts-cache.json` (override with `RELATED_POST_CACHE_PATH`), keyed by post content and embedding model, so only new or edited posts are re-embedded. Delete the cache file to force a full refresh. Without an API key the task warns, keeps the old embedding for edited posts, and leaves new posts without related posts.

Tune strictness with `RELATED_POST_MIN_SCORE` (defaults to `0.6`) or switch models via `OPENAI_EMBEDDING_MODEL` (defaults to `text-embedding-3-small`; switching re-embeds every post).
