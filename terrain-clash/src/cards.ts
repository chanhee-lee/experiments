import { Card, TerrainType, Advantage } from './types'

const ADVANTAGES: Record<TerrainType, Advantage[]> = {
  Mountain: [{ againstType: 'Sky', bonus: 2 }, { againstType: 'Desert', bonus: 1 }],
  Desert:   [{ againstType: 'Forest', bonus: 2 }, { againstType: 'Sky', bonus: 1 }],
  Sky:      [{ againstType: 'Ocean', bonus: 2 }, { againstType: 'Forest', bonus: 1 }],
  Forest:   [{ againstType: 'Space', bonus: 2 }, { againstType: 'Ocean', bonus: 1 }],
  Ocean:    [{ againstType: 'Mountain', bonus: 2 }, { againstType: 'Space', bonus: 1 }],
  Space:    [{ againstType: 'Desert', bonus: 2 }, { againstType: 'Mountain', bonus: 1 }],
}

function pointValue(power: number): number {
  if (power <= 3) return 1
  if (power <= 6) return 2
  if (power <= 9) return 3
  return 4
}

function makeCards(type: TerrainType, entries: [string, string][]): Card[] {
  return entries.map(([name, emoji], i) => ({
    id: `${type}-${i + 1}`,
    name,
    type,
    power: i + 1,
    pointValue: pointValue(i + 1),
    advantages: ADVANTAGES[type],
    emoji,
  }))
}

export const ALL_CARDS: Card[] = [
  ...makeCards('Mountain', [
    ['Rock', '🪨'],
    ['Coal', '🖤'],
    ['Boulder', '⛰️'],
    ['Rock Dude', '🧗'],
    ['Mountaineer', '🏔️'],
    ['Golem', '🗿'],
    ['Statue', '🗽'],
    ['Monk', '🧘'],
    ['The Great Wall', '🧱'],
    ['The Pebble', '✨'],
  ]),
  ...makeCards('Sky', [
    ['Bird', '🐦'],
    ['Kite', '🪁'],
    ['Wind', '💨'],
    ['Cloud Dude', '🌤️'],
    ['Plane', '✈️'],
    ['Air Pollution', '🌫️'],
    ['Lightning', '⚡'],
    ['Cloud Castle', '🏰'],
    ['The Dreamer', '💭'],
    ['Butt Shaped Happy Little Cloud', '🍑'],
  ]),
  ...makeCards('Ocean', [
    ['Fish', '🐟'],
    ['Sea Turtle', '🐢'],
    ['Plastic Straw', '🥤'],
    ['Water Dude', '💧'],
    ['MolaMola', '🐡'],
    ['Waterfall', '🌊'],
    ['Shark', '🦈'],
    ['Giant Squid', '🦑'],
    ['Sea Serpent', '🐉'],
    ['Ocean Man', '🧜'],
  ]),
  ...makeCards('Desert', [
    ['Dust', '💨'],
    ['Scorpion', '🦂'],
    ['Cactus', '🌵'],
    ['Sand Dude', '🏜️'],
    ['Pyramid', '🔺'],
    ['Quicksand', '⌛'],
    ['Mommy Mummy', '🧟'],
    ['Sphynx', '🦁'],
    ['Darude Sandstorm', '🌪️'],
    ['Mr Sandman', '😴'],
  ]),
  ...makeCards('Forest', [
    ['Leaf', '🍃'],
    ['Mushroom', '🍄'],
    ['Tree', '🌳'],
    ['Tree Dude', '🌲'],
    ['Bee Hive', '🐝'],
    ['The Banana Troupe', '🍌'],
    ['Druid', '🧙'],
    ['King of the Jungle', '🦁'],
    ['The Ancient Tree', '🌳'],
    ['Happy Frog', '🐸'],
  ]),
  ...makeCards('Space', [
    ['Space Dust', '✨'],
    ['Vaccuum', '🌌'],
    ['Bruno Mars', '🎤'],
    ['Star Dude', '⭐'],
    ['Uranus', '🪐'],
    ['Space Bar', '🍺'],
    ['Dwarf K-pop Star', '💫'],
    ['Octonaut', '🐙'],
    ['Shooting Star', '🌠'],
    ['Laika', '🐕'],
  ]),
]

export const TYPE_ICONS: Record<TerrainType, string> = {
  Mountain: '⛰️',
  Sky: '☁️',
  Ocean: '🌊',
  Desert: '🏜️',
  Forest: '🌲',
  Space: '🚀',
}

export const TYPE_COLORS: Record<TerrainType, { from: string; to: string; border: string }> = {
  Mountain: { from: '#6B4226', to: '#3E2007', border: '#C8902A' },
  Sky:      { from: '#56CCF2', to: '#2F80ED', border: '#7FD8F5' },
  Ocean:    { from: '#0077B6', to: '#03045E', border: '#00B4D8' },
  Desert:   { from: '#F4A261', to: '#C77D39', border: '#FFBF69' },
  Forest:   { from: '#40916C', to: '#1B4332', border: '#74C69D' },
  Space:    { from: '#7B2FBE', to: '#10002B', border: '#C77DFF' },
}
