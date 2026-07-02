import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/tokens';
import { disp, body } from '../../theme/typography';
import { ShieldCheckIcon } from '../icons';

export default function AuthHeader({ title, subtitle, note }) {
  const { height } = useWindowDimensions();
  const heroHeight = Math.max(170, Math.round(height * 0.25));

  return (
    <LinearGradient
      colors={[colors.bg2, colors.bg0]}
      start={{ x: 0.12, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.hero, { minHeight: heroHeight }]}
    >
      <View style={styles.heroInner}>
        <View style={styles.mark}>
          <ShieldCheckIcon size={22} color={colors.gold} strokeWidth={1.9} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.note}>{note}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 24,
    paddingHorizontal: 28,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardLine,
    justifyContent: 'flex-end',
  },
  heroInner: {
    gap: 0,
  },
  mark: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontFamily: disp.bold,
    fontSize: 32,
    letterSpacing: -0.9,
    color: '#fff',
  },
  subtitle: {
    marginTop: 9,
    fontFamily: body.regular,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(238,243,250,0.78)',
    maxWidth: 320,
  },
  note: {
    marginTop: 16,
    fontFamily: body.semibold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.gold,
    textTransform: 'uppercase',
  },
});
