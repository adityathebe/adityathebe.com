// @ts-check
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';

import SEO from '../../components/SEO';
import Layout from '../../components/Layout';
import './reviews.css';

const NewLayout = ({ Table, Filter }) => (
  <div>
    <Filter />
    <Table />
  </div>
);

const JustTableLayout = ({ Table }) => (
  <div>
    <Table />
  </div>
);

/**
 * TV Reviews Page Component
 * @returns {JSX.Element}
 */
const TV = () => {
  const data = useStaticQuery(graphql`
    query TvReviews {
      allTvYaml {
        nodes {
          title
          tier
          date
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
      <SEO title="TV Reviews" />

      <h2>Viewing History</h2>
      <Griddle
        data={completed}
        plugins={[plugins.LocalPlugin]}
        components={{
          Layout: NewLayout,
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
          <ColumnDefinition id="date" title="Watched" customComponent={DateFormatter} />
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
          <ColumnDefinition id="date" title="Watched" customComponent={DateFormatter} />
        </RowDefinition>
      </Griddle>
    </Layout>
  );
};

export default TV;

/**
 * Formats a date string into a more readable format.
 * @param {Object} props - Component props.
 * @param {string} props.value - The date string to format.
 * @returns {JSX.Element}
 */
const DateFormatter = ({ value }) => {
  if (!value) return <span>--</span>;

  const date = new Date(value);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  }).format(date);

  return <span>{formattedDate}</span>;
};

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
