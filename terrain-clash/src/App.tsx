import { useState } from 'react'
import { GameState, Card } from './types'
import { initGame, resolveRound, advanceRound } from './engine'
import { CardComponent } from './Card'
import { TYPE_ICONS } from './cards'

function impactTier(power: number): string {
  if (power <= 3) return 'light'
  if (power <= 6) return 'medium'
  if (power <= 9) return 'heavy'
  return 'legendary'
}

export default function App() {
  const [game, setGame] = useState<GameState>(initGame)

  function selectCard(card: Card) {
    if (game.phase !== 'selecting') return
    setGame(g => ({ ...g, selectedCard: card }))
  }

  function battle() {
    if (!game.selectedCard) return
    setGame(g => resolveRound(g, g.selectedCard!))
  }

  function nextRound() {
    setGame(advanceRound)
  }

  function restart() {
    setGame(initGame)
  }

  const r = game.lastRound

  return (
    <div className="game">
      {/* Scoreboard */}
      <div className="scoreboard">
        <div className="score score--ai">
          <span className="score-label">Opponent</span>
          <span className="score-value">{game.aiScore}</span>
          <span className="score-goal">/ 20</span>
          <div className="score-bar">
            <div className="score-fill score-fill--ai" style={{ width: `${Math.min(game.aiScore / 20 * 100, 100)}%` }} />
          </div>
          <span className="score-deck">{game.aiHand.length} in hand · {game.aiDeck.length} in deck</span>
        </div>
        <div className="scoreboard-center">
          <div className="score-title">Terrain Clash</div>
          <div className="score-subtitle">First to 20 wins</div>
        </div>
        <div className="score score--you">
          <span className="score-label">You</span>
          <span className="score-value">{game.playerScore}</span>
          <span className="score-goal">/ 20</span>
          <div className="score-bar">
            <div className="score-fill score-fill--player" style={{ width: `${Math.min(game.playerScore / 20 * 100, 100)}%` }} />
          </div>
          <span className="score-deck">{game.playerHand.length} in hand · {game.playerDeck.length} in deck</span>
        </div>
      </div>

      {/* Opponent hand (face-down during selection) */}
      {game.phase === 'selecting' && (
        <>
          <div className="section-label">Opponent's Hand</div>
          <div className="hand">
            {game.aiHand.map(c => <CardComponent key={c.id} card={c} faceDown />)}
          </div>
        </>
      )}

      {/* Battle arena */}
      {(game.phase === 'revealing' || game.phase === 'gameOver') && r && (
        <div className="battle-arena">
          <div className="battle-side">
            <div className="battle-label">Opponent played</div>
            <div className={`impact-wrap impact--${impactTier(r.aiCard.power)}`}>
              <CardComponent card={r.aiCard} large />
            </div>
            <div className="battle-power-line">
              {r.aiCard.power}
              {r.aiBonus > 0 && (
                <span className="power-bonus"> +{r.aiBonus} vs {TYPE_ICONS[r.playerCard.type]}</span>
              )}
              {' = '}<strong>{r.aiModifiedPower}</strong>
            </div>
          </div>

          <div className="battle-divider">
            <div className="battle-divider-line" />
            <div className="battle-vs">VS</div>
            {r.winner === 'player' && <div className="result result--win">🏆 Win<br />+{r.pointsEarned}pt</div>}
            {r.winner === 'ai' && <div className="result result--lose">💀 Loss<br />+{r.aiPointsEarned}pt</div>}
            {r.winner === 'tie' && <div className="result result--tie">🤝 Tie</div>}
            <div className="battle-divider-line" />
          </div>

          <div className="battle-side">
            <div className="battle-label">You played</div>
            <div className={`impact-wrap impact--${impactTier(r.playerCard.power)}`}>
              <CardComponent card={r.playerCard} large />
            </div>
            <div className="battle-power-line">
              {r.playerCard.power}
              {r.playerBonus > 0 && (
                <span className="power-bonus"> +{r.playerBonus} vs {TYPE_ICONS[r.aiCard.type]}</span>
              )}
              {' = '}<strong>{r.playerModifiedPower}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Player hand */}
      {game.phase !== 'gameOver' && (
        <div className="hand-section">
          {game.phase === 'revealing' && <div className="section-label">Your Hand</div>}
          <div className="hand">
            {game.playerHand.map(c => (
              <CardComponent
                key={c.id}
                card={c}
                selected={game.selectedCard?.id === c.id}
                disabled={game.phase !== 'selecting'}
                onClick={() => selectCard(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="actions">
        {game.phase === 'selecting' && (
          <button className="btn btn-battle" onClick={battle} disabled={!game.selectedCard}>
            {game.selectedCard ? '⚔️ Battle!' : 'Select a card'}
          </button>
        )}
        {game.phase === 'revealing' && (
          <button className="btn btn-next" onClick={nextRound}>Next Round →</button>
        )}
        {game.phase === 'gameOver' && (
          <div className="game-over">
            <div className="game-over-title">
              {game.winner === 'player' ? '🏆 You Win!' : game.winner === 'ai' ? '💀 You Lose!' : '🤝 Draw!'}
            </div>
            <div className="game-over-scores">
              Final Score — You: {game.playerScore} | Opponent: {game.aiScore}
            </div>
            <button className="btn btn-restart" onClick={restart}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  )
}
