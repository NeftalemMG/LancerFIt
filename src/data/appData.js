// ============================================================
// STATIC DATA — ported verbatim from the prototype's <script>.
// The backend teammate will eventually replace these with API
// responses; the shapes here are the contract to build against.
// ============================================================

export const FACULTIES = [
  { id: 'cs',  name: 'Computer Science', short: 'Code & systems',   c: '#4A93D8' },
  { id: 'eng', name: 'Engineering',      short: 'Build & design',   c: '#E07A5F' },
  { id: 'sci', name: 'Science',          short: 'Research & lab',   c: '#4FB587' },
  { id: 'biz', name: 'Odette Business',  short: 'Strategy & trade', c: '#A98BC9' },
  { id: 'kin', name: 'Kinesiology',      short: 'Sport & movement', c: '#D8A94A' },
  { id: 'nur', name: 'Nursing',          short: 'Care & health',    c: '#E08FB4' },
];

export const AVATARS = ['Vanguard', 'Tempest', 'Bastion', 'Specter', 'Solstice', 'Atlas'];

export const initialQuests = [
  { id: 'cardio', icon: 'bolt', title: 'Cardio Burner',     sub: '20 min on any cardio machine', cur: 14, max: 20, xp: 60,  gold: false },
  { id: 'squat',  icon: 'bar',  title: 'Leg Day Loyalist',  sub: '3 sets in the squat rack',     cur: 3,  max: 3,  xp: 80,  gold: true, claimable: true },
  { id: 'buddy',  icon: 'crew', title: 'Bring a Squadmate', sub: 'Check in with a friend',       cur: 0,  max: 1,  xp: 120, gold: false },
  { id: 'swim',   icon: 'wave', title: 'Lancer Laps',       sub: 'Swim 10 lengths of the pool',  cur: 6,  max: 10, xp: 90,  gold: false },
  { id: 'early',  icon: 'sun',  title: 'Dawn Patrol',       sub: 'Check in before 8:00 AM',      cur: 2,  max: 3,  xp: 150, gold: true },
];

// Unsplash photos (free license), same IDs as the prototype.
const U = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;
export const PH = {
  stairs:   U('1576678927484-cc907957088c'),
  running:  U('1502904550040-7534597429ae'),
  cycling:  U('1534787238916-9ba6764efd4f'),
  swimming: U('1530549387789-4c1017266635'),
  gym:      U('1534438327276-14e5300c3a48'),
  yoga:     U('1545205597-3d9d02c29597'),
};

// Fallback gradient endpoints per category (used behind slow images).
export const FALLBACK = {
  Running:  ['#1b4f72', '#0e3252'],
  Cycling:  ['#1d5b54', '#0e3a35'],
  Swimming: ['#16557d', '#0c3350'],
  Gym:      ['#5a4326', '#332514'],
  Yoga:     ['#4a3a63', '#28213a'],
};

export const CHALLENGES = [
  { id: 'run',  type: 'Running',  title: '5K Around Campus', sub: 'Log 5 km this week',  xp: 300, joined: 32, img: PH.running,  avs: [1, 3, 4], days: 7,  desc: 'Cover 5 km on foot anywhere on campus before Sunday. Treadmill counts, but outdoor laps of the riverfront earn the bonus.' },
  { id: 'spin', type: 'Cycling',  title: 'Spin Sprint',      sub: '3 spin classes',      xp: 260, joined: 18, img: PH.cycling,  avs: [2, 5, 0], days: 7,  desc: 'Clip into three spin classes at the Toldo Centre this week. Each session auto-logs from the studio bikes.' },
  { id: 'swim', type: 'Swimming', title: 'Lap Legends',      sub: 'Swim 2 km total',     xp: 280, joined: 24, img: PH.swimming, avs: [4, 1, 3], days: 10, desc: 'Bank 2 km of total distance in the pool. Lengths stack across as many visits as you need.' },
  { id: 'lift', type: 'Gym',      title: 'Iron Circuit',     sub: '4 strength sessions', xp: 320, joined: 41, img: PH.gym,      avs: [0, 2, 5], days: 7,  desc: 'Complete four strength sessions on the main floor. A session counts once you log 20+ minutes.' },
  { id: 'yoga', type: 'Yoga',     title: 'Morning Flow',     sub: '5 yoga sessions',     xp: 240, joined: 27, img: PH.yoga,     avs: [3, 4, 1], days: 14, desc: 'Roll out the mat five times this fortnight. Any studio class or a logged home flow qualifies.' },
];

