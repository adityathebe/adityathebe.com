// @ts-check
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import SEO from '../components/SEO';
import Layout from '../components/Layout';

import Project from '../components/Portfolio/Project';

const ProjectPage = () => {
  const data = useStaticQuery(graphql`
    query Projects {
      allProjectFeaturedListYaml {
        edges {
          node {
            name
            type
            skills
            image {
              childImageSharp {
                fluid(maxWidth: 600) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            duration
            description
            demoUrl
            sourceCodeUrl
          }
        }
      }
    }
  `);
  const projectsList = data.allProjectFeaturedListYaml.edges.map(x => x.node);
  return (
    <Layout>
      <SEO
        title="Portfolio"
        keywords={['aditya thebe', 'adityathebe', 'portfolio']}
      />
      <h2>Featured Projects</h2>
      {projectsList.map((project, idx) => (
        <Project key={idx} project={project} />
      ))}
    </Layout>
  );
};

export default ProjectPage;
