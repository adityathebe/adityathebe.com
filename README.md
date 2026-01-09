# adityathebe.com

My personal blog. Visit here - [https://adityathebe.com](https://adityathebe.com)

## AI Related Posts

Set an `OPENAI_API_KEY` in your environment before running `astro build` or `astro dev` to let the build pipeline generate AI-powered related posts. Embeddings are cached in `data/related-posts-cache.json` (override with `RELATED_POST_CACHE_PATH`); remove that file to force regeneration. Without an API key the build will reuse cached embeddings but skip refreshing new or edited posts. Tune strictness with `RELATED_POST_MIN_SCORE` (defaults to `0.5`) or switch models via `OPENAI_EMBEDDING_MODEL`.
