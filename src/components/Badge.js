import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../theme/tokens';
import { disp } from '../theme/typography';

// Accent color per badge — tints the frame and placeholder text.
// Sits behind PNG icons (transparent PNGs will pick this up naturally).
const ACCENT = {
  first_charge:    '#D8A94A',
  iron_week:       '#E07A5F',
  dawn_patrol:     '#D8A94A',
  pool_shark:      '#4A93D8',
  squad_captain:   '#A98BC9',
  tower_conqueror: '#4FB587',
  frost_lancer:    '#5FB0DC',
  new_heights:     '#D8A94A',
  semester_strong: '#4FB587',
  century_club:    '#FFD157',
  night_watch:     '#8FA4C0',
  the_gauntlet:    '#E08FB4',
  gold_lancer:     '#FFD157',
  silver_lancer:   '#C6CDD8',
  bronze_lancer:   '#C8884E',
};

export function badgeAccent(id) {
  return ACCENT[id] ?? colors.blue2;
}

// Two-letter initials so placeholder text is distinctive per badge.
function abbr(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('');
}

function Padlock({ size }) {
  const c = 'rgba(168,187,212,0.4)';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={4} y={11} width={16} height={11} rx={2.5} fill="none" stroke={c} strokeWidth={1.8} />
      <Path d="M8 11V8.5a4 4 0 0 1 8 0V11" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export default function Badge({ badge, size = 68 }) {
  const accent = ACCENT[badge.id] ?? colors.blue2;
  const cr = size * 0.24;
  const textSize = size * 0.27;
  const imgSize = size * 0.58;
  const lockSize = size * 0.42;
  const base = { width: size, height: size, borderRadius: cr };

  // ── Not started ─────────────────────────────────────────────
  if (!badge.isComplete && badge.progress === 0) {
    return (
      <View style={[styles.frameBase, styles.frameLocked, base]}>
        <Padlock size={lockSize} />
      </View>
    );
  }

  // ── In progress ──────────────────────────────────────────────
  if (!badge.isComplete) {
    return (
      <View style={[styles.frameBase, base, { borderColor: accent + '44', backgroundColor: accent + '14' }]}>
        {badge.icon ? (
          <Image source={badge.icon} style={{ width: imgSize, height: imgSize, opacity: 0.5 }} resizeMode="contain" />
        ) : (
          <Text style={[styles.abbr, { fontSize: textSize, color: accent + 'AA' }]}>{abbr(badge.name)}</Text>
        )}
      </View>
    );
  }

  // ── Complete ─────────────────────────────────────────────────
  return (
    <LinearGradient
      colors={[accent + '38', accent + '18']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.frameBase, base, { borderColor: accent + '66' }]}
    >
      {badge.icon ? (
        <Image source={badge.icon} style={{ width: imgSize, height: imgSize }} resizeMode="contain" />
      ) : (
        <Text style={[styles.abbr, { fontSize: textSize, color: accent }]}>{abbr(badge.name)}</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  frameBase: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  frameLocked: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(225,235,250,0.09)',
  },
  abbr: {
    fontFamily: disp.bold,
    letterSpacing: 0.5,
  },
});
