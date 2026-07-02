import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/tokens';
import { disp, body } from '../theme/typography';
import Badge from './Badge';
import { ProgressBar } from './ui';

export default function BadgeSheet({ badge: b }) {
  return (
    <View style={styles.wrap}>
      <Badge badge={b} size={112} />
      <Text style={styles.h3}>{b.name}</Text>
      <Text style={styles.desc}>{b.desc}</Text>
      {b.isComplete ? (
        <View style={styles.earnedTag}>
          <Svg width={13} height={13} viewBox="0 0 24 24">
            <Path d="M5 12.5l5 5L19 6.5" fill="none" stroke={colors.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.earnedText}>Earned{b.completedAt ? ` · ${b.completedAt}` : ''}</Text>
        </View>
      ) : (
        <>
          <View style={{ alignSelf: 'stretch', marginTop: 18 }}>
            <ProgressBar pct={(b.progress / b.completionCriteria) * 100} height={8} fillColor={colors.gold} />
          </View>
          <Text style={styles.barLabel}>{b.progress} / {b.completionCriteria}</Text>
          <View style={[styles.earnedTag, styles.lockedTag]}>
            <Svg width={12} height={12} viewBox="0 0 24 24">
              <Path d="M5 11h14v9H5z" fill="none" stroke={colors.text3} strokeWidth={2.4} />
              <Path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke={colors.text3} strokeWidth={2.4} />
            </Svg>
            <Text style={[styles.earnedText, { color: colors.text3 }]}>Locked</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 26, paddingTop: 4, paddingBottom: 10 },
  h3: { fontFamily: disp.bold, fontSize: 21, letterSpacing: -0.5, marginTop: 14, color: colors.text },
  desc: { marginTop: 10, color: colors.text2, fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 280, fontFamily: body.regular },
  earnedTag: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 18, paddingVertical: 9, paddingHorizontal: 16, borderRadius: 99, backgroundColor: colors.greenSoft, borderWidth: 1, borderColor: colors.greenLine },
  lockedTag: { backgroundColor: colors.card, borderColor: colors.cardLine, marginTop: 14 },
  earnedText: { fontFamily: disp.bold, fontSize: 12, letterSpacing: 0.4, color: colors.green },
  barLabel: { marginTop: 8, fontFamily: disp.semibold, fontSize: 12, color: colors.text2 },
});
