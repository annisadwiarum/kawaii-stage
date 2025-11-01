"use client";

import React from 'react';
import { css, keyframes } from '@emotion/react';
import charData from 'kana-svg-data/dist/hiragana/あ.json';

const draw = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

export default function Character() {
  const prefix = `z${charData.charCode}`;
  return (
    <svg viewBox="0 0 1024 1024">
      <defs>
        {charData.strokes.map(({ id }) => (
          <clipPath key={id} id={`${prefix}c${id}`}>
            <use href={`#${prefix}d${id}`} />
          </clipPath>
        ))}
      </defs>
      {charData.strokes.map(({ id, value }) => {
        return <path key={id} id={`${prefix}d${id}`} d={value} fill="#ccc" />;
      })}
      {charData.clipPaths.map(({ id, value }) => {
        return (
          <path
            key={id}
            d={value}
            clipPath={`url(#${prefix}c${id})`}
            pathLength={3333}
            css={css`
              fill: none;
              stroke: #000;
              stroke-dasharray: 3337;
              stroke-dashoffset: 3339;
              stroke-width: 128;
              stroke-linecap: round;
              animation: ${draw} 1s linear forwards;
            `}
          />
        );
      })}
    </svg>
  );
}
