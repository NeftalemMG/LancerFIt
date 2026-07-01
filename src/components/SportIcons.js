import React from 'react';
import Svg, { Path, Circle, Rect, Line, Ellipse, G } from 'react-native-svg';

// 
// SPORT ICONS — custom, hand-drawn monoline glyphs for the
// Log Activity flow. Deliberately NOT generic Lucide icons:
// each sport has its own silhouette so the catalog reads as a
// crafted set. Every icon takes { size, color, strokeWidth }.
//
// Convention: stroke-based, round caps/joins, drawn on a 24x24
// grid, currentColor driven so a single accent tints the whole
// tile. A few use a soft fill (color + '33') for depth.
// 

const S = (color, sw) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: sw,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

export function SportIcon({ name, size = 26, color = '#E9C45A', strokeWidth = 1.9 }) {
  const p = S(color, strokeWidth);
  const soft = color + '2E';

  switch (name) {
    // ---------- AREA HEADERS ----------
    case 'pool': // waves in a basin
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 17c1.6-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" {...p} />
          <Path d="M3 12.5c1.6-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" {...p} />
          <Path d="M5 9.5V6a2 2 0 0 1 2-2c1.2 0 1.8.7 2.2 1.4" {...p} />
        </Svg>
      );
    case 'dumbbell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9.5 9.5l5 5" {...p} />
          <Rect x={2.5} y={6.5} width={3.5} height={8} rx={1.4} transform="rotate(45 4.25 10.5)" fill={soft} {...p} />
          <Rect x={18} y={9.5} width={3.5} height={8} rx={1.4} transform="rotate(45 19.75 13.5)" fill={soft} {...p} />
        </Svg>
      );
    case 'group': // three figures
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={6} r={2.4} fill={soft} {...p} />
          <Path d="M8 20v-3a4 4 0 0 1 8 0v3" {...p} />
          <Circle cx={5} cy={8.5} r={1.8} {...p} />
          <Circle cx={19} cy={8.5} r={1.8} {...p} />
          <Path d="M2.5 19v-2a2.6 2.6 0 0 1 3.4-2.4M21.5 19v-2a2.6 2.6 0 0 0-3.4-2.4" {...p} />
        </Svg>
      );
    case 'court': // court with net
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x={3} y={5} width={18} height={14} rx={1.6} {...p} />
          <Path d="M12 5v14" {...p} />
          <Path d="M3 12h18" {...p} strokeDasharray="1.6 2.2" />
        </Svg>
      );
    case 'trophy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" fill={soft} {...p} />
          <Path d="M8 5H5.5a1.5 1.5 0 0 0 0 5H8M16 5h2.5a1.5 1.5 0 0 1 0 5H16" {...p} />
          <Path d="M12 12v4M9 20h6M10 20l.5-4M14 20l-.5-4" {...p} />
        </Svg>
      );

    // ---------- POOL SUBS ----------
    case 'lane': // swimmer doing laps between lane ropes
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={7} cy={7.5} r={1.8} fill={soft} {...p} />
          <Path d="M3 13c2-1.2 3.5-.4 5 .6s3 1.4 5 .2l4-2.2" {...p} />
          <Path d="M4 18h16" {...p} strokeDasharray="2 2.4" />
        </Svg>
      );
    case 'aqua': // figure in shallow water
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={5.5} r={1.9} fill={soft} {...p} />
          <Path d="M12 8v4M9 10.5l3-.5 3 .5M10 14l2-2 2 2" {...p} />
          <Path d="M3 18c1.6-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" {...p} />
        </Svg>
      );
    case 'deep': // figure with deep water lines
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={5} r={1.8} fill={soft} {...p} />
          <Path d="M12 7.5v4l-2.5 2M12 11.5l2.5 2M9 9.5l3-.6 3 .6" {...p} />
          <Path d="M3 16.5c1.6-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" {...p} />
          <Path d="M3 20c1.6-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" {...p} />
        </Svg>
      );
    case 'leisure': // sun over water
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={8} r={3.2} fill={soft} {...p} />
          <Path d="M12 2.5v1.6M18 8h1.6M4.4 8H6M16.2 3.8l-1.1 1.1M8.9 5 7.8 3.9" {...p} />
          <Path d="M3 18c1.6-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" {...p} />
        </Svg>
      );
    case 'recswim': // playful splash
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={9} cy={7} r={1.9} fill={soft} {...p} />
          <Path d="M4.5 12.5c2-1 3.5 0 5 .8s3 1.2 5 0l4-2" {...p} />
          <Path d="M17 5l.8 1.6 1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.3L17 5Z" fill={soft} {...p} />
          <Path d="M4 17.5h16" {...p} strokeDasharray="2 2.4" />
        </Svg>
      );
    case 'lessons': // figure + guiding hand
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={8} cy={7} r={1.8} fill={soft} {...p} />
          <Path d="M4.5 12c2-.8 3.4 0 4.8.8s2.8 1 4.2.2" {...p} />
          <Path d="M15 6.5c1.6 0 2.6 1 2.8 2.5M19 5.5c2.2 0 3.4 1.6 3.5 3.8" {...p} />
          <Path d="M4 17h16" {...p} strokeDasharray="2 2.4" />
        </Svg>
      );

    // ---------- FITNESS SUBS ----------
    case 'treadmill':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 18h13l2-9" {...p} />
          <Circle cx={5} cy={18} r={1.2} fill={color} />
          <Circle cx={16} cy={18} r={1.2} fill={color} />
          <Path d="M19 9h2M16 4.5a1.4 1.4 0 1 0 0-.01" fill={soft} {...p} />
          <Path d="M13 7l2 2 1.5-1 1.5 1.5" {...p} />
          <Path d="M13 9l-2.5 1.5L12 13l-1 4M12 13l2.5 1.5" {...p} />
        </Svg>
      );
    case 'barbell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 12h12" {...p} />
          <Path d="M4 8v8M6.5 9.5v5M17.5 9.5v5M20 8v8" {...p} />
        </Svg>
      );
    case 'stretch': // figure reaching toward toes
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={7} cy={6} r={1.8} fill={soft} {...p} />
          <Path d="M7 8v4l5 1M7 12l-1 6M12 13l8 1M12 13l-1 5" {...p} />
        </Svg>
      );
    case 'boxing': // boxing glove with thumb
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M7 8a4 4 0 0 1 4-4h2.5A4.5 4.5 0 0 1 18 8.5V13a3 3 0 0 1-3 3H9a2 2 0 0 1-2-2V8Z" fill={soft} {...p} />
          <Path d="M7 9.5H5.2a1.7 1.7 0 0 0 0 3.4H7" {...p} />
          <Path d="M9 16v1.6a1.4 1.4 0 0 0 1.4 1.4h3.2a1.4 1.4 0 0 0 1.4-1.4V16" {...p} />
          <Path d="M11 8v4" {...p} />
        </Svg>
      );

    // ---------- GROUP SUBS ----------
    case 'spin': // exercise bike
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={6} cy={17} r={3.2} {...p} />
          <Circle cx={18} cy={17} r={3.2} {...p} />
          <Path d="M6 17l3-7h5M14 10l4 7M9 10h6l-1.5 4M12 6h3" {...p} />
        </Svg>
      );
    case 'bootcamp': // boot / drill
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 4v9h6l5 4v3H6a2 2 0 0 1-2-2V4Z" fill={soft} {...p} />
          <Path d="M6 13h6M9 4v9" {...p} />
        </Svg>
      );
    case 'hyrox': // sled push
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={7} cy={6} r={1.7} fill={soft} {...p} />
          <Path d="M7 8v3l-3 2M7 11l3 1 1 4" {...p} />
          <Path d="M13 14h7M16 14v-3h4v3M16 17h4" {...p} />
        </Svg>
      );
    case 'yoga': // seated lotus meditation
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={5} r={2} fill={soft} {...p} />
          <Path d="M12 7.5v3" {...p} />
          <Path d="M12 10.5c-2.4 0-4.4 1.2-5.2 3.2M12 10.5c2.4 0 4.4 1.2 5.2 3.2" {...p} />
          <Path d="M4.5 17.5c2-1.4 4.4-1.4 7.5-1.4s5.5 0 7.5 1.4" {...p} />
          <Path d="M6.8 13.7c-.8 1-1 2.4-.6 3.8M17.2 13.7c.8 1 1 2.4.6 3.8" {...p} />
        </Svg>
      );
    case 'zumba': // dancer
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={13} cy={5} r={1.8} fill={soft} {...p} />
          <Path d="M13 7l-1 4 3 3M12 11l-3 2-1 5M14 14l1 5M15 8l3-1" {...p} />
        </Svg>
      );
    case 'karate': // belt / stance
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M7 4l5 4 5-4M12 8v6M7 14h10l-2 6H9l-2-6Z" fill={soft} {...p} />
          <Path d="M7 14l-1.5 2M17 14l1.5 2" {...p} />
        </Svg>
      );

    // ---------- COURTS SUBS ----------
    case 'paddle': // pickleball / table-tennis paddle + ball
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Ellipse cx={10} cy={9} rx={5.5} ry={6} fill={soft} {...p} />
          <Path d="M8 14L6.5 20" {...p} />
          <Path d="M5 18.5l3 .8" {...p} />
          <Circle cx={18} cy={15} r={1.6} {...p} />
        </Svg>
      );
    case 'shuttle': // badminton shuttlecock
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={17} r={2.4} fill={soft} {...p} />
          <Path d="M10 15L7 5M14 15l3-10M10.5 15.5l1.5-11 1.5 11M7 5h10M8.5 9h7" {...p} />
        </Svg>
      );
    case 'volleyball':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={8} {...p} />
          <Path d="M12 4c-3 4-3 11 0 16M12 4c3 4 3 11 0 16M4.5 9c4 1.5 11 1.5 15 0M5 16c3.5-2 10.5-2 14 0" {...p} />
        </Svg>
      );
    case 'basketball':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={8} {...p} />
          <Path d="M12 4v16M4 12h16M6.3 6.3c3 2.4 3 9 0 11.4M17.7 6.3c-3 2.4-3 9 0 11.4" {...p} />
        </Svg>
      );
    case 'track': // running figure over an oval track
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Ellipse cx={12} cy={18} rx={9} ry={3.4} {...p} />
          <Circle cx={14} cy={5} r={1.8} fill={soft} {...p} />
          <Path d="M14 7l-2 3 2.5 2 .5 3" {...p} />
          <Path d="M12 10l-3 .5M14.5 12l2.5-1" {...p} />
          <Path d="M12 13l-2 2.5" {...p} />
        </Svg>
      );

    // ---------- INTRAMURAL SUBS ----------
    case 'soccer':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={8} {...p} />
          <Path d="M12 8.5l3 2.2-1.1 3.5h-3.8L9 10.7 12 8.5Z" fill={soft} {...p} />
          <Path d="M12 4v4.5M5 9.5l4 1.2M19 9.5l-4 1.2M7.5 18l2.6-3.8M16.5 18l-2.6-3.8" {...p} />
        </Svg>
      );
    case 'football': // american football
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M5 12c0-4 3-7 7-7s7 3 7 7-3 7-7 7-7-3-7-7Z" transform="rotate(-30 12 12)" fill={soft} {...p} />
          <Path d="M9.5 12h5M11 10.5v3M12.5 10.2v3.6M13.5 11v2" {...p} />
        </Svg>
      );

    default: // generic activity dot fallback
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={7} fill={soft} {...p} />
          <Path d="M12 8v4l3 2" {...p} />
        </Svg>
      );
  }
}