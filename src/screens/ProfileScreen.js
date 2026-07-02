import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, radius } from '../theme/tokens';
import { disp, body } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { fmt } from '../data/appData';
import KnightAvatar from '../components/KnightAvatar';
import { Flag } from '../components/Glyphs';
import { Card, PressScale, SectionRow } from '../components/ui';
import { SettingsIcon, ChevronRight, ShieldCheckIcon } from '../components/icons';

const SETTINGS = [
  { ic: 'edit',   label: 'Edit knight & faculty',   type: 'link' },
  { ic: 'bell',   label: 'Quest reminders',         type: 'toggle', on: true },
  { ic: 'pin',    label: 'Auto check-in at Toldo',  type: 'toggle', on: true },
  { ic: 'people', label: 'Show me on leaderboards', type: 'toggle', on: true },
  { ic: 'shield', label: 'Privacy & data (FIPPA)',  type: 'link' },
  { ic: 'out',    label: 'Sign out',                type: 'link' },
];

function Toggle({ on }) {
  return (
    <View style={[styles.toggle, on && { backgroundColor: colors.blue }]}>
      <View style={[styles.knob, on && { transform: [{ translateX: 18 }] }]} />
    </View>
  );
}

export default function ProfileScreen({ goToBadges, goToOnboarding }) {
  const { player, toast, displayBadges } = useApp();
  const earnedCount = displayBadges.filter((b) => b.isComplete).length;
  const totalCount = displayBadges.length;
  const inProgressCount = displayBadges.filter((b) => !b.isComplete && b.progress > 0).length;
  const [settings, setSettings] = React.useState(SETTINGS);

  // Progress ring math (r=57, circumference ~358.1).
  const C = 358.1;
  const offset = C * (1 - player.xp / player.xpMax);
  const rankLabel = player.level >= 8 ? `Lv ${player.level} · Knight III` : `Lv ${player.level} · Knight II`;

  const onRow = (i) => {
    const s = settings[i];
    if (s.type === 'toggle') {
      const next = settings.map((x, j) => (j === i ? { ...x, on: !x.on } : x));
      setSettings(next);
      toast(s.label + (!s.on ? ' on' : ' off'));
    } else if (s.label.includes('Edit')) {
      goToOnboarding();
    } else {
      toast(s.label);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* header */}
      <View style={styles.head}>
        <View style={styles.ring}>
          <Svg width={122} height={122} viewBox="0 0 122 122" style={StyleSheet.absoluteFill}>
            <Circle cx={61} cy={61} r={57} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} />
            <Circle
              cx={61} cy={61} r={57} fill="none" stroke={colors.gold} strokeWidth={5}
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset}
              transform="rotate(-90 61 61)"
            />
          </Svg>
          <View style={styles.profAv}>
            <KnightAvatar variant={player.avatar} plume={player.faculty.c} size={80} />
            <View style={styles.profFlag}><Flag code={player.flag} width={26} /></View>
          </View>
        </View>
        <Text style={styles.name}>{player.name}</Text>
        <View style={styles.chips}>
          <View style={styles.chip}>
            <View style={[styles.fdot, { backgroundColor: player.faculty.c }]} />
            <Text style={styles.chipText}>{player.faculty.name}</Text>
          </View>
          <View style={[styles.chip, styles.chipLv]}>
            <Text style={[styles.chipText, { color: colors.gold }]}>{rankLabel}</Text>
          </View>
        </View>
      </View>

      {/* stat grid */}
      <View style={styles.statGrid}>
        <Card style={styles.stile}>
          <Text style={[styles.stileV, { color: colors.gold }]}>{player.workouts}</Text>
          <Text style={styles.stileK}>Total workouts</Text>
        </Card>
        <Card style={styles.stile}>
          <Text style={[styles.stileV, { color: colors.blue2 }]}>{player.streak}<Text style={styles.stileSmall}> days</Text></Text>
          <Text style={styles.stileK}>Current streak</Text>
        </Card>
        <Card style={[styles.stile, styles.stileFull]}>
          <Text style={styles.stileV}>{fmt(player.lifetime)}</Text>
          <Text style={styles.stileK}>Lifetime XP earned</Text>
        </Card>
      </View>

      {/* badges link */}
      <PressScale onPress={goToBadges} style={{ marginTop: 14, marginBottom: 9 }}>
        <View style={styles.setBadges}>
          <View style={styles.setBadgesIc}>
            <ShieldCheckIcon size={20} color={colors.gold} strokeWidth={1.9} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.setBadgesTitle}>Your badges</Text>
            <Text style={styles.setBadgesSub}>{earnedCount} of {totalCount} earned · {inProgressCount} in progress</Text>
          </View>
          <ChevronRight size={16} color={colors.gold} strokeWidth={2.4} />
        </View>
      </PressScale>

      <SectionRow title="Settings" />
      {settings.map((s, i) => (
        <PressScale key={i} onPress={() => onRow(i)} style={{ marginBottom: 9 }}>
          <Card style={styles.setRow}>
            <View style={styles.si}>
              <SettingsIcon name={s.ic} size={18} color={colors.text2} strokeWidth={1.9} />
            </View>
            <Text style={styles.setLabel}>{s.label}</Text>
            {s.type === 'toggle' ? <Toggle on={s.on} /> : <ChevronRight size={15} color={colors.text3} strokeWidth={2.4} />}
          </Card>
        </PressScale>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 124 },

  head: { alignItems: 'center', paddingTop: 18, paddingBottom: 6 },
  ring: { width: 122, height: 122, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  profAv: { width: 90, height: 90, borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  profFlag: { position: 'absolute', bottom: -4, right: -4, zIndex: 3 },
  name: { fontFamily: disp.bold, fontSize: 23, letterSpacing: -0.5, color: colors.text },
  chips: { flexDirection: 'row', gap: 8, marginTop: 11, flexWrap: 'wrap', justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 99, borderWidth: 1, borderColor: colors.cardLine, backgroundColor: colors.card },
  chipLv: { backgroundColor: colors.goldSoft, borderColor: colors.goldLine },
  chipText: { fontFamily: disp.semibold, fontSize: 11, letterSpacing: 0.3, color: colors.text2, textTransform: 'uppercase' },
  fdot: { width: 8, height: 8, borderRadius: 99 },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, marginTop: 22 },
  stile: { width: '48.5%', padding: 16, borderRadius: radius.md },
  stileFull: { width: '100%' },
  stileV: { fontFamily: disp.bold, fontSize: 25, color: colors.text },
  stileSmall: { fontFamily: disp.semibold, fontSize: 13, color: colors.text3 },
  stileK: { marginTop: 6, fontFamily: body.medium, fontSize: 12, color: colors.text2 },

  setBadges: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 16, paddingHorizontal: 15, borderRadius: radius.md, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.goldLine },
  setBadgesIc: { width: 40, height: 40, borderRadius: 11, backgroundColor: 'rgba(216,169,74,0.18)', borderWidth: 1, borderColor: colors.goldLine, alignItems: 'center', justifyContent: 'center' },
  setBadgesTitle: { fontFamily: disp.semibold, fontSize: 14, color: colors.text },
  setBadgesSub: { fontFamily: body.medium, fontSize: 12, color: colors.text2, marginTop: 1 },

  setRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 15, borderRadius: radius.md },
  si: { width: 40, height: 40, borderRadius: 11, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.cardLine, alignItems: 'center', justifyContent: 'center' },
  setLabel: { flex: 1, fontFamily: disp.semibold, fontSize: 14, letterSpacing: -0.1, color: colors.text },
  toggle: { width: 44, height: 26, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.16)', justifyContent: 'center' },
  knob: { width: 20, height: 20, borderRadius: 99, backgroundColor: '#fff', marginLeft: 3 },
});
