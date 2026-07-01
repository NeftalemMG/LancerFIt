import React from 'react';
import { View, Text, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow } from '../theme/tokens';
import { disp, body } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { FACULTIES, FALLBACK, PH, fmt } from '../data/appData';
import KnightAvatar from '../components/KnightAvatar';
import { QuestGlyph, questIconColor } from '../components/Glyphs';
import { Card, PressScale, ProgressBar, SectionRow, ScreenHeader } from '../components/ui';
import { PennantIcon } from '../components/icons';
import ChallengeSheet from '../components/ChallengeSheet';

function FeaturedQuest() {
  const { player, joinTower } = useApp();
  const joined = player.joinedTower;
  return (
    <View style={styles.featured}>
      <ImageBackground source={{ uri: PH.stairs }} style={styles.featPh} imageStyle={{ resizeMode: 'cover' }}>
        <LinearGradient
          colors={['rgba(6,36,63,0.15)', 'rgba(6,36,63,0.55)', 'rgba(6,36,63,0.94)']}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.ftag}>
          <PennantIcon size={11} color={colors.gold} strokeWidth={2.4} />
          <Text style={styles.ftagText}>Featured this week</Text>
        </View>
        <View style={styles.phBody}>
          <Text style={styles.featTitle}>Tower Challenge</Text>
          <Text style={styles.featP}>Climb 50 floors on the stair machine before Sunday.</Text>
        </View>
      </ImageBackground>
      <View style={styles.lower}>
        <View style={styles.fStats}>
          <View style={styles.fStat}><Text style={styles.fStatNum}>412</Text><Text style={styles.fStatLbl}>Climbing</Text></View>
          <View style={styles.fStat}><Text style={styles.fStatNum}>500</Text><Text style={styles.fStatLbl}>XP reward</Text></View>
          <View style={styles.fStat}><Text style={styles.fStatNum}>4d</Text><Text style={styles.fStatLbl}>Left</Text></View>
        </View>
        <PressScale onPress={joinTower}>
          {joined ? (
            <View style={[styles.joinBtn, styles.joinBtnJoined]}>
              <Text style={[styles.joinText, { color: colors.text }]}>Joined · 0 / 50 floors</Text>
            </View>
          ) : (
            <LinearGradient colors={[colors.gold, colors.goldDim]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.joinBtn}>
              <Text style={styles.joinText}>Join the climb</Text>
            </LinearGradient>
          )}
        </PressScale>
      </View>
    </View>
  );
}

function ChallengeCard({ c, onPress }) {
  const { joinedChals } = useApp();
  const joined = !!joinedChals[c.id];
  return (
    <PressScale onPress={onPress} style={{ marginBottom: 12 }}>
      <View style={styles.chal}>
        <ImageBackground source={{ uri: c.img }} style={styles.chalPh} imageStyle={{ resizeMode: 'cover', backgroundColor: FALLBACK[c.type]?.[1] }}>
          <LinearGradient colors={['rgba(6,36,63,0.06)', 'rgba(6,36,63,0.78)']} style={StyleSheet.absoluteFill} />
          <View style={styles.chalType}><Text style={styles.chalTypeText}>{c.type}</Text></View>
          <View style={styles.phCap}>
            <View style={{ flex: 1 }}>
              <Text style={styles.chalTitle}>{c.title}</Text>
              <Text style={styles.chalSub}>{c.sub}</Text>
            </View>
            <View style={styles.xpb}><Text style={styles.xpbText}>+{c.xp} XP</Text></View>
          </View>
        </ImageBackground>
        <View style={styles.foot}>
          <View style={{ flexDirection: 'row' }}>
            {c.avs.map((a, idx) => (
              <View key={idx} style={[styles.avMini, idx > 0 && { marginLeft: -7 }]}>
                <KnightAvatar variant={a} plume={FACULTIES[a % 6].c} size={18} />
              </View>
            ))}
          </View>
          <Text style={styles.ftxt}>{joined ? 'Joined · ' : ''}{c.joined} Lancers joined</Text>
          <Text style={styles.goText}>{joined ? 'View →' : 'Join →'}</Text>
        </View>
      </View>
    </PressScale>
  );
}

function DailyQuestRow({ q, onPress, onClaim }) {
  const done = q.cur >= q.max;
  return (
    <PressScale onPress={onPress} style={{ marginBottom: 10 }}>
      <Card style={styles.quest}>
        <View style={[styles.qicon, q.gold ? styles.qiconGold : null]}>
          <QuestGlyph name={q.icon} color={questIconColor[q.icon] || colors.gold} size={22} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.qTitle}>{q.title}</Text>
          <Text style={styles.qSub}>{q.sub}</Text>
          <View style={{ marginTop: 9 }}>
            <ProgressBar pct={(q.cur / q.max) * 100} height={5} fillColor={done ? colors.green : colors.blue2} />
          </View>
        </View>
        {done && !q.claimed ? (
          <PressScale onPress={onClaim}>
            <LinearGradient colors={[colors.gold, colors.goldDim]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.claim}>
              <Text style={styles.claimText}>Claim +{q.xp}</Text>
            </LinearGradient>
          </PressScale>
        ) : (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.xpTag}>+{q.xp} XP</Text>
            <Text style={styles.xpTagSub}>{q.claimed ? 'Claimed' : `${q.cur}/${q.max}`}</Text>
          </View>
        )}
      </Card>
    </PressScale>
  );
}

