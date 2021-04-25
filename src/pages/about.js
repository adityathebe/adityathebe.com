// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';

const IndexPage = () => (
  <Layout>
    <SEO title="About" keywords={['aditya thebe info', 'about aditya thebe']} />
    <div>
      <h1>About Me ...</h1>
      <p>
        I am a software engineer currently working remotely, from Nepal, as a Backend engineer for a startup overseas.
        I'm pretty comfortable with NodeJS but recently my interest has shifted to the Go programming language.
      </p>

      <p>
        Besides developing software, I am also interested in making them secure and finding security vulnerabilities in
        web applications. I have helped secure numerous organizations including Harvard University, Cambridge
        University, Topcoder, Mastercard, Etsy, American Airlines, Comcast, Adobe, Ford, Logitech, ...
      </p>

      <p>
        In my free time, I play <a href="https://www.chess.com/member/adityathebe">Chess</a> - in particular Speed
        Chess. I find speed chess much more entertaining than any other format of chess because of how much of a rush
        the whole game is and all the hilarious blunders I and my opponent make.
      </p>
      <p>
        I love playing guitar but certainly nowhere near as much as I used to. My friend, whose name I don't wanna
        mention, but his name is Hillihang, lost my electric guitar and since then I've transitioned into playing an
        acoustic guitar.
      </p>

      <p>I'm also a massive ArsenalFC fan. If there's an Arsenal game, you bet I'm watching it.</p>

      <p>
        I occasionally <a href="https://www.strava.com/athletes/42641291">run</a>, but nowhere near as much as I would
        like to.
      </p>
    </div>
  </Layout>
);

export default IndexPage;
