module.exports = {
  siteMetadata: {
    title: `Aditya Thebe`,
    description: `Full Stack Web Developer`,
    author: `Aditya Thebe`,
    siteUrl: 'https://overreacted.io',
    social: {
      twitter: 'adityathebe',
      github: 'adityathebe',
    },
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
              trackingId: `UA-46064963-9`,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              icon: false,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              tracedSVG: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              inlineCodeMarker: '÷',
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `ProjectLists`,
        path: `${__dirname}/content/data/ProjectList.json`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/content/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts`,
        name: `posts`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Aditya Thebe`,
        short_name: `adityathebe`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#454545`,
        display: `standalone`,
        icon: `${__dirname}/content/images/favicon.png`,
      },
    },
  ],
};
