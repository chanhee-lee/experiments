import { Card } from './types'
import { TYPE_ICONS, TYPE_COLORS } from './cards'

interface Props {
  card: Card
  selected?: boolean
  faceDown?: boolean
  onClick?: () => void
  disabled?: boolean
  large?: boolean
}

export function CardComponent({ card, selected, faceDown, onClick, disabled, large }: Props) {
  if (faceDown) {
    return (
      <div className={['card', 'card--face-down', large && 'card--large'].filter(Boolean).join(' ')}>
        <div className="card-back-inner">
          <span className="card-back-emblem">⚔</span>
        </div>
      </div>
    )
  }

  const colors = TYPE_COLORS[card.type]
  const cls = [
    'card',
    selected ? 'card--selected' : '',
    disabled ? 'card--disabled' : '',
    large ? 'card--large' : '',
    large && card.power === 10 ? 'card--legendary' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cls}
      style={{
        background: `linear-gradient(160deg, ${colors.from}, ${colors.to})`,
        borderColor: selected ? '#fbbf24' : colors.border,
      }}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Header: name + point badge */}
      <div className="card-header">
        <span className="card-name">{card.name}</span>
        <span className={`card-pts card-pts--${card.pointValue}`}>{card.pointValue}pt</span>
      </div>

      {/* Art frame — swap emoji for <img> later */}
      <div className="card-art-frame">
        <span className="card-emoji">{card.emoji}</span>
      </div>

      {/* Type line */}
      <div className="card-type-line">
        <span className="card-type-icon">{TYPE_ICONS[card.type]}</span>
        <span className="card-type-name">{card.type}</span>
      </div>

      {/* Footer: power + advantages */}
      <div className="card-footer">
        <div className="card-power-row">
          <span className="card-power-label">PWR</span>
          <span className="card-power-value">{card.power}</span>
        </div>
        <div className="card-advs">
          {card.advantages.map(a => (
            <span key={a.againstType} className="card-adv">
              +{a.bonus}{TYPE_ICONS[a.againstType]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
