import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkInlineSvg from './src/utils/remark-inline-svg.js';
import rehypeWrapCode from './src/utils/rehype-wrap-code.js';

const remarkPlugins = [remarkGfm, remarkInlineSvg];
const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'wrap',
      properties: {
        className: ['heading-anchor'],
      },
    },
  ],
  [rehypePrismPlus, { ignoreMissing: true }],
  rehypeWrapCode,
];

export default defineConfig({
  site: 'https://www.adityathebe.com',
  publicDir: 'static',
  integrations: [
    mdx({
      remarkPlugins,
      rehypePlugins,
    }),
    react(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins,
    rehypePlugins,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'load',
  },
});
