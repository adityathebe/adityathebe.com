// @ts-check
import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Layout from '../components/Layout';
import { Head as SEOHead } from '../components/SEO';
import { tagSlug, tagPath, formatTagLabel } from '../utils/tags.js';
import './tags.css';

const TagsPage = () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    {
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
  allMarkdownRemark.edges.forEach((edge) => {
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
      <div className="tags-page">
        <div className="tags-header">
          <h1 className="tags-title">Explore Topics</h1>
          <p className="tags-description">
            {tags.length} {tags.length === 1 ? 'topic' : 'topics'} across all posts
          </p>
        </div>

        <ul className="tags-list">
          {tags.map((tag) => (
            <li key={tag.slug} className="tag-item">
              <Link to={tagPath(tag.displayName)} className="tag-link">
                <span className="tag-name">{tag.displayName}</span>
                <span className="tag-count">
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
