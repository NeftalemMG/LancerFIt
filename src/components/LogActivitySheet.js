import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';
import { colors, radius, shadow } from '../theme/tokens';
import { disp, body } from '../theme/typography';
import { PressScale } from './ui';
import { SportIcon } from './SportIcons';
import { AREAS, DURATIONS } from '../data/activityData';
import { ChevronLeft, CheckIcon } from './icons';

const { height: SCREEN_H } = Dimensions.get('window');

// map an area's accent key -> concrete palette colours
const ACCENTS = {
  gold:  { main: colors.gold,  soft: colors.goldSoft,  line: colors.goldLine },
  blue:  { main: colors.blue2, soft: colors.blueSoft,  line: colors.blueLine },
  green: { main: colors.green, soft: colors.greenSoft, line: colors.greenLine },
  plum:  { main: colors.plum,  soft: 'rgba(169,139,201,0.16)', line: 'rgba(169,139,201,0.4)' },
  coral: { main: colors.coral, soft: 'rgba(224,122,95,0.16)',  line: 'rgba(224,122,95,0.4)' },
};

// ---- Step-counter ring + weekly bars header (matches the screenshot) ----
const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEK_VALS = [0.7, 0.45, 0.95, 0.3, 0.8, 0.55, 0.2];
const TODAY = 4;

