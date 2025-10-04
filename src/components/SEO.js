import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

/**
 * @param {{
 * description?: string,
 * keywords?: string[],
 * title?: string,
 * featuredImage?: string,
 * ogType?: string,
 * appendSiteTitle?: boolean,
 * }} props
 */
export function Head({ description = '', keywords = [], title = '', featuredImage = '', ogType = 'website', appendSiteTitle = true }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
        }
      }
    }
  `);

  const metaDescription = description || site.siteMetadata.description;
  const fallbackSocialImage = site.siteMetadata.siteUrl + '/images/site_featured_aditya_thebe.jpg';
  const pageTitle = title
    ? appendSiteTitle
      ? `${title} | ${site.siteMetadata.title}`
      : title
    : site.siteMetadata.title;

  return (
    <>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={featuredImage || fallbackSocialImage} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata.author} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={featuredImage || fallbackSocialImage} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(`, `)} />}
    </>
  );
}

export default Head;
