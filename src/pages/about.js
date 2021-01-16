// @ts-check
import React from 'react';

import SEO from '../components/SEO';
import Layout from '../components/Layout';

const IndexPage = () => (
  <Layout>
    <SEO title="About" keywords={['aditya thebe', 'adityathebe']} />
    <div>
      <h1>About Me ...</h1>
      <p>
        Describing myself is one of the many things that I'm terrible at. I
        know, this is pretty taxing for most of us but I, in particular, fail at
        it horribly. But heck, I'm just gonna try and come up with few words for
        the one person that's gonna read this - you !
      </p>

      <p>
        Most of the things that I like exists as 1's and 0's. I spend waayyyy
        too much time in front of my computer.
      </p>

      <p>
        I love playing guitar but certainly nowhere near as much as I used to. I
        hated playing acoustic guitars because they were much harder on my
        fingers than an electric guitar. My friend, whose name I don't wanna
        mention, lost my electric guitar and since then I've transitioned into
        playing an acoustic guitar. Just kidding - it was Hillihang Limbu who
        lost my guitar.
      </p>

      <p>
        As of recent, I have been playing a lot of{' '}
        <a href="https://www.chess.com/member/adityathebe">Chess</a> - in
        particular Speed Chess. I find speed chess much more entertaining than
        any other format of chess because of how much of a rush the whole game
        is and all the hilarious blunders I and my opponent make.
      </p>

      <p>
        I'm also a massive ArsenalFC fan. If there's a game, you bet I'm
        watching it. This also means I've to stay awake late night. Being an
        Arsenal fan is not good for my heart because of how dire the defenders
        can be sometimes.
      </p>

      <p>
        Speaking of healthy heart, I ocassionaly{' '}
        <a href="https://www.strava.com/athletes/42641291">run</a>. I run wayyy
        less than I'd like to.
      </p>
    </div>
  </Layout>
);

export default IndexPage;
