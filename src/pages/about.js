// @ts-check
import React from 'react';

import { Head as SEOHead } from '../components/SEO';
import Layout from '../components/Layout';

const IndexPage = () => (
  <Layout>
    <div className="post-content">
      <h1 id="page-title">👨🏻‍💻 About Me</h1>
      <p>Hey, I am Aditya, a software engineer From Nepal.</p>

      <p>
        At the moment, I&apos;m enjoying building a Kubernetes Native Internal Developer Platform at{' '}
        <a href="https://www.flanksource.com">Flanksource</a>.
      </p>

      <p>
        Besides developing software, I am also interested in making them secure and finding security vulnerabilities in
        web applications. I have helped secure numerous organizations including Harvard University, Cambridge
        University, Topcoder, Mastercard, Etsy, American Airlines, Comcast, Adobe, Ford, Logitech, ...
      </p>

      <p>
        In my free time, I play <a href="https://lichess.org/@/thebeaditya/all">Chess</a> - in particular Speed Chess. I
        find speed chess much more entertaining than any other format of chess because of how much of a rush the whole
        game is and all the hilarious blunders I and my opponent make.
      </p>

      <p>
        I <b>used</b> to play Guitar a lot but I don&apos;t have the time and passion for it as much these days.
      </p>

      <p>I&apos;m also a massive Arsenal FC fan. If there&apos;s an Arsenal game, you bet I&apos;m watching it.</p>

      <p>
        I used to <a href="https://www.strava.com/athletes/42641291">run</a>, but now I{' '}
        <a href="https://hevy.com/user/adityathebe">workout</a> instead with an occasional cardio session.
      </p>
    </div>
  </Layout>
);

export const Head = () => <SEOHead title="About" keywords={['aditya thebe info', 'about aditya thebe']} />;

export default IndexPage;
