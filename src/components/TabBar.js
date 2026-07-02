import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadow } from '../theme/tokens';
import { disp } from '../theme/typography';
import { HomeIcon, ChallengesIcon, RanksIcon, ProfileIcon, PlusIcon } from './icons';
import { PressScale } from './ui';

const TABS = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'quests', label: 'Challenges', Icon: ChallengesIcon },
];

const TABS_RIGHT = [
  { key: 'board', label: 'Ranks', Icon: RanksIcon },
  { key: 'profile', label: 'Profile', Icon: ProfileIcon },
];

function Tab({ tab, active, onPress }) {
  const { Icon, label } = tab;
  const color = active ? colors.gold : colors.text3;
  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <Icon size={23} color={color} strokeWidth={1.8} />
      <Text style={[styles.tl, { color }]}>{label}</Text>
    </Pressable>
  );
}

export default function TabBar({ active, onNavigate, onLog }) {
  const logActive = active === 'log';
  return (
    <View style={styles.bar}>
      {TABS.map((t) => (
        <Tab key={t.key} tab={t} active={active === t.key} onPress={() => onNavigate(t.key)} />
      ))}

      <PressScale onPress={onLog} style={styles.logWrap} scaleTo={0.94}>
        <LinearGradient
          colors={logActive ? [colors.gold, colors.gold] : [colors.gold, colors.goldDim]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={[styles.fab, logActive && styles.fabActive]}
        >
          <PlusIcon size={26} color={colors.goldInk} strokeWidth={2.6} />
        </LinearGradient>
      </PressScale>

      {TABS_RIGHT.map((t) => (
        <Tab key={t.key} tab={t} active={active === t.key} onPress={() => onNavigate(t.key)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', left: 14, right: 14, bottom: 14, zIndex: 50,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    height: 68, paddingHorizontal: 8,
    backgroundColor: 'rgba(8,38,66,0.92)',
    borderWidth: 1, borderColor: colors.cardLine2, borderRadius: 22,
    ...shadow.pop,
  },
  tab: { flex: 1, alignItems: 'center', gap: 5 },
  tl: { fontFamily: disp.semibold, fontSize: 10, letterSpacing: 0.2 },
  logWrap: { marginHorizontal: 4 },
  fab: {
    width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    transform: [{ translateY: -12 }],
    ...shadow.accent('rgba(216,169,74,0.7)'),
    borderWidth: 5, borderColor: 'rgba(8,38,66,0.6)',
  },
  fabActive: { borderColor: colors.gold + '55' },
});