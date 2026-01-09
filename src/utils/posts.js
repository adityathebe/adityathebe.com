const postImports = import.meta.glob('../../content/Posts/**/*.{md,mdx}');

let cachedPosts = null;

const normalizeCategories = (categories) => {
  if (!categories) return [];
  if (Array.isArray(categories)) {
    return categories.filter(Boolean);
  }
  if (typeof categories === 'string') {
    return [categories];
  }
  return [];
};

const normalizeDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeFrontmatter = (frontmatter = {}, filePath) => {
  const slug = frontmatter.slug || '';
  return {
    ...frontmatter,
    slug,
    categories: normalizeCategories(frontmatter.categories),
    date: normalizeDate(frontmatter.date),
    modified_date: normalizeDate(frontmatter.modified_date),
    contentType: frontmatter.contentType || '',
    filePath,
  };
};

export async function getAllPosts() {
  if (cachedPosts) {
    return cachedPosts;
  }

  const posts = await Promise.all(
    Object.entries(postImports).map(async ([filePath, resolver]) => {
      const mod = await resolver();
      const frontmatter = mod.frontmatter || mod.metadata || {};
      return {
        Content: mod.default,
        frontmatter: normalizeFrontmatter(frontmatter, filePath),
      };
    })
  );

  cachedPosts = posts
    .filter((post) => Boolean(post.frontmatter.slug))
    .sort((a, b) => {
      const aTime = a.frontmatter.date ? a.frontmatter.date.getTime() : 0;
      const bTime = b.frontmatter.date ? b.frontmatter.date.getTime() : 0;
      return bTime - aTime;
    });

  return cachedPosts;
}

export async function getPostBySlug(slug) {
  const posts = await getAllPosts();
  return posts.find((post) => post.frontmatter.slug === slug) || null;
}
