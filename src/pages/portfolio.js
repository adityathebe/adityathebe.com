// @ts-check
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';

import Project from '../components/Portfolio/Project';
import './portfolio.css';

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

      allProjectMiniListYaml {
        edges {
          node {
            name
            link
            description
          }
        }
      }
    }
  `);
  const featuredProjectsList = data.allProjectFeaturedListYaml.edges.map((x) => x.node);
  const miniProjectsList = data.allProjectMiniListYaml.edges.map((x) => x.node);

  return (
    <Layout>
      <h2>Featured Projects</h2>
      {featuredProjectsList.map((project, idx) => (
        <Project key={idx} project={project} />
      ))}

      <h2 style={{ marginTop: '2em' }}>Mini Projects</h2>
      <ul className="mini-projects-ul">
        {miniProjectsList.map((project, idx) => (
          <li key={project.name}>
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <span className="mini-project-li-name">{project.name}</span>
              {' - '}
              <span className="mini-project-li-description">{project.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export const Head = () => <SEOHead title="Portfolio" keywords={['aditya thebe portfolio', 'aditya thebe projects']} />;

export default ProjectPage;
