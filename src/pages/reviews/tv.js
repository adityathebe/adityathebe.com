// @ts-check
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';

import { Head as SEOHead } from '../../components/SEO';
import Layout from '../../components/Layout';
import './tv.css';

const JustTableLayout = ({ Table }) => (
  <div>
    <Table />
  </div>
);

const TV = () => {
  const data = useStaticQuery(graphql`
    query TvReviews {
      allTvYaml {
        nodes {
          title
          tier
          year
          status
          review
        }
      }
    }
  `);

  const shows = data.allTvYaml.nodes;
  const discontinued = shows.filter((show) => show.status === 'discontinued');
  const completed = shows.filter((show) => show.status !== 'discontinued');

  const sortProperties = [{ id: 'tier', sortAscending: true }];

  return (
    <Layout>
      <section className="reviews">
        <h2>Viewing History</h2>
        <Griddle
          data={completed}
          plugins={[plugins.LocalPlugin]}
          components={{
            Layout: JustTableLayout,
          }}
          sortProperties={sortProperties}
          pageProperties={{
            currentPage: 0,
            pageSize: 100,
          }}
        >
          <RowDefinition>
            <ColumnDefinition id="title" title="Name" order={1} />
            <ColumnDefinition id="tier" title="Tier" customComponent={TierFormatter} />
            <ColumnDefinition id="review" title="Review" customComponent={EmptyHandler} />
            <ColumnDefinition id="year" title="Watched" />
          </RowDefinition>
        </Griddle>

        <h1>Discontinued</h1>
        <Griddle
          data={discontinued}
          plugins={[plugins.LocalPlugin]}
          components={{
            Layout: JustTableLayout,
          }}
          sortProperties={sortProperties}
          pageProperties={{
            currentPage: 0,
            pageSize: 100, // Sets default page size to 100
          }}
        >
          <RowDefinition>
            <ColumnDefinition id="title" title="Name" order={1} />
            <ColumnDefinition id="tier" title="Tier" customComponent={TierFormatter} />
            <ColumnDefinition id="review" title="Review" customComponent={EmptyHandler} />
            <ColumnDefinition id="year" title="Watched" />
          </RowDefinition>
        </Griddle>
      </section>
      <br></br>
    </Layout>
  );
};

export default TV;

export const Head = () => <SEOHead title="TV Reviews" />;

const EmptyHandler = ({ value }) => {
  if (!value) return <span>--</span>;
  return <span>{value}</span>;
};

const TierFormatter = ({ value }) => {
  if (!value) return <span className="tier">--</span>;
  if (value < 2) {
    return <span className="tier">S</span>;
  } else if (value < 3) {
    return <span className="tier">A+</span>;
  }

  switch (value) {
    case 3:
      return <span className="tier">A</span>;

    case 4:
      return <span className="tier">A-</span>;

    case 5:
      return <span className="tier">B</span>;

    case 6:
      return <span className="tier">C</span>;

    case 7:
      return <span className="tier">D</span>;

    default:
      return <span className="tier">F</span>;
  }
};
