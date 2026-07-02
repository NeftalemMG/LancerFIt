import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../theme/tokens';
import { disp } from '../theme/typography';
import { useApp } from '../context/AppContext';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import BadgesScreen from '../screens/BadgesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LogScreen from '../screens/LogScreen';

import TabBar from './TabBar';
import { Toast, Sheet } from './Overlays';

export default function AppShell() {
  const { addXP, toast, openSheet, closeSheet, updatePlayer } = useApp();
  const [screen, setScreen] = useState('onboard');
  const [tabbarVisible, setTabbarVisible] = useState(false);

  // Onboarding -> Home, reveal tab bar.
  const enterApp = (name) => {
    setScreen('home');
    setTabbarVisible(true);
    setTimeout(() => toast(`Welcome to LancerFit, ${name}`), 520);
  };

  const navigate = (key) => setScreen(key);

  const openLog = () => setScreen('log');

  const renderScreen = () => {
    switch (screen) {
      case 'onboard':
        return <OnboardingScreen onEnter={enterApp} />;
      case 'home':
        return <HomeScreen goToQuests={() => navigate('quests')} />;
      case 'quests':
        return <ChallengesScreen />;
      case 'log':
        return <LogScreen />;
      case 'board':
        return <LeaderboardScreen />;
      case 'badges':
        return <BadgesScreen goToProfile={() => navigate('profile')} />;
      case 'profile':
        return (
          <ProfileScreen
            goToBadges={() => navigate('badges')}
            goToOnboarding={() => { setScreen('onboard'); setTabbarVisible(false); }}
          />
        );
      default:
        return null;
    }
  };

  // The active key used to highlight tabs (badges maps to profile group).
  const activeTab = screen === 'badges' ? 'profile' : screen;

  return (
    <View style={styles.phone}>
      <LinearGradient
        colors={[colors.bg1, colors.bg0, colors.bg0]}
        locations={[0, 0.62, 1]}
        style={StyleSheet.absoluteFill}
      />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* {screen !== 'onboard' && <StatusBarRow />} */}
        <View style={{ flex: 1 }}>{renderScreen()}</View>
      </SafeAreaView>

      {tabbarVisible && <TabBar active={activeTab} onNavigate={navigate} onLog={openLog} />}
      <Toast />
      <Sheet />
    </View>
  );
}

const styles = StyleSheet.create({
  phone: { flex: 1, backgroundColor: colors.appBg },
  statusbar: { height: 36, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 30, paddingBottom: 7 },
  clock: { fontFamily: disp.semibold, fontSize: 14, color: colors.text },
  sig: { flexDirection: 'row', gap: 6, alignItems: 'center' },
});