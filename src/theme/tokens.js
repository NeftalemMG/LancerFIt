// LANCERFIT · WINDSOR BLUE EDITION — design tokens
// Deep Windsor navy field, warm matte ochre, knight crests.

export const colors = {
  // deep blue field — saturated Windsor navy
  bg0: '#031b31', // darkest base
  bg1: '#022140', 
  bg2: '#042b55', 
  fieldWarm: '#062b50', 
  appBg: '#0A3158', // body background behind the phone

  // translucent surfaces over the navy
  card: 'rgba(255,255,255,0.055)',
  card2: 'rgba(255,255,255,0.085)',
  cardLine: 'rgba(225,235,250,0.12)',
  cardLine2: 'rgba(225,235,250,0.20)',

  // ink on dark
  text: '#EEF3FA',
  text2: '#A8BBD4',
  text3: '#6E84A4',

  // brand accents
  blue: '#2F7BC4',
  blue2: '#4A93D8',
  blueSoft: 'rgba(47,123,196,0.18)',
  blueLine: 'rgba(74,147,216,0.34)',

  // varsity amber — warmer + brighter to match the date-pill yellow (#FFD157),
  // still matte (no gloss). gold = highlight, goldDim = pressed/darker stop.
  gold: '#FFD157',
  goldDim: '#E0A838',
  goldSoft: 'rgba(255,209,87,0.14)',
  goldLine: 'rgba(255,209,87,0.34)',
  goldInk: '#2A1E04', // text that sits on gold

  // leaderboard podium metals — matte, theme-tuned (no shine):
  // 1st leans into the varsity amber/gold, 2nd a cool steel silver,
  // 3rd a warm bronze that still reads against the navy.
  medalGold: '#FFD157',
  medalGoldDim: '#D9A638',
  medalSilver: '#C6CDD8',
  medalSilverDim: '#9AA6B5',
  medalBronze: '#C8884E',
  medalBronzeDim: '#9A6536',

  green: '#4FB587',
  greenSoft: 'rgba(79,181,135,0.16)',
  greenLine: 'rgba(79,181,135,0.4)',
  coral: '#E07A5F',
  plum: '#A98BC9',

  white: '#FFFFFF',
};

export const radius = {
  lg: 22,
  md: 16,
  sm: 12,
};

// React Native shadow approximations of the CSS box-shadows.
export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  pop: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  accent: (rgba) => ({
    shadowColor: rgba,
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  }),
};

// Faculty-tint helper that mimics the prototype's
// color-mix(in srgb, currentColor 14%, transparent).
export function tint(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
