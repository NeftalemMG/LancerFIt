import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow } from '../theme/tokens';
import { disp, body } from '../theme/typography';
import { LB, FACULTIES, fmt } from '../data/appData';
import KnightAvatar from '../components/KnightAvatar';
import { Flag } from '../components/Glyphs';
import { Card, ScreenHeader } from '../components/ui';
import { Crown } from '../components/icons';

const TABS = ['friends', 'faculty', 'campus'];
const TAB_LABELS = { friends: 'Friends', faculty: 'Faculty', campus: 'Campus' };

const fcol = (id) => FACULTIES.find((f) => f.id === id).c;
const fname = (id) => FACULTIES.find((f) => f.id === id).name;

export default function LeaderboardScreen() {
  const [tab, setTab] = useState('friends');
  const [segWidth, setSegWidth] = useState(0);
  const pillX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const idx = TABS.indexOf(tab);
    const unit = segWidth ? (segWidth - 8) / 3 : 0;
    Animated.spring(pillX, { toValue: idx * unit, useNativeDriver: true, speed: 18, bounciness: 4 }).start();
  }, [tab, segWidth, pillX]);

  const data = LB[tab];
  const grp = tab === 'faculty';
  const top3 = data.slice(0, 3);
  const order = [1, 0, 2]; // visual slot order: 2nd, 1st, 3rd
  const heights = [58, 80, 46];

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="Leaderboard" subtitle="Resets every Sunday at midnight. Top 3 earn bonus XP." />

      {/* segmented control */}
      <View style={styles.seg} onLayout={(e) => setSegWidth(e.nativeEvent.layout.width)}>
        <Animated.View style={[styles.segPill, { width: segWidth ? (segWidth - 8) / 3 : 0, transform: [{ translateX: pillX }] }]}>
          <LinearGradient colors={[colors.gold, colors.goldDim]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
        {TABS.map((t) => (
          <Pressable key={t} style={styles.segBtn} onPress={() => setTab(t)}>
            <Text style={[styles.segText, tab === t && { color: '#2A1E04' }]}>{TAB_LABELS[t]}</Text>
          </Pressable>
        ))}
      </View>

      {/* podium */}
      <View style={styles.podium}>
        {order.map((di, slot) => {
          const e = top3[di];
          const first = di === 0;
          // 0 -> gold, 1 -> silver, 2 -> bronze (matte, theme-tuned)
          const metal = di === 0 ? colors.medalGold : di === 1 ? colors.medalSilver : colors.medalBronze;
          const metalDim = di === 0 ? colors.medalGoldDim : di === 1 ? colors.medalSilverDim : colors.medalBronzeDim;
          return (
            <View key={slot} style={styles.pcol}>
              {first && <Crown size={24} color={colors.gold} />}
              <View style={[styles.pav, { borderColor: metal + '99', backgroundColor: metal + '1F' }, first && { width: 64, height: 64 }]}>
                <KnightAvatar variant={e.av} plume={fcol(e.f)} size={first ? 52 : 42} />
                {!grp && <View style={styles.flBadge}><Flag code={e.fl} width={16} /></View>}
              </View>
              <Text style={styles.pname} numberOfLines={1}>{e.n}</Text>
              <Text style={styles.pxp}>{fmt(e.xp)} XP</Text>
              <LinearGradient
                colors={[metal + '3A', metalDim + '20']}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                style={[styles.plinth, { height: heights[slot], borderColor: metal + '66' }]}
              >
                <Text style={[styles.plinthNum, { color: metal }]}>{di + 1}</Text>
              </LinearGradient>
            </View>
          );
        })}
      </View>

      {/* ranked rows */}
      <View style={{ marginTop: 20 }}>
        {data.slice(3).map((e, i) => (
          <Card key={i} style={[styles.row, e.you && styles.rowYou]}>
            <Text style={styles.rk}>{e.rank || i + 4}</Text>
            <View style={styles.lav}>
              <KnightAvatar variant={e.av} plume={fcol(e.f)} size={32} />
              {!grp && <View style={styles.flBadge}><Flag code={e.fl} width={15} /></View>}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.nmRow}>
                <Text style={styles.nmName}>{e.n}</Text>
                {e.you && <Text style={styles.youTag}>· You</Text>}
              </View>
              <View style={styles.nmMetaRow}>
                <View style={[styles.fdot, { backgroundColor: fcol(e.f) }]} />
                <Text style={styles.nmMeta}>{grp ? 'Faculty total' : fname(e.f)}</Text>
              </View>
            </View>
            <Text style={styles.pts}>{fmt(e.xp)}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 124 },

  seg: { flexDirection: 'row', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine, borderRadius: 14, padding: 4, ...shadow.card },
  segPill: { position: 'absolute', top: 4, left: 4, bottom: 4, borderRadius: 10, overflow: 'hidden' },
  segBtn: { flex: 1, height: 38, alignItems: 'center', justifyContent: 'center' },
  segText: { fontFamily: disp.semibold, fontSize: 13, color: colors.text2 },

  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 10, marginTop: 24 },
  pcol: { flex: 1, maxWidth: 104, alignItems: 'center', gap: 7 },
  pav: { width: 52, height: 52, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  pavFirst: { width: 64, height: 64, borderColor: colors.goldLine, backgroundColor: colors.goldSoft },
  flBadge: { position: 'absolute', bottom: -3, right: -3, zIndex: 3 },
  pname: { fontFamily: disp.semibold, fontSize: 12, letterSpacing: -0.1, color: colors.text, maxWidth: 96 },
  pxp: { fontFamily: disp.semibold, fontSize: 11, color: colors.text2 },
  plinth: { marginTop: 3, width: '100%', borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardLine, borderBottomWidth: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  plinthFirst: { backgroundColor: colors.gold, borderColor: 'transparent' },
  plinthNum: { fontFamily: disp.bold, fontSize: 22, color: colors.text3 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 9, paddingVertical: 12, paddingHorizontal: 14, borderRadius: radius.md },
  rowYou: { backgroundColor: colors.goldSoft, borderColor: colors.goldLine },
  rk: { width: 24, textAlign: 'center', fontFamily: disp.bold, fontSize: 15, color: colors.text3 },
  lav: { width: 40, height: 40, borderRadius: 11, backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.cardLine, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  nmRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  nmName: { fontFamily: disp.semibold, fontSize: 14, letterSpacing: -0.1, color: colors.text },
  youTag: { fontFamily: disp.bold, fontSize: 12, color: colors.gold },
  nmMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  fdot: { width: 7, height: 7, borderRadius: 99 },
  nmMeta: { fontFamily: body.medium, fontSize: 10.5, letterSpacing: 0.4, color: colors.text3, textTransform: 'uppercase' },
  pts: { fontFamily: disp.bold, fontSize: 14, color: colors.text },
});
