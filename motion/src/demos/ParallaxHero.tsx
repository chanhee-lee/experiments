import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const shape1Y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const shape2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  return (
    <DemoLayout title="Parallax Hero" apis={['useScroll', 'useTransform']} accent="#A78BFA">
      <div ref={containerRef} className="relative" style={{ height: '200vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          {/* Background layer — slowest */}
          <motion.div
            style={{ y: bgY }}
            className="absolute inset-0 bg-gradient-to-br from-violet-950 via-[#0F172A] to-indigo-950"
          />

          {/* Floating shape 1 — slow */}
          <motion.div
            style={{ y: shape1Y }}
            className="absolute top-20 right-32 w-64 h-64 rounded-full bg-violet-700/20 blur-3xl pointer-events-none"
          />

          {/* Floating shape 2 — fast, upward */}
          <motion.div
            style={{ y: shape2Y }}
            className="absolute bottom-24 left-20 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none"
          />

          {/* Text — medium parallax */}
          <motion.div style={{ y: textY }} className="relative text-center px-8 max-w-3xl">
            <p className="text-sm mb-4 font-mono" style={{ color: '#A78BFA' }}>Now shipping v2.0</p>
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Build things<br />people love
            </h1>
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
              The platform that grows with you. Start small, scale to millions.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer"
              style={{ background: '#A78BFA', color: '#0F172A' }}
            >
              Get started free
            </motion.button>
            <p className="mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              Scroll down to see the parallax effect ↓
            </p>
          </motion.div>
        </div>
      </div>
    </DemoLayout>
  )
}
