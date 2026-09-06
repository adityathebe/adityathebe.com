# adityathebe.com

My personal blog. Visit here - [https://adityathebe.com](https://adityathebe.com)

## AI Related Posts

Set an `OPENAI_API_KEY` in your environment before running `gatsby build` or `gatsby develop` to let the build pipeline generate AI-powered related posts. Embeddings are cached in `data/related-posts-cache.json` (override with `RELATED_POST_CACHE_PATH`); remove that file or run `gatsby clean` to force regeneration. Without an API key the build will reuse cached embeddings but skip refreshing new or edited posts. Tune strictness with `RELATED_POST_MIN_SCORE` (defaults to `0.35`) or switch models via `OPENAI_EMBEDDING_MODEL`.

## Nepal travel map

The map uses checked-in SVG path data in `src/components/NepalMap/districts.json`. Gatsby renders all 77 districts in the initial HTML, so the map and native district titles are available without JavaScript. JavaScript shows district tooltips on hover, keyboard focus, or touch. Travel notes remain in `src/pages/districts-of-nepal.js`.

The original, unmodified geography is preserved in `data/nepal-districts.geojson`, outside the publicly served `static/` directory. To regenerate after changing the geography or simplification settings, run `bun run generate:nepal-map` (works in Bash and fish). Commit the generated JSON alongside those changes; normal builds do not need to regenerate it.

The generator uses topology-aware weighted simplification at 1% with `keep-shapes`, a fitted Mercator projection, and 0.1-unit SVG precision. Shared district borders are simplified together rather than independently. The resulting 48.8 KB geometry replaces the 13.97 MB GeoJSON and eliminates runtime geography fetching/projection. These are display boundaries for a travel map, not survey-grade geometry.
