// @ts-check
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import './uses.css';

const UsesItem = props => (
  <ul className="uses-list">
    {props.items.map(({ name, description, url }, idx) => (
      <li className="uses-list-item" key={idx}>
        {url ? <a href={url}>{name}</a> : name}
        {description && ' - '}
        {description && <i>{description}</i>}
      </li>
    ))}
  </ul>
);

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query Uses {
      allDevelopmentToolsYaml {
        nodes {
          name
          description
          url
        }
      }

      allSoftwaresYaml {
        nodes {
          name
          description
          url
        }
      }

      allServicesYaml {
        nodes {
          name
          description
        }
      }

      allLaptopYaml {
        nodes {
          name
          description
        }
      }
    }
  `);

  const devToolsList = data.allDevelopmentToolsYaml.nodes;
  const sofwaresList = data.allSoftwaresYaml.nodes;
  const servicesList = data.allServicesYaml.nodes;
  const laptopSpecsList = data.allLaptopYaml.nodes;

  return (
    <Layout>
      <SEO
        title="Uses"
        keywords={['aditya thebe uses', 'aditya thebe tools']}
      />

      <h2>Development Tools</h2>
      <UsesItem items={devToolsList} />

      <h2>Softwares</h2>
      <UsesItem items={sofwaresList} />

      <h2>Services</h2>
      <UsesItem items={servicesList} />

      <h2>Laptop</h2>
      <UsesItem items={laptopSpecsList} />
    </Layout>
  );
};

export default IndexPage;
