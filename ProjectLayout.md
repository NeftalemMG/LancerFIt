## LancerFit

A gamified fitness app for the University of Windsor's Toldo Lancer Centre (TLC).
Students log activity, earn points (1 minute = 1 point), clear daily quests, join
challenges, and climb faculty and campus leaderboards. Built with Expo / React Native.

Scoring: every minute of physical activity is worth 1 point. Facility-exploration
bonuses (visiting multiple areas, attendance streaks, monthly challenges) award flat
point totals on top.

### Run it

```bash
npm install
npx expo start
```

Then open in Expo Go, or run `npx expo start --ios` / `--android`.

### Stack

Expo SDK 54, React Native 0.81, react-native-svg (all icons and crests are
hand-drawn SVG, no icon library), expo-linear-gradient, react-native-safe-area-context,
and @expo-google-fonts for the display typefaces. State is a single React context, no
backend yet: all data lives in `src/data/` with shapes the backend can later mirror.

### Project layout

```
App.js                 App entry: loads fonts, mounts providers, hands off to AppShell
app.json               Expo config (name, icons, splash)
babel.config.js        Babel preset (babel-preset-expo)

src/
  theme/
    tokens.js           All colours, radii, shadows. Single source of truth for the
                        navy/gold palette. Change colours here and the whole app follows.
    typography.js       Font setup. DISPLAY_FONT (one line) swaps the display face
                        between Space Grotesk and the gaming options. Body stays Inter.

  data/
    appData.js          Static seed data: player profile, faculties, quests, challenges,
                        leaderboards, badges. The backend contract to build against.
    activityData.js     The TLC activity catalog used by the Log screen: five areas
                        (Pool, Fitness Centre, Group Fitness, Open Rec and Courts,
                        Intramural Leagues), their sub-activities, bonus point rules,
                        and the duration presets.

  context/
    AppContext.js       Global state and actions: XP/level math, check-in, quest
                        bump/claim, challenge join, toast messages, bottom-sheet control.

  components/
    AppShell.js         Top-level layout and screen router. Holds the current screen,
                        the background gradient, the tab bar, toast, and sheet host.
    TabBar.js           Floating bottom tab bar with the centre Log (+) button.
    ui.js               Shared primitives: Card, PressScale (press-to-scale wrapper),
                        ProgressBar, SectionRow, ScreenHeader, Eyebrow.
    icons.js            Monoline UI icons (home, plus, pin, check, crown, chevrons).
    Glyphs.js           Faculty crests, country flags, and quest activity glyphs.
    SportIcons.js       Custom sport icons for the Log screen (basketball, soccer, spin,
                        yoga, boxing, etc). One SVG per sport, tinted by area accent.
    KnightAvatar.js     The procedural knight avatar used across profiles and boards.
    Overlays.js         Toast and the bottom-sheet host used by challenge detail.
    ChallengeSheet.js   Challenge detail content shown in the bottom sheet.
    Badge.js            Single badge shape renderer (shield, hex, medal, star).
    BadgeSheet.js       Badge detail content shown in the sheet.

  screens/
    OnboardingScreen.js Name entry / first launch, then enters the app.
    HomeScreen.js       Dashboard: greeting, XP hero, check-in, today's quests, week graph.
    LogScreen.js        Full-page activity logging. Daily-steps panel (ring + weekly bars
                        + stat strip), pick an area, pick an activity, pick a duration,
                        see live points, confirm. This is the centre-tab (+) destination.
    ChallengesScreen.js Featured challenge, browse challenges, daily quests.
    LeaderboardScreen.js Friends / Faculty / Campus boards with a gold/silver/bronze podium.
    BadgesScreen.js     Earned and in-progress badges.
    ProfileScreen.js    Player profile, stats, settings rows.

assets/                 App icon, splash, favicon.
```

### Where to change common things

- Colours: `src/theme/tokens.js` (the `colors` object).
- Display font: `src/theme/typography.js`, the `DISPLAY_FONT` constant.
- Activity catalog / point rules: `src/data/activityData.js`.
- Seed profile, quests, challenges, boards: `src/data/appData.js`.
- Add a screen: create it in `src/screens/`, then register a case in
  `AppShell.js` renderScreen() and (if it needs a tab) wire it in `TabBar.js`.

### Notes for the backend

Nothing is persisted yet. Replace the arrays in `src/data/` with API responses that
keep the same shape, and move the mutations in `AppContext.js` (addXP, checkIn, quest
and challenge actions) to real endpoints. The per-challenge standings in
`ChallengeSheet.js` are placeholder data marked with a comment.