export default function ChallengesScreen() {
  const { challenges, quests, bumpQuest, claimQuest, openSheet } = useApp();

  const openChallenge = (c) => {
    openSheet(<ChallengeSheet challenge={c} />, true);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="Challenges" subtitle="Join campus challenges and clear daily quests to bank XP." />
      <FeaturedQuest />

      <SectionRow title="Browse challenges" />
      {challenges.map((c) => (
        <ChallengeCard key={c.id} c={c} onPress={() => openChallenge(c)} />
      ))}

      <SectionRow title="Daily quests" />
      {quests.map((q) => (
        <DailyQuestRow key={q.id} q={q} onPress={() => bumpQuest(q.id)} onClaim={() => claimQuest(q.id)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 124 },

  featured: { borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.cardLine2, ...shadow.card },
  featPh: { height: 178, justifyContent: 'flex-end' },
  ftag: {
    position: 'absolute', top: 14, left: 14, flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(6,36,63,0.5)', borderWidth: 1, borderColor: colors.goldLine, paddingVertical: 7, paddingHorizontal: 11, borderRadius: 99,
  },
  ftagText: { fontFamily: body.semibold, fontSize: 10, letterSpacing: 1.2, color: colors.gold, textTransform: 'uppercase' },
  phBody: { paddingHorizontal: 18, paddingBottom: 16 },
  featTitle: { fontFamily: disp.bold, fontSize: 24, letterSpacing: -0.5, color: '#fff' },
  featP: { marginTop: 6, fontSize: 13, lineHeight: 18, color: 'rgba(238,243,250,0.82)', maxWidth: 290, fontFamily: body.regular },
  lower: { backgroundColor: 'rgba(255,255,255,0.055)', paddingHorizontal: 18, paddingTop: 16, paddingBottom: 18 },
  fStats: { flexDirection: 'row', gap: 24 },
  fStat: {},
  fStatNum: { fontFamily: disp.bold, fontSize: 19, color: colors.text },
  fStatLbl: { marginTop: 4, fontFamily: body.semibold, fontSize: 10, letterSpacing: 0.8, color: colors.text3, textTransform: 'uppercase' },
  joinBtn: { marginTop: 15, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', ...shadow.accent('rgba(216,169,74,0.6)') },
  joinBtnJoined: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: colors.cardLine2, shadowOpacity: 0, elevation: 0 },
  joinText: { fontFamily: disp.bold, fontSize: 14.5, color: colors.goldInk },

  chal: { borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.cardLine, ...shadow.card },
  chalPh: { height: 118, justifyContent: 'flex-end' },
  chalType: {
    position: 'absolute', top: 11, left: 11, backgroundColor: 'rgba(6,36,63,0.42)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    paddingVertical: 6, paddingHorizontal: 9, borderRadius: 8,
  },
  chalTypeText: { fontFamily: body.semibold, fontSize: 9.5, letterSpacing: 1, color: '#fff', textTransform: 'uppercase' },
  phCap: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, paddingHorizontal: 14, paddingBottom: 12 },
  chalTitle: { fontFamily: disp.bold, fontSize: 16, letterSpacing: -0.1, color: '#fff' },
  chalSub: { marginTop: 3, fontFamily: body.medium, fontSize: 11.5, color: 'rgba(238,243,250,0.8)' },
  xpb: { backgroundColor: 'rgba(6,36,63,0.5)', borderWidth: 1, borderColor: colors.goldLine, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 9 },
  xpbText: { fontFamily: disp.bold, fontSize: 11, color: colors.gold },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.card },
  avMini: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: colors.bg0, backgroundColor: colors.bg2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  ftxt: { flex: 1, fontFamily: body.medium, fontSize: 11.5, color: colors.text2 },
  goText: { fontFamily: disp.bold, fontSize: 12, color: colors.blue2 },

  quest: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 15, borderRadius: radius.md },
  qicon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueSoft, borderWidth: 1, borderColor: colors.blueLine },
  qiconGold: { backgroundColor: colors.goldSoft, borderColor: colors.goldLine },
  qTitle: { fontFamily: disp.semibold, fontSize: 14.5, letterSpacing: -0.1, color: colors.text },
  qSub: { marginTop: 3, fontFamily: body.regular, fontSize: 12, lineHeight: 16, color: colors.text2 },
  xpTag: { fontFamily: disp.bold, fontSize: 12, color: colors.gold },
  xpTagSub: { fontFamily: body.medium, fontSize: 9.5, color: colors.text3, marginTop: 2 },
  claim: { paddingVertical: 11, paddingHorizontal: 14, borderRadius: 12, ...shadow.accent('rgba(216,169,74,0.7)') },
  claimText: { fontFamily: disp.bold, fontSize: 12, color: colors.goldInk, textAlign: 'center' },
});
