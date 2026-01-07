// @ts-check
import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Layout from '../components/Layout';
import { Head as SEOHead } from '../components/SEO';
import { tagSlug, tagPath, formatTagLabel } from '../utils/tags.js';

const TagsPage = () => {
  const { allMdx, allMarkdownRemark } = useStaticQuery(graphql`
    {
      allMdx(filter: { internal: { contentFilePath: { regex: "/content/(Posts|WeeklyJournal)/" } } }) {
        edges {
          node {
            frontmatter {
              categories
            }
          }
        }
      }
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/content/(Posts|WeeklyJournal)/" } }) {
        edges {
          node {
            frontmatter {
              categories
            }
          }
        }
      }
    }
  `);

  // Aggregate tags and count posts
  const tagCounts = {};
  const mdxEdges = allMdx?.edges || [];
  const markdownEdges = allMarkdownRemark?.edges || [];

  [...mdxEdges, ...markdownEdges].forEach((edge) => {
    const categories = edge.node.frontmatter.categories || [];
    categories.forEach((category) => {
      if (!category) return;
      const slug = tagSlug(category);
      if (!slug) return;

      if (!tagCounts[slug]) {
        tagCounts[slug] = {
          slug,
          displayName: formatTagLabel(category),
          count: 0,
        };
      }
      tagCounts[slug].count += 1;
    });
  });

  // Convert to array and sort by count (descending)
  const tags = Object.values(tagCounts).sort((a, b) => b.count - a.count);

  return (
    <Layout>
      <div className="py-4">
        <div className="text-center mb-6 max-[450px]:mb-8">
          <h1 className="text-4xl max-[450px]:text-3xl m-0 mb-2 text-[var(--primary-color)] font-black">
            Explore Topics
          </h1>
          <p className="text-[var(--secondary-text-color)] text-lg max-[450px]:text-base m-0">
            {tags.length} {tags.length === 1 ? 'topic' : 'topics'} across all posts
          </p>
        </div>

        <ul className="list-none m-0 p-0 max-w-[600px] mx-auto">
          {tags.map((tag) => (
            <li key={tag.slug} className="border-b border-[var(--border-color-1)] last:border-b-0">
              <Link
                to={tagPath(tag.displayName)}
                className="group flex justify-between items-center py-2 no-underline transition-all duration-200 relative text-inherit hover:text-inherit visited:text-inherit active:text-inherit before:content-[''] before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-0 before:bg-[var(--primary-color)] before:transition-all before:duration-200 before:rounded-sm hover:before:h-[60%]"
              >
                <span className="text-base font-semibold text-[var(--primary-text-color)] font-['JetBrains_Mono',sans-serif] tracking-tight transition-all duration-200 group-hover:text-[var(--primary-color)] group-hover:translate-x-2">
                  {tag.displayName}
                </span>
                <span className="text-[0.85em] text-[var(--secondary-text-color)] font-['JetBrains_Mono',sans-serif]">
                  {tag.count} {tag.count === 1 ? 'post' : 'posts'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export const Head = () => (
  <SEOHead
    title="Topics"
    description="Explore all topics and tags from Aditya Thebe's blog"
    keywords={['topics', 'tags', 'categories', 'blog']}
  />
);

export default TagsPage;
