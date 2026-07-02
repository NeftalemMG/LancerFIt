import React, { createContext, useContext, useRef, useState, useCallback, useMemo } from 'react';
import { Animated, Easing } from 'react-native';
import { initialState, initialQuests, CHALLENGES, BADGES, USER_BADGES } from '../data/appData';

// ============================================================
// AppContext — the single source of truth for player progress,
// quests, and challenge membership. Mirrors the prototype's
// mutable `state` object plus its addXP / check-in / claim logic,
// but as proper React state so the UI re-renders.
// ============================================================

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [player, setPlayer] = useState({ ...initialState });
  const [quests, setQuests] = useState(() => initialQuests.map((q) => ({ ...q })));
  const [challenges, setChallenges] = useState(() => CHALLENGES.map((c) => ({ ...c })));
  const [joinedChals, setJoinedChals] = useState({});
  const [userBadges, setUserBadges] = useState(USER_BADGES);

  const displayBadges = useMemo(() => {
    const rowMap = {};
    userBadges.forEach((ub) => { rowMap[ub.badgeID] = ub; });

    const earnedIDs = new Set(
      BADGES.filter((b) => (rowMap[b.id]?.progress ?? 0) >= b.completionCriteria).map((b) => b.id)
    );

    const blockedIDs = new Set();
    BADGES.forEach((b) => {
      if (earnedIDs.has(b.id)) b.excludes.forEach((id) => blockedIDs.add(id));
    });

    const enriched = BADGES.map((b) => {
      const progress = rowMap[b.id]?.progress ?? 0;
      const isComplete = progress >= b.completionCriteria;
      return { ...b, progress, isComplete, isBlocked: blockedIDs.has(b.id), completedAt: rowMap[b.id]?.completedAt };
    });

    const visible = enriched.filter((b) => !b.isBlocked && (!b.secret || b.isComplete));
    const complete = visible.filter((b) => b.isComplete);
    const inProgress = visible.filter((b) => !b.isComplete && b.progress > 0);
    const notStarted = visible.filter((b) => !b.isComplete && b.progress === 0);
    return [...complete, ...inProgress, ...notStarted];
  }, [userBadges]);

  // ---- Toast ----
  const [toastMsg, setToastMsg] = useState('');
  const toastY = useRef(new Animated.Value(16)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef(null);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.timing(toastY, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 0, duration: 280, useNativeDriver: true }),
        Animated.timing(toastY, { toValue: 16, duration: 280, useNativeDriver: true }),
      ]).start();
    }, 1900);
  }, [toastOpacity, toastY]);

  // ---- Bottom sheet ----
  const [sheet, setSheet] = useState({ open: false, content: null, flush: false });
  const openSheet = useCallback((content, flush = false) => {
    setSheet({ open: true, content, flush });
  }, []);
  const closeSheet = useCallback(() => setSheet((s) => ({ ...s, open: false })), []);

  // ---- XP / level logic (ported from addXP) ----
  const addXP = useCallback((n) => {
    setPlayer((p) => {
      let xp = p.xp + n;
      let lifetime = p.lifetime + n;
      let level = p.level;
      let xpMax = p.xpMax;
      let leveledUp = false;
      if (xp >= xpMax) {
        xp -= xpMax;
        level += 1;
        xpMax = 2200;
        leveledUp = true;
      }
      if (leveledUp) {
        setTimeout(() => toast('Level up — you reached Lancer Level ' + level), 520);
      }
      return { ...p, xp, lifetime, level, xpMax };
    });
  }, [toast]);

  // ---- Check-in (ported from scan-btn handler) ----
  const checkIn = useCallback(() => {
    if (player.checkedIn) {
      toast('Already checked in today');
      return;
    }
    setPlayer((p) => ({
      ...p,
      checkedIn: true,
      streak: p.streak + 1,
      workouts: p.workouts + 1,
    }));
    addXP(75);
    setTimeout(() => {
      setPlayer((p) => {
        toast('Gym visit confirmed · +75 XP · ' + p.streak + '-day streak');
        return p;
      });
    }, 50);
  }, [player.checkedIn, addXP, toast]);

  // ---- Quest interactions ----
  const bumpQuest = useCallback((id) => {
    setQuests((qs) =>
      qs.map((q) => {
        if (q.id !== id) return q;
        if (q.claimed) {
          toast('Already claimed');
          return q;
        }
        if (q.cur < q.max) {
          const cur = q.cur + 1;
          if (cur >= q.max) toast(`${q.title} ready to claim`);
          return { ...q, cur };
        }
        return q;
      })
    );
  }, [toast]);

  const claimQuest = useCallback((id) => {
    setQuests((qs) =>
      qs.map((q) => {
        if (q.id !== id || q.claimed) return q;
        addXP(q.xp);
        toast(`Quest cleared · +${q.xp} XP`);
        return { ...q, claimed: true };
      })
    );
  }, [addXP, toast]);

  // ---- Featured Tower Challenge join (ported from btn-join) ----
  const joinTower = useCallback(() => {
    if (player.joinedTower) {
      toast("You're already in the climb");
      return;
    }
    setPlayer((p) => ({ ...p, joinedTower: true }));
    setQuests((qs) => [
      { id: 'tower-q', icon: 'flag', title: 'Tower Challenge', sub: 'Climb 50 floors at Toldo', cur: 0, max: 50, xp: 500, gold: true },
      ...qs,
    ]);
    toast('Tower Challenge joined');
  }, [player.joinedTower, toast]);

  // ---- Challenge join (ported from openChallenge) ----
  const joinChallenge = useCallback((c) => {
    if (joinedChals[c.id]) {
      closeSheet();
      return;
    }
    setJoinedChals((j) => ({ ...j, [c.id]: true }));
    setChallenges((cs) => cs.map((x) => (x.id === c.id ? { ...x, joined: x.joined + 1 } : x)));
    closeSheet();
    toast(`Joined ${c.title} · ${c.type}`);
  }, [joinedChals, closeSheet, toast]);

  const updatePlayer = useCallback((patch) => setPlayer((p) => ({ ...p, ...patch })), []);

  const value = {
    player, updatePlayer,
    quests, bumpQuest, claimQuest,
    challenges, joinedChals, joinChallenge, joinTower,
    addXP, checkIn,
    toast, toastMsg, toastY, toastOpacity,
    sheet, openSheet, closeSheet,
    displayBadges, userBadges, setUserBadges,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