export const LB = {
  friends: [
    { n: 'Kanade U.',  f: 'eng', xp: 2140, av: 1, fl: 'pk' },
    { n: 'Neftalem',   f: 'cs',  xp: 1980, av: 0, fl: 'et', you: true },
    { n: 'Arabs', f: 'cs',  xp: 1820, av: 3, fl: 'in' },
    { n: 'Fady P.',    f: 'kin', xp: 1540, av: 4, fl: 'ca' },
    { n: 'Dario L.',   f: 'sci', xp: 1390, av: 2, fl: 'br' },
    { n: 'Priya S.',   f: 'nur', xp: 1210, av: 5, fl: 'in' },
    { n: 'Jonah T.',   f: 'biz', xp: 980,  av: 1, fl: 'ca' },
  ],
  faculty: [
    { n: 'Kinesiology',       f: 'kin', xp: 48210, av: 4, fl: 'ca', grp: true },
    { n: 'Engineering',       f: 'eng', xp: 44730, av: 1, fl: 'ca', grp: true },
    { n: 'Computer Science',  f: 'cs',  xp: 41950, av: 0, fl: 'ca', grp: true, you: true },
    { n: 'Science',           f: 'sci', xp: 38400, av: 2, fl: 'ca', grp: true },
    { n: 'Odette Business',   f: 'biz', xp: 33120, av: 3, fl: 'ca', grp: true },
    { n: 'Nursing',           f: 'nur', xp: 30880, av: 5, fl: 'ca', grp: true },
  ],
  campus: [
    { n: 'F. Phillips',     f: 'kin', xp: 3320, av: 4, fl: 'ng' },
    { n: 'Sandra O.', f: 'eng', xp: 3105, av: 2, fl: 'fr' },
    { n: 'Mike M.',   f: 'sci', xp: 2960, av: 5, fl: 'ca' },
    { n: 'L. Nguyen',   f: 'biz', xp: 2810, av: 3, fl: 'cn' },
    { n: 'Faisal A.',   f: 'eng', xp: 2140, av: 1, fl: 'pk' },
    { n: 'Pogba P.',    f: 'cs',  xp: 1980, av: 0, fl: 'et', you: true, rank: 23 },
  ],
};

export const BADGES = [
  { id: 'charge',   name: 'First Charge',    shape: 'shield',  col: '#D8A94A', earned: true,  date: 'Sep 14', desc: 'Completed your very first workout at the Toldo Lancer Centre.' },
  { id: 'iron',     name: 'Iron Week',       shape: 'hex',     col: '#E07A5F', earned: true,  date: 'Oct 02', desc: 'Held a 7-day check-in streak without breaking formation.' },
  { id: 'dawn',     name: 'Dawn Patrol',     shape: 'medal',   col: '#D8A94A', earned: true,  date: 'Oct 19', desc: 'Five workouts logged before 8:00 AM. The campus was still asleep.' },
  { id: 'laps',     name: 'Pool Shark',      shape: 'pennant', col: '#4A93D8', earned: true,  date: 'Nov 05', desc: 'Swam 100 total lengths in the Toldo pool.' },
  { id: 'squad',    name: 'Squad Captain',   shape: 'star',    col: '#A98BC9', earned: true,  date: 'Nov 21', desc: 'Recruited 3 friends who completed their first workout.' },
  { id: 'tower',    name: 'Tower Conqueror', shape: 'diamond', col: '#4FB587', earned: true,  date: 'Dec 08', desc: 'Climbed 50 floors in a single Tower Challenge.' },
  { id: 'frost',    name: 'Frost Lancer',    shape: 'hex',     col: '#5FB0DC', earned: true,  date: 'Jan 12', desc: 'Checked in 10 times during exam season. Respect.' },
  { id: 'pr',       name: 'New Heights',     shape: 'shield',  col: '#D8A94A', earned: true,  date: 'Feb 03', desc: 'Logged a personal record on any tracked lift.' },
  { id: 'loyal',    name: 'Semester Strong', shape: 'medal',   col: '#4FB587', earned: true,  date: 'Mar 12', desc: 'Active every single week of the semester.' },
  { id: 'cent',     name: 'Century Club',    shape: 'star',    col: '#D8A94A', earned: false, cur: 87, max: 100, desc: 'Log 100 lifetime workouts. The gold standard.' },
  { id: 'night',    name: 'Night Watch',     shape: 'diamond', col: '#8FA4C0', earned: false, cur: 4,  max: 10,  desc: 'Ten workouts after 9:00 PM. The arena never sleeps.' },
  { id: 'gauntlet', name: 'The Gauntlet',    shape: 'pennant', col: '#E08FB4', earned: false, cur: 1,  max: 5,   desc: 'Finish 5 featured challenges in one season.' },
];

export const initialState = {
  name: 'Neftalem',
  avatar: 0,
  faculty: FACULTIES[0],
  flag: 'ca',
  level: 7,
  xp: 1240,
  xpMax: 2000,
  streak: 12,
  lifetime: 14820,
  workouts: 87,
  checkedIn: false,
  joinedTower: false,
};

export const fmt = (n) => Number(n).toLocaleString('en-CA');
