export type TerrainType = 'Mountain' | 'Sky' | 'Ocean' | 'Desert' | 'Forest' | 'Space'

export interface Advantage {
  againstType: TerrainType
  bonus: number
}

export interface Card {
  id: string
  name: string
  type: TerrainType
  power: number
  pointValue: number
  advantages: Advantage[]
  emoji: string
}

export type GamePhase = 'selecting' | 'revealing' | 'gameOver'

export interface RoundResult {
  playerCard: Card
  aiCard: Card
  playerModifiedPower: number
  aiModifiedPower: number
  playerBonus: number
  aiBonus: number
  winner: 'player' | 'ai' | 'tie'
  pointsEarned: number
  aiPointsEarned: number
}

export interface GameState {
  playerDeck: Card[]
  playerHand: Card[]
  playerScore: number
  aiDeck: Card[]
  aiHand: Card[]
  aiScore: number
  phase: GamePhase
  selectedCard: Card | null
  lastRound: RoundResult | null
  winner: 'player' | 'ai' | 'tie' | null
}
