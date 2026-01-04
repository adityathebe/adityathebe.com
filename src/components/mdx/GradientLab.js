import React, { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';

const defaultStops = ['#ff6b6b', '#ffd166', '#4dabf7'];

const randomHex = () => {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  return `#${hex}`;
};

const GradientLab = () => {
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState(defaultStops);
  const [grain, setGrain] = useState(true);

  const gradient = useMemo(() => {
    return `linear-gradient(${angle}deg, ${stops.join(', ')})`;
  }, [angle, stops]);

  const backgroundImage = grain
    ? `${gradient}, repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 2px, rgba(0,0,0,0.08) 2px 4px)`
    : gradient;

  const cssSnippet = `background-image: ${backgroundImage};`;

  const updateStop = (index, value) => {
    setStops((prev) => prev.map((stop, idx) => (idx === index ? value : stop)));
  };

  const randomize = () => {
    setStops([randomHex(), randomHex(), randomHex()]);
    setAngle(Math.floor(Math.random() * 360));
  };

  const rotateStops = () => {
    setStops((prev) => [prev[1], prev[2], prev[0]]);
  };

  return (
    <section
      className="mdx-gradient-lab"
      style={{
        border: '1px solid var(--border-color-1)',
        borderRadius: '16px',
        padding: '1.25rem',
        background: 'var(--bg-color)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Gradient Lab</p>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--secondary-text-color)' }}>
            Tweak the stops, spin the angle, and copy the CSS.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={randomize}>
            Randomize
          </button>
          <button type="button" onClick={rotateStops}>
            Rotate stops
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: '1rem',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            height: '200px',
            backgroundImage,
            backgroundSize: 'cover',
            transition: 'background-image 300ms ease',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-color)',
          }}
        >
          <code style={{ fontSize: '0.85rem' }}>{cssSnippet}</code>
          <CopyButton textToCopy={cssSnippet} />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {stops.map((stop, index) => (
          <label
            key={stop + index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontSize: '0.85rem',
              color: 'var(--secondary-text-color)',
            }}
          >
            Stop {index + 1}
            <input
              type="color"
              value={stop}
              onChange={(event) => updateStop(index, event.target.value)}
              style={{ height: '38px', border: 'none', background: 'transparent' }}
            />
          </label>
        ))}
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.85rem',
            color: 'var(--secondary-text-color)',
          }}
        >
          Angle ({angle}°)
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(event) => setAngle(Number(event.target.value))}
          />
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--secondary-text-color)',
          }}
        >
          <input type="checkbox" checked={grain} onChange={(event) => setGrain(event.target.checked)} />
          Grain overlay
        </label>
      </div>
    </section>
  );
};

export default GradientLab;
