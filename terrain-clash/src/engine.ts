import { Card, GameState, RoundResult } from './types'
import { ALL_CARDS } from './cards'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function initGame(): GameState {
  const shuffled = shuffle(ALL_CARDS)
  const playerAll = shuffled.slice(0, 30)
  const aiAll = shuffled.slice(30, 60)

  return {
    playerDeck: playerAll.slice(5),
    playerHand: playerAll.slice(0, 5),
    playerScore: 0,
    aiDeck: aiAll.slice(5),
    aiHand: aiAll.slice(0, 5),
    aiScore: 0,
    phase: 'selecting',
    selectedCard: null,
    lastRound: null,
    winner: null,
  }
}

function getBonus(attacker: Card, defender: Card): number {
  return attacker.advantages.find(a => a.againstType === defender.type)?.bonus ?? 0
}

export function resolveRound(state: GameState, playerCard: Card): GameState {
  if (state.aiHand.length === 0) return state

  const aiCard = state.aiHand[Math.floor(Math.random() * state.aiHand.length)]
  const playerBonus = getBonus(playerCard, aiCard)
  const aiBonus = getBonus(aiCard, playerCard)
  const playerPower = playerCard.power + playerBonus
  const aiPower = aiCard.power + aiBonus

  let winner: RoundResult['winner'] = 'tie'
  let pointsEarned = 0
  let aiPointsEarned = 0

  if (playerPower > aiPower) {
    winner = 'player'
    pointsEarned = aiCard.pointValue
  } else if (aiPower > playerPower) {
    winner = 'ai'
    aiPointsEarned = playerCard.pointValue
  }

  const newPlayerScore = state.playerScore + pointsEarned
  const newAiScore = state.aiScore + aiPointsEarned

  const pHand = state.playerHand.filter(c => c.id !== playerCard.id)
  const aHand = state.aiHand.filter(c => c.id !== aiCard.id)

  const pDeck = [...state.playerDeck]
  const aDeck = [...state.aiDeck]
  const pDraw = pDeck.shift() ?? null
  const aDraw = aDeck.shift() ?? null

  const finalPHand = pDraw ? [...pHand, pDraw] : pHand
  const finalAHand = aDraw ? [...aHand, aDraw] : aHand

  let gameWinner: GameState['winner'] = null
  if (newPlayerScore >= 20) {
    gameWinner = 'player'
  } else if (newAiScore >= 20) {
    gameWinner = 'ai'
  } else if (finalPHand.length === 0 && finalAHand.length === 0) {
    if (newPlayerScore > newAiScore) gameWinner = 'player'
    else if (newAiScore > newPlayerScore) gameWinner = 'ai'
    else gameWinner = 'tie'
  }

  return {
    ...state,
    playerDeck: pDeck,
    playerHand: finalPHand,
    playerScore: newPlayerScore,
    aiDeck: aDeck,
    aiHand: finalAHand,
    aiScore: newAiScore,
    phase: gameWinner ? 'gameOver' : 'revealing',
    selectedCard: playerCard,
    lastRound: {
      playerCard,
      aiCard,
      playerModifiedPower: playerPower,
      aiModifiedPower: aiPower,
      playerBonus,
      aiBonus,
      winner,
      pointsEarned,
      aiPointsEarned,
    },
    winner: gameWinner,
  }
}

export function advanceRound(state: GameState): GameState {
  return { ...state, phase: 'selecting', selectedCard: null, lastRound: null }
}