function StepHeader({ steps = 6320, goal = 10000 }) {
  const pct = Math.min(1, steps / goal);
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <View style={hs.wrap}>
      <View style={hs.ringCol}>
        <Svg width={92} height={92} viewBox="0 0 92 92">
          <Defs>
            <SvgGrad id="stepGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.goldDim} />
              <Stop offset="1" stopColor={colors.gold} />
            </SvgGrad>
          </Defs>
          <Circle cx={46} cy={46} r={R} stroke="rgba(255,255,255,0.10)" strokeWidth={8} fill="none" />
          <Circle
            cx={46} cy={46} r={R}
            stroke="url(#stepGrad)" strokeWidth={8} fill="none" strokeLinecap="round"
            strokeDasharray={`${C}`} strokeDashoffset={C * (1 - pct)}
            transform="rotate(-90 46 46)"
          />
        </Svg>
        <View style={hs.ringCenter}>
          <Text style={hs.ringPct}>{Math.round(pct * 100)}%</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={hs.ey}>Daily steps</Text>
        <View style={hs.stepRow}>
          <Text style={hs.stepBig}>{steps.toLocaleString('en-CA')}</Text>
          <Text style={hs.stepGoal}>/ {goal.toLocaleString('en-CA')}</Text>
        </View>
        <View style={hs.bars}>
          {WEEK_DAYS.map((d, i) => {
            const today = i === TODAY;
            return (
              <View key={i} style={hs.barCol}>
                <View style={hs.barTrack}>
                  <View style={{ height: `${Math.max(10, WEEK_VALS[i] * 100)}%`, width: '100%', borderRadius: 6, backgroundColor: today ? colors.gold : colors.blueLine }} />
                </View>
                <Text style={[hs.barDay, today && { color: colors.gold }]}>{d}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ---- main sheet ----
export default function LogActivitySheet({ onDone }) {
  // stage: 'areas' -> pick area, 'subs' -> pick activity + duration
  const [area, setArea] = useState(null);
  const [sub, setSub] = useState(null);
  const [mins, setMins] = useState(30);

  const ac = area ? ACCENTS[area.accent] : ACCENTS.gold;
  const points = mins; // 1 min = 1 point

  return (
    <View style={{ maxHeight: SCREEN_H * 0.92 }}>
      {/* header */}
      <View style={s.head}>
        {area ? (
          <PressScale onPress={() => { setArea(null); setSub(null); }} style={s.back}>
            <ChevronLeft size={20} color={colors.text} />
          </PressScale>
        ) : <View style={s.back} />}
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{area ? area.name : 'Log activity'}</Text>
          <Text style={s.sub}>
            {area ? 'Pick what you did, then your time' : 'Every minute counts · 1 min = 1 point'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {!area && <StepHeader />}

        {/* STAGE 1 — areas */}
        {!area && (
          <View style={s.grid}>
            {AREAS.map((a) => {
              const acc = ACCENTS[a.accent];
              return (
                <PressScale key={a.id} onPress={() => setArea(a)} style={s.areaCell}>
                  <View style={[s.areaCard, { borderColor: acc.line }]}>
                    <View style={[s.areaIco, { backgroundColor: acc.soft, borderColor: acc.line }]}>
                      <SportIcon name={a.icon} size={28} color={acc.main} />
                    </View>
                    <Text style={s.areaName}>{a.name}</Text>
                    <Text style={s.areaCount}>{a.subs.length} activities</Text>
                  </View>
                </PressScale>
              );
            })}
          </View>
        )}

        {/* STAGE 2 — sub-activities */}
        {area && (
          <View style={{ paddingHorizontal: 20 }}>
            {area.subs.map((sv) => {
              const on = sub?.id === sv.id;
              return (
                <PressScale key={sv.id} onPress={() => setSub(sv)} style={{ marginBottom: 9 }}>
                  <View style={[s.subRow, on && { borderColor: ac.line, backgroundColor: ac.soft }]}>
                    <View style={[s.subIco, { borderColor: ac.line, backgroundColor: on ? ac.soft : colors.card }]}>
                      <SportIcon name={sv.icon} size={22} color={ac.main} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={s.subName}>{sv.name}</Text>
                      {sv.hint ? <Text style={s.subHint}>{sv.hint}</Text> : null}
                    </View>
                    {on
                      ? <View style={[s.tick, { backgroundColor: ac.main }]}><CheckIcon size={14} color={colors.goldInk} strokeWidth={3} /></View>
                      : <View style={[s.ring, { borderColor: ac.line }]} />}
                  </View>
                </PressScale>
              );
            })}

            {/* duration + points */}
            {sub && (
              <View style={s.durBlock}>
                <Text style={s.durLbl}>How long?</Text>
                <View style={s.durRow}>
                  {DURATIONS.map((d) => {
                    const on = d === mins;
                    return (
                      <PressScale key={d} onPress={() => setMins(d)} style={s.durChipWrap}>
                        <View style={[s.durChip, on && { borderColor: ac.line, backgroundColor: ac.soft }]}>
                          <Text style={[s.durNum, on && { color: ac.main }]}>{d}</Text>
                          <Text style={[s.durUnit, on && { color: ac.main }]}>min</Text>
                        </View>
                      </PressScale>
                    );
                  })}
                </View>

                <View style={[s.pointsCard, { borderColor: ac.line }]}>
                  <LinearGradient colors={[ac.soft, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                  <Text style={s.pointsLbl}>You'll earn</Text>
                  <View style={s.pointsRow}>
                    <Text style={[s.pointsNum, { color: ac.main }]}>{points}</Text>
                    <Text style={s.pointsUnit}>points</Text>
                  </View>
                </View>

                <PressScale onPress={() => onDone({ area, sub, mins, points })} style={{ marginTop: 14 }}>
                  <LinearGradient colors={[colors.gold, colors.goldDim]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={s.cta}>
                    <Text style={s.ctaText}>Log {sub.name}</Text>
                  </LinearGradient>
                </PressScale>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const hs = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 16, marginHorizontal: 20, marginBottom: 22, padding: 16, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine },
  ringCol: { width: 92, height: 92, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ringPct: { fontFamily: disp.bold, fontSize: 19, color: colors.text },
  ey: { fontFamily: body.semibold, fontSize: 10, letterSpacing: 1.3, color: colors.text3, textTransform: 'uppercase' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 3 },
  stepBig: { fontFamily: disp.bold, fontSize: 24, letterSpacing: -0.6, color: colors.text },
  stepGoal: { fontFamily: body.medium, fontSize: 12, color: colors.text3, paddingBottom: 3 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 5, marginTop: 12, height: 46 },
  barCol: { flex: 1, alignItems: 'center', gap: 5 },
  barTrack: { width: '100%', maxWidth: 14, height: 30, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'flex-end', overflow: 'hidden' },
  barDay: { fontFamily: disp.semibold, fontSize: 9, color: colors.text3 },
});

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16 },
  back: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine },
  title: { fontFamily: disp.bold, fontSize: 21, letterSpacing: -0.4, color: colors.text },
  sub: { fontFamily: body.regular, fontSize: 12.5, color: colors.text2, marginTop: 2 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 0 },
  areaCell: { width: '50%', padding: 6 },
  areaCard: { padding: 16, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, ...shadow.card },
  areaIco: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: 12 },
  areaName: { fontFamily: disp.bold, fontSize: 15, letterSpacing: -0.2, color: colors.text },
  areaCount: { fontFamily: body.medium, fontSize: 11, color: colors.text3, marginTop: 3 },

  subRow: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 12, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine },
  subIco: { width: 42, height: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  subName: { fontFamily: disp.semibold, fontSize: 14.5, letterSpacing: -0.1, color: colors.text },
  subHint: { fontFamily: body.regular, fontSize: 11, color: colors.text3, marginTop: 2 },
  ring: { width: 22, height: 22, borderRadius: 99, borderWidth: 2 },
  tick: { width: 22, height: 22, borderRadius: 99, alignItems: 'center', justifyContent: 'center' },

  durBlock: { marginTop: 18 },
  durLbl: { fontFamily: disp.bold, fontSize: 15, color: colors.text, marginBottom: 11 },
  durRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  durChipWrap: { width: '31.5%' },
  durChip: { paddingVertical: 12, borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 4 },
  durNum: { fontFamily: disp.bold, fontSize: 17, color: colors.text },
  durUnit: { fontFamily: body.medium, fontSize: 11, color: colors.text3 },

  pointsCard: { marginTop: 16, padding: 18, borderRadius: radius.md, borderWidth: 1, overflow: 'hidden', alignItems: 'center' },
  pointsLbl: { fontFamily: body.semibold, fontSize: 11, letterSpacing: 1, color: colors.text2, textTransform: 'uppercase' },
  pointsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 7, marginTop: 5 },
  pointsNum: { fontFamily: disp.bold, fontSize: 42, lineHeight: 44, letterSpacing: -1 },
  pointsUnit: { fontFamily: disp.semibold, fontSize: 15, color: colors.text2, paddingBottom: 7 },

  cta: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', ...shadow.accent('rgba(216,169,74,0.6)') },
  ctaText: { fontFamily: disp.bold, fontSize: 15, color: colors.goldInk },
});