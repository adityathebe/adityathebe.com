// @ts-check
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import SEO from '../components/SEO';
import Layout from '../components/Layout';

import Project from '../components/Portfolio/Project';

const ProjectPage = () => {
  const data = useStaticQuery(graphql`
    query Projects {
      allProjectListYaml {
        edges {
          node {
            name
            type
            skills
            image {
              childImageSharp {
                fixed(width: 300) {
                  ...GatsbyImageSharpFixed
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
  const projectsList = data.allProjectListYaml.edges.map(x => x.node);
  return (
    <Layout>
      <SEO
        title="Portfolio"
        keywords={['aditya thebe', 'adityathebe', 'portfolio']}
      />
      {projectsList.map((project, idx) => (
        <Project key={idx} project={project} />
      ))}
    </Layout>
  );
};

export default ProjectPage;
