// @ts-check
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import SEO from '../components/SEO';
import Layout from '../components/Layout';

import Project from '../components/Portfolio/Project';

const ProjectPage = () => {
  const data = useStaticQuery(graphql`
    {
      allProjectListJson {
        edges {
          node {
            name
            type
            skills
            image
            duration
            description
          }
        }
      }
    }
  `);
  const projectsList = data.allProjectListJson.edges.map(x => x.node);
  return (
    <Layout>
      <SEO
        title="Home"
        keywords={['aditya thebe', 'adityathebe', 'portfolio']}
      />
      {projectsList.map((project, idx) => (
        <Project key={idx} project={project} />
      ))}
    </Layout>
  );
};

export default ProjectPage;
