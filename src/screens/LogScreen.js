import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { colors, radius, shadow } from '../theme/tokens';
import { disp, body } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { PressScale, ScreenHeader } from '../components/ui';
import { SportIcon } from '../components/SportIcons';
import { AREAS, DURATIONS } from '../data/activityData';
import { ChevronLeft, CheckIcon, FlameIcon } from '../components/icons';

// map an area's accent key -> concrete palette colours
const ACCENTS = {
  gold:  { main: colors.gold,  soft: colors.goldSoft,  line: colors.goldLine },
  blue:  { main: colors.blue2, soft: colors.blueSoft,  line: colors.blueLine },
  green: { main: colors.green, soft: colors.greenSoft, line: colors.greenLine },
  plum:  { main: colors.plum,  soft: 'rgba(169,139,201,0.16)', line: 'rgba(169,139,201,0.4)' },
  coral: { main: colors.coral, soft: 'rgba(224,122,95,0.16)',  line: 'rgba(224,122,95,0.4)' },
};

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEK_VALS = [0.7, 0.45, 0.95, 0.3, 0.8, 0.55, 0.2];
const TODAY = 4;

// ---- Rich daily-steps panel (ring + weekly bars + stat strip) ----
function DailySteps({ steps = 6320, goal = 10000 }) {
  const pct = Math.min(1, steps / goal);
  const R = 40;
  const C = 2 * Math.PI * R;
  // rough derived figures so the panel feels informative
  const km = (steps * 0.000762).toFixed(1);
  const kcal = Math.round(steps * 0.045);
  const activeMin = Math.round(steps / 110);

  return (
    <View style={ds.card}>
      <View style={ds.topRow}>
        <View style={ds.ringWrap}>
          <Svg width={104} height={104} viewBox="0 0 104 104">
            <Defs>
              <SvgGrad id="stepGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={colors.goldDim} />
                <Stop offset="1" stopColor={colors.gold} />
              </SvgGrad>
            </Defs>
            <Circle cx={52} cy={52} r={R} stroke="rgba(255,255,255,0.10)" strokeWidth={9} fill="none" />
            <Circle
              cx={52} cy={52} r={R}
              stroke="url(#stepGrad)" strokeWidth={9} fill="none" strokeLinecap="round"
              strokeDasharray={`${C}`} strokeDashoffset={C * (1 - pct)}
              transform="rotate(-90 52 52)"
            />
          </Svg>
          <View style={ds.ringCenter}>
            <Text style={ds.ringPct}>{Math.round(pct * 100)}%</Text>
            <Text style={ds.ringLbl}>of goal</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={ds.ey}>Daily steps</Text>
          <View style={ds.stepRow}>
            <Text style={ds.stepBig}>{steps.toLocaleString('en-CA')}</Text>
            <Text style={ds.stepGoal}>/ {goal.toLocaleString('en-CA')}</Text>
          </View>
          <View style={ds.bars}>
            {WEEK_DAYS.map((d, i) => {
              const today = i === TODAY;
              return (
                <View key={i} style={ds.barCol}>
                  <View style={ds.barTrack}>
                    <View style={{ height: `${Math.max(10, WEEK_VALS[i] * 100)}%`, width: '100%', borderRadius: 6, backgroundColor: today ? colors.gold : colors.blueLine }} />
                  </View>
                  <Text style={[ds.barDay, today && { color: colors.gold }]}>{d}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* stat strip */}
      <View style={ds.strip}>
        <View style={ds.stat}>
          <Text style={ds.statNum}>{km}</Text>
          <Text style={ds.statLbl}>km</Text>
        </View>
        <View style={ds.divider} />
        <View style={ds.stat}>
          <Text style={ds.statNum}>{kcal}</Text>
          <Text style={ds.statLbl}>kcal</Text>
        </View>
        <View style={ds.divider} />
        <View style={ds.stat}>
          <Text style={ds.statNum}>{activeMin}</Text>
          <Text style={ds.statLbl}>active min</Text>
        </View>
        <View style={ds.divider} />
        <View style={ds.stat}>
          <View style={ds.flameRow}>
            <FlameIcon size={13} color={colors.gold} />
            <Text style={[ds.statNum, { color: colors.gold }]}>12</Text>
          </View>
          <Text style={ds.statLbl}>day streak</Text>
        </View>
      </View>
    </View>
  );
}

export default function LogScreen() {
  const { addXP, toast } = useApp();
  const [area, setArea] = useState(null);
  const [sub, setSub] = useState(null);
  const [mins, setMins] = useState(30);

  const ac = area ? ACCENTS[area.accent] : ACCENTS.gold;
  const points = mins; // 1 min = 1 point

  const commit = () => {
    addXP(points);
    toast(`${sub.name} logged · +${points} pts`);
    setArea(null); setSub(null); setMins(30);
  };

  // ---------- STAGE 1: pick an area ----------
  if (!area) {
    return (
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Log activity" subtitle="Every minute counts · 1 min = 1 point" />

        <DailySteps />

        <Text style={styles.pickTitle}>Where did you train?</Text>
        <View style={styles.grid}>
          {AREAS.map((a) => {
            const acc = ACCENTS[a.accent];
            return (
              <PressScale
                key={a.id}
                onPress={() => setArea(a)}
                wrapStyle={styles.areaCell}
              >
                <View style={[styles.areaCard, { borderColor: acc.line }]}>
                  <View style={[styles.areaIco, { backgroundColor: acc.soft, borderColor: acc.line }]}>
                    <SportIcon name={a.icon} size={28} color={acc.main} />
                  </View>
                  <Text style={styles.areaName} numberOfLines={2}>{a.name}</Text>
                  <Text style={styles.areaCount}>{a.subs.length} activities</Text>
                </View>
              </PressScale>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  // ---------- STAGE 2: pick activity + duration ----------
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.head}>
        <PressScale onPress={() => { setArea(null); setSub(null); }} style={styles.back}>
          <ChevronLeft size={20} color={colors.text} />
        </PressScale>
        <View style={{ flex: 1 }}>
          <Text style={styles.headTitle}>{area.name}</Text>
          <Text style={styles.headSub}>Pick what you did, then your time</Text>
        </View>
      </View>

      {area.subs.map((sv) => {
        const on = sub?.id === sv.id;
        return (
          <PressScale key={sv.id} onPress={() => setSub(sv)} style={{ marginBottom: 10 }}>
            <View style={[styles.subRow, on && { borderColor: ac.line, backgroundColor: ac.soft }]}>
              <View style={[styles.subIco, { borderColor: ac.line, backgroundColor: on ? ac.soft : colors.card }]}>
                <SportIcon name={sv.icon} size={22} color={ac.main} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.subName}>{sv.name}</Text>
                {sv.hint ? <Text style={styles.subHint} numberOfLines={1}>{sv.hint}</Text> : null}
              </View>
              {on
                ? <View style={[styles.tick, { backgroundColor: ac.main }]}><CheckIcon size={14} color={colors.goldInk} strokeWidth={3} /></View>
                : <View style={[styles.ring, { borderColor: ac.line }]} />}
            </View>
          </PressScale>
        );
      })}

      {sub && (
        <View style={styles.durBlock}>
          <Text style={styles.durLbl}>How long?</Text>
          <View style={styles.durRow}>
            {DURATIONS.map((d) => {
              const on = d === mins;
              return (
                <PressScale key={d} onPress={() => setMins(d)} wrapStyle={styles.durCell}>
                  <View style={[styles.durChip, on && { borderColor: ac.line, backgroundColor: ac.soft }]}>
                    <Text style={[styles.durNum, on && { color: ac.main }]}>{d}</Text>
                    <Text style={[styles.durUnit, on && { color: ac.main }]}>min</Text>
                  </View>
                </PressScale>
              );
            })}
          </View>

          <View style={[styles.pointsCard, { borderColor: ac.line }]}>
            <LinearGradient colors={[ac.soft, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Text style={styles.pointsLbl}>You'll earn</Text>
            <View style={styles.pointsRow}>
              <Text style={[styles.pointsNum, { color: ac.main }]}>{points}</Text>
              <Text style={styles.pointsUnit}>points</Text>
            </View>
          </View>

          <PressScale onPress={commit} style={{ marginTop: 14 }}>
            <LinearGradient colors={[colors.gold, colors.goldDim]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.cta}>
              <Text style={styles.ctaText}>Log {sub.name}</Text>
            </LinearGradient>
          </PressScale>
        </View>
      )}
    </ScrollView>
  );
}

// bottom padding clears the floating tab bar (68 + 14 + spacing)
const BOTTOM = 124;

const ds = StyleSheet.create({
  card: { padding: 16, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine, ...shadow.card },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ringWrap: { width: 104, height: 104, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ringPct: { fontFamily: disp.bold, fontSize: 22, color: colors.text },
  ringLbl: { fontFamily: body.medium, fontSize: 9, letterSpacing: 0.6, color: colors.text3, textTransform: 'uppercase', marginTop: 1 },
  ey: { fontFamily: body.semibold, fontSize: 10, letterSpacing: 1.3, color: colors.text3, textTransform: 'uppercase' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 3 },
  stepBig: { fontFamily: disp.bold, fontSize: 26, letterSpacing: -0.6, color: colors.text },
  stepGoal: { fontFamily: body.medium, fontSize: 12, color: colors.text3, paddingBottom: 4 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 5, marginTop: 12, height: 46 },
  barCol: { flex: 1, alignItems: 'center', gap: 5 },
  barTrack: { width: '100%', maxWidth: 14, height: 30, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'flex-end', overflow: 'hidden' },
  barDay: { fontFamily: disp.semibold, fontSize: 9, color: colors.text3 },

  strip: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.cardLine },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: disp.bold, fontSize: 16, color: colors.text },
  statLbl: { fontFamily: body.medium, fontSize: 9.5, letterSpacing: 0.4, color: colors.text3, textTransform: 'uppercase', marginTop: 3 },
  divider: { width: 1, height: 26, backgroundColor: colors.cardLine },
  flameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: BOTTOM },

  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 14, paddingBottom: 18 },
  back: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine },
  headTitle: { fontFamily: disp.bold, fontSize: 23, letterSpacing: -0.5, color: colors.text },
  headSub: { fontFamily: body.regular, fontSize: 13, color: colors.text2, marginTop: 2 },

  pickTitle: { fontFamily: disp.bold, fontSize: 17, letterSpacing: -0.2, color: colors.text, marginTop: 26, marginBottom: 4 },

  // two-column grid. width lives on the Pressable via wrapStyle.
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginHorizontal: -6 },
  areaCell: { width: '50%', padding: 6 },
  areaCard: { minHeight: 150, padding: 16, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, ...shadow.card },
  areaIco: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: 14 },
  areaName: { fontFamily: disp.bold, fontSize: 16, letterSpacing: -0.2, color: colors.text, lineHeight: 20 },
  areaCount: { fontFamily: body.medium, fontSize: 11.5, color: colors.text3, marginTop: 4 },

  subRow: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 12, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine },
  subIco: { width: 42, height: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  subName: { fontFamily: disp.semibold, fontSize: 15, letterSpacing: -0.1, color: colors.text },
  subHint: { fontFamily: body.regular, fontSize: 11.5, color: colors.text3, marginTop: 2 },
  ring: { width: 24, height: 24, borderRadius: 99, borderWidth: 2 },
  tick: { width: 24, height: 24, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },

  durBlock: { marginTop: 22 },
  durLbl: { fontFamily: disp.bold, fontSize: 16, color: colors.text, marginBottom: 12 },
  // 3-col grid: each cell 1/3 width, inner chip has its own margin for the gap.
  durRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  durCell: { width: '33.333%', padding: 5 },
  durChip: { paddingVertical: 14, borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 5 },
  durNum: { fontFamily: disp.bold, fontSize: 18, color: colors.text },
  durUnit: { fontFamily: body.medium, fontSize: 12, color: colors.text3 },

  pointsCard: { marginTop: 18, padding: 20, borderRadius: radius.md, borderWidth: 1, overflow: 'hidden', alignItems: 'center' },
  pointsLbl: { fontFamily: body.semibold, fontSize: 11, letterSpacing: 1, color: colors.text2, textTransform: 'uppercase' },
  pointsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 6 },
  pointsNum: { fontFamily: disp.bold, fontSize: 46, lineHeight: 48, letterSpacing: -1.2 },
  pointsUnit: { fontFamily: disp.semibold, fontSize: 16, color: colors.text2, paddingBottom: 8 },

  cta: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', ...shadow.accent('rgba(224,168,56,0.55)') },
  ctaText: { fontFamily: disp.bold, fontSize: 16, color: colors.goldInk },
});