import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, shadow, tint } from '../theme/tokens';
import { disp, body } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { FACULTIES, AVATARS } from '../data/appData';
import KnightAvatar from '../components/KnightAvatar';
import { FacultyCrest } from '../components/Glyphs';
import { PressScale } from '../components/ui';
import { PinIcon, PersonIcon, ArrowRight } from '../components/icons';

export default function OnboardingScreen({ onEnter }) {
  const { player, updatePlayer } = useApp();
  const [avatar, setAvatar] = useState(player.avatar);
  const [faculty, setFaculty] = useState(player.faculty);
  const [name, setName] = useState(player.name);

  const enter = () => {
    updatePlayer({ avatar, faculty, name: name.trim() || 'Lancer' });
    onEnter(name.trim() || 'Lancer');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top hero band */}
      <LinearGradient colors={[colors.bg2, colors.bg0]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.obTop}>
        <View style={styles.obMark}>
          <KnightAvatar variant={0} plume={colors.gold} size={38} />
        </View>
        <Text style={styles.obTitle}>LancerFit</Text>
        <Text style={styles.obTag}>Turn every workout, class and gym visit into points, badges and bragging rights.</Text>
        <View style={styles.place}>
          <PinIcon size={13} color={colors.gold} strokeWidth={2} />
          <Text style={styles.placeText}>Toldo Lancer Centre · University of Windsor</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.obBody} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Choose your knight</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 11, paddingVertical: 2, paddingHorizontal: 2 }} style={{ marginHorizontal: -2 }}>
          {AVATARS.map((nm, i) => {
            const sel = i === avatar;
            return (
              <PressScale key={nm} onPress={() => setAvatar(i)} style={[styles.avPick, sel && styles.avPickSel]}>
                <View style={{ width: 58, height: 58, alignItems: 'center', justifyContent: 'center' }}>
                  <KnightAvatar variant={i} plume={faculty.c} size={56} />
                </View>
                <Text style={[styles.avName, sel && { color: colors.gold }]}>{nm}</Text>
              </PressScale>
            );
          })}
        </ScrollView>

        <Text style={[styles.label, { marginTop: 26 }]}>Your faculty</Text>
        <View style={styles.facGrid}>
          {FACULTIES.map((f) => {
            const sel = f.id === faculty.id;
            return (
              <PressScale
                key={f.id}
                onPress={() => setFaculty(f)}
                style={[
                  styles.fac,
                  sel && { backgroundColor: tint(f.c, 0.14), borderColor: f.c },
                ]}
              >
                {sel && (
                  <View style={[styles.tick, { backgroundColor: f.c }]}>
                    <Svg width={12} height={12} viewBox="0 0 24 24">
                      <Path d="M5 12.5l5 5L19 6.5" fill="none" stroke={colors.appBg} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                )}
                <View style={[styles.crest, { borderColor: f.c, backgroundColor: sel ? tint(f.c, 0.16) : 'transparent' }]}>
                  <FacultyCrest id={f.id} color={f.c} size={21} />
                </View>
                <View style={{ flex: 10, minWidth: 0 }}>
                  <Text style={styles.fname} numberOfLines={2}>{f.name}</Text>
                  <Text style={styles.ftag} numberOfLines={1}>{f.short}</Text>
                </View>
              </PressScale>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 26 }]}>Display name</Text>
        <View style={styles.field}>
          <PersonIcon size={18} color={colors.text3} strokeWidth={2} />
          <TextInput
            value={name}
            onChangeText={setName}
            maxLength={14}
            placeholder="Your name"
            placeholderTextColor={colors.text3}
            style={styles.input}
          />
        </View>

        <PressScale onPress={enter} scaleTo={0.98} style={{ marginTop: 24 }}>
          <LinearGradient colors={[colors.blue2, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.enterBtn}>
            <Text style={styles.enterText}>Continue with UWin ID</Text>
            <ArrowRight size={17} color="#fff" strokeWidth={2.4} />
          </LinearGradient>
        </PressScale>
        <Text style={styles.ssoNote}>Sign in with your existing UWindsor username and password. No separate account needed.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  obTop: { paddingTop: 54, paddingHorizontal: 28, paddingBottom: 32, borderBottomWidth: 1, borderBottomColor: colors.cardLine },
  obMark: {
    width: 58, height: 58, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16, marginBottom: 22,
  },
  obTitle: { fontFamily: disp.bold, fontSize: 34, letterSpacing: -1, color: '#fff' },
  obTag: { marginTop: 10, fontSize: 14.5, lineHeight: 22, color: 'rgba(238,243,250,0.78)', maxWidth: 300, fontFamily: body.regular },
  place: { marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 7 },
  placeText: { fontFamily: body.semibold, fontSize: 11, letterSpacing: 1, color: colors.gold, textTransform: 'uppercase' },

  obBody: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 40 },
  label: { fontFamily: body.semibold, fontSize: 11, letterSpacing: 1.3, color: colors.text3, textTransform: 'uppercase', marginBottom: 12, marginHorizontal: 2 },

  avPick: {
    width: 88, alignItems: 'center', gap: 9, paddingVertical: 14, paddingHorizontal: 8,
    borderRadius: 16, borderWidth: 1, borderColor: colors.cardLine, backgroundColor: colors.card,
  },
  avPickSel: { borderColor: colors.goldLine, backgroundColor: colors.goldSoft },
  avName: { fontFamily: disp.semibold, fontSize: 11.5, color: colors.text2 },

  facGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  fac: {
    width: '100%', gap: 10, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 13,
    borderRadius: 16, borderWidth: 1, borderColor: colors.cardLine, backgroundColor: colors.card, overflow: 'hidden', flexShrink: 1,
  },
  tick: { position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: 99, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  crest: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  fname: { fontFamily: disp.bold, fontSize: 11.5, letterSpacing: -0.1, color: colors.text, flexShrink: 1 },
  ftag: { marginTop: 3, fontFamily: body.medium, fontSize: 10.5, color: colors.text3, flexShrink: 1, },

  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, height: 54,
    borderRadius: 14, borderWidth: 1, borderColor: colors.cardLine, backgroundColor: colors.card,
  },
  input: { flex: 1, fontFamily: disp.semibold, fontSize: 16, color: colors.text, letterSpacing: -0.2, padding: 0 },

  enterBtn: {
    height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    ...shadow.accent('rgba(47,123,196,0.8)'),
  },
  enterText: { fontFamily: disp.bold, fontSize: 15.5, color: '#fff' },
  ssoNote: { marginTop: 13, textAlign: 'center', fontSize: 12, color: colors.text3, lineHeight: 18, fontFamily: body.regular },
});
