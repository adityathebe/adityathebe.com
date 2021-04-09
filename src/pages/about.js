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
        I am a software engineer currently working remotely, from Nepal, as a
        Backend engineer for a startup in Silicon valley. I'm pretty comfotable
        with NodeJS but recently my interest has shifted to Go programming
        language.
      </p>

      <p>
        Most of the things that I like exists as 1's and 0's. I spend waayyyy
        too much time in front of my computer.
      </p>

      <p>
        I love playing guitar but certainly nowhere near as much as I used to.
        My friend, whose name I don't wanna mention, but his name is Hillihang,
        lost my electric guitar and since then I've transitioned into playing an
        acoustic guitar.
      </p>

      <p>
        As of recent, I have been playing a lot of{' '}
        <a href="https://www.chess.com/member/adityathebe">Chess</a> - in
        particular Speed Chess. I find speed chess much more entertaining than
        any other format of chess because of how much of a rush the whole game
        is and all the hilarious blunders I and my opponent make.
      </p>

      <p>
        I'm also a massive ArsenalFC fan. If there's an Arsenal game, you bet
        I'm watching it.
      </p>

      <p>
        I ocassionaly <a href="https://www.strava.com/athletes/42641291">run</a>
        , but nowhere near as much as I would like to.
      </p>
    </div>
  </Layout>
);

export default IndexPage;
