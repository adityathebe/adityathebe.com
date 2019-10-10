// @ts-check
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import SEO from '../components/SEO';
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
  const featuredProjectsList = data.allProjectFeaturedListYaml.edges.map(
    x => x.node
  );
  const miniProjectsList = data.allProjectMiniListYaml.edges.map(x => x.node);

  return (
    <Layout>
      <SEO
        title="Portfolio"
        keywords={['aditya thebe', 'adityathebe', 'portfolio']}
      />
      <h1>Featured Projects</h1>
      {featuredProjectsList.map((project, idx) => (
        <Project key={idx} project={project} />
      ))}

      <hr style={{ margin: '1.5em 0' }} />

      <h3>Mini Projects</h3>
      <ul className="mini-projects-ul">
        {miniProjectsList.map((project, idx) => (
          <li key={project.name}>
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <span className="mini-project-li-name">{project.name}</span>
              {' - '}
              <span className="mini-project-li-description">
                {project.description}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default ProjectPage;
