import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { colors, radius } from "../theme/tokens";
import { disp, body } from "../theme/typography";
import { useApp } from "../context/AppContext";
import Badge, { badgeAccent } from "../components/Badge";
import { Card, PressScale, ProgressBar } from "../components/ui";
import { ChevronLeft } from "../components/icons";
import BadgeSheet from "../components/BadgeSheet";

export default function BadgesScreen({ goToProfile }) {
  const { openSheet, displayBadges } = useApp();

  const earnedCount = displayBadges.filter((b) => b.isComplete).length;
  const totalCount = displayBadges.length;
  const inProgressCount = displayBadges.filter(
    (b) => !b.isComplete && b.progress > 0,
  ).length;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backRow}>
        <PressScale
          onPress={goToProfile}
          style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
        >
          <ChevronLeft size={18} color={colors.text2} strokeWidth={2.4} />
          <Text style={styles.backText}>Profile</Text>
        </PressScale>
      </View>

      <View style={{ paddingBottom: 16 }}>
        <Text style={styles.h1}>Badges</Text>
        <Text style={styles.sub}>
          Unlock milestones as you train. Tap any badge to see how it's earned.
        </Text>
      </View>

      <View style={styles.grid}>
        {displayBadges.map((b) => (
          <PressScale
            key={b.id}
            onPress={() => openSheet(<BadgeSheet badge={b} />)}
            style={styles.cellWrap}
          >
            <Card style={styles.cell}>
              <Badge badge={b} size={66} />
              {!b.isComplete && b.progress > 0 && (
                <View style={styles.barWrap}>
                  <ProgressBar
                    pct={(b.progress / b.completionCriteria) * 100}
                    height={4}
                    fillColor={badgeAccent(b.id)}
                  />
                </View>
              )}
              <Text
                style={[styles.bn, !b.isComplete && { color: colors.text3 }]}
              >
                {b.name}
              </Text>
            </Card>
          </PressScale>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 124 },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
    marginBottom: 6,
  },
  backText: { fontFamily: disp.semibold, fontSize: 14, color: colors.text2 },
  h1: {
    fontFamily: disp.bold,
    fontSize: 27,
    letterSpacing: -0.5,
    color: colors.text,
  },
  sub: {
    marginTop: 7,
    color: colors.text2,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: body.regular,
  },

  bstats: { flexDirection: "row", gap: 10 },
  bstat: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    alignItems: "center",
  },
  bstatV: { fontFamily: disp.bold, fontSize: 24, color: colors.text },
  bstatK: {
    marginTop: 6,
    fontFamily: body.medium,
    fontSize: 11,
    color: colors.text2,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 },
  cellWrap: { width: (Dimensions.get("window").width - 60) / 3 },
  cell: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    gap: 0,
  },
  barWrap: { alignSelf: "stretch", marginTop: 10, marginBottom: 2 },
  bn: {
    marginTop: 9,
    fontFamily: disp.semibold,
    fontSize: 11,
    textAlign: "center",
    letterSpacing: -0.1,
    color: colors.text,
    lineHeight: 15,
  },
});
