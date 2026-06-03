import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'

function DragCard() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>drag · dragConstraints</p>
      <motion.div
        drag
        dragConstraints={{ left: -80, right: 80, top: -40, bottom: 40 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.05 }}
        className="w-48 h-32 rounded-xl border flex items-center justify-center text-lg font-semibold font-heading select-none"
        style={{
          background: 'var(--surface-card)',
          borderColor: '#FBBF2466',
          color: 'var(--text-primary)',
          cursor: 'grab',
        }}
      >
        Drag Me
      </motion.div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Snaps back on release</p>
    </div>
  )
}

function TiltCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-60, 60], [15, -15]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-80, 80], [-15, 15]), { stiffness: 300, damping: 30 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div className="flex flex-col items-center gap-4" style={{ perspective: '600px' }}>
      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>useMotionValue · useTransform · useSpring</p>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'var(--surface-card)',
          borderColor: '#22D3EE66',
          color: 'var(--text-primary)',
        }}
        className="w-48 h-32 rounded-xl border flex items-center justify-center text-lg font-semibold font-heading select-none cursor-default"
      >
        Hover Tilt
      </motion.div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Move mouse over card</p>
    </div>
  )
}

function TapCard() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>whileHover · whileTap</p>
      <motion.div
        whileHover={{ scale: 1.03, borderColor: '#6366F1' }}
        whileTap={{ scale: 0.97, opacity: 0.85 }}
        transition={{ duration: 0.15 }}
        className="w-48 h-32 rounded-xl border flex items-center justify-center text-lg font-semibold font-heading select-none cursor-pointer"
        style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}
      >
        Tap Press
      </motion.div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click or tap the card</p>
    </div>
  )
}

export function GestureCard() {
  return (
    <DemoLayout title="Gesture Card" apis={['drag', 'useMotionValue', 'whileTap']} accent="#FBBF24">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-3 font-heading" style={{ color: 'var(--text-primary)' }}>
            Three gesture patterns
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Each card demonstrates a different interaction model</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <DragCard />
          <TiltCard />
          <TapCard />
        </div>
      </div>
    </DemoLayout>
  )
}
