import React, { useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { colors, radius, shadow } from '../theme/tokens';
import { disp, body } from '../theme/typography';

// Glassy card surface (RN can't blur arbitrary content cheaply, so we
// emulate the frosted look with a translucent fill + hairline border).
export function Card({ style, children, ...rest }) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

// Pressable that scales to 0.97 on press, matching `.press:active`.
// IMPORTANT: layout width/flex must live on the OUTER Pressable, not the
// inner animated view, or a % width collapses to content width. Pass
// sizing via `wrapStyle`; keep visual styling (padding, bg, radius) in `style`.
export function PressScale({ children, style, wrapStyle, onPress, scaleTo = 0.97, disabled, ...rest }) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  return (
    <Pressable
      onPressIn={() => !disabled && to(scaleTo)}
      onPressOut={() => to(1)}
      onPress={disabled ? undefined : onPress}
      style={wrapStyle}
      {...rest}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

// Thin XP / quest progress bar.
export function ProgressBar({ pct, height = 5, trackColor = 'rgba(255,255,255,0.10)', fillColors, fillColor }) {
  return (
    <View style={[styles.track, { height, borderRadius: 99, backgroundColor: trackColor }]}>
      <View style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%', borderRadius: 99, backgroundColor: fillColor || colors.blue2 }} />
    </View>
  );
}

export function SectionRow({ title, action, onAction }) {
  return (
    <View style={styles.secRow}>
      <Text style={styles.secTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={styles.secAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ScreenHeader({ title, subtitle, paddingTop = 14 }) {
  return (
    <View style={{ paddingTop, paddingBottom: 16 }}>
      <Text style={styles.h1}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
    </View>
  );
}

export function Eyebrow({ children, style }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardLine,
    borderRadius: radius.md,
    ...shadow.card,
  },
  track: { width: '100%', overflow: 'hidden' },
  secRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 13, paddingHorizontal: 2 },
  secTitle: { fontFamily: disp.bold, fontSize: 17, letterSpacing: -0.2, color: colors.text },
  secAction: { fontFamily: disp.semibold, fontSize: 13, color: colors.gold },
  h1: { fontFamily: disp.bold, fontSize: 27, letterSpacing: -0.5, color: colors.text },
  sub: { marginTop: 7, color: colors.text2, fontSize: 14, lineHeight: 20, fontFamily: body.regular },
  eyebrow: { fontFamily: body.semibold, fontSize: 11, letterSpacing: 1.4, color: colors.text3, textTransform: 'uppercase' },
});