import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

/**
 * @param {{ description?: string, keywords?: string[], title?: string, featuredImage?: string }} props
 */
export function Head({ description = '', keywords = [], title = '', featuredImage = '' }) {
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
  const pageTitle = title ? `${title} | ${site.siteMetadata.title}` : site.siteMetadata.title;

  return (
    <>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="yandex-verification" content="0e3d760f663fd964" />
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={featuredImage || fallbackSocialImage} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata.author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={featuredImage || fallbackSocialImage} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(`, `)} />}
    </>
  );
}

Head.propTypes = {
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  featuredImage: PropTypes.string,
};

// Keep the old SEO component for backward compatibility during migration
function SEO({ description, meta, keywords, title, featuredImage }) {
  return null; // This component is now deprecated, use Head export instead
}

SEO.defaultProps = {
  meta: [],
  keywords: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  featuredImage: PropTypes.string,
};

export default SEO;
