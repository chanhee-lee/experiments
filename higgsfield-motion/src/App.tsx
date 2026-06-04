import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

// Each scene: h-[200vh] outer div (gives 100vh of scroll room), sticky h-screen inner.
// useScroll tracks progress [0→1] as you scroll through the outer div.
// All animations are useTransform — every scroll pixel drives something.

// ─── scene 1: the void ───────────────────────────────────────────────────────

function SceneVoid() {
  const outerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  // Text entrance is mount-animated; exit is scroll-driven (fades + drifts up as you leave)
  const exitOpacity = useTransform(scrollYProgress, [0, 0.6, 0.88], [1, 1, 0])
  const exitY = useTransform(scrollYProgress, [0.5, 1], ['0px', '-60px'])

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.35, delayChildren: 0.5 } },
  }
  const line = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] } },
  }

  return (
    <div ref={outerRef} className="h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* parallax background — drifts throughout the entire scroll range */}
        <motion.div className="absolute inset-0 scale-[1.2]" style={{ y: bgY }}>
          <video
            className="w-full h-full object-cover"
            autoPlay muted loop playsInline
            poster="/scenes/scene-1-void.png"
          >
            <source src="/scenes/scene-1-void.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0A0E1A]/40" />
        </motion.div>

        {/* scroll-exit wrapper fades + lifts text as user scrolls away */}
        <motion.div className="relative z-10" style={{ opacity: exitOpacity, y: exitY }}>
          {/* mount stagger — text enters on page load */}
          <motion.div
            className="text-center px-8 max-w-3xl"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={line} className="text-[#F5A623] text-xs tracking-[0.4em] uppercase mb-8">
              LUMENARK
            </motion.p>
            <motion.h1
              variants={line}
              className="text-5xl md:text-7xl font-light leading-tight mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#E8F0FF' }}
            >
              A lumen is not the bulb.
            </motion.h1>
            <motion.p
              variants={line}
              className="text-base md:text-lg font-light leading-relaxed"
              style={{ color: '#D4DCE8' }}
            >
              It's not the electricity. It's the light that actually reaches you.
            </motion.p>
            <motion.div variants={line} className="mt-16 mx-auto w-px h-12 bg-[#F5A623]/60" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── scene 2: the triangle ───────────────────────────────────────────────────

function SceneTriangle() {
  const outerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  // Staggered scroll-driven entrance: each line arrives slightly after the previous
  const labelOpacity = useTransform(scrollYProgress, [0, 0.13, 0.65, 0.86], [0, 1, 1, 0])
  const labelY = useTransform(scrollYProgress, [0, 0.15, 0.86, 1], ['24px', '0px', '0px', '-40px'])
  const headlineOpacity = useTransform(scrollYProgress, [0.07, 0.22, 0.65, 0.86], [0, 1, 1, 0])
  const headlineY = useTransform(scrollYProgress, [0.07, 0.24, 0.86, 1], ['30px', '0px', '0px', '-40px'])
  const subtextOpacity = useTransform(scrollYProgress, [0.14, 0.3, 0.65, 0.86], [0, 1, 1, 0])
  const subtextY = useTransform(scrollYProgress, [0.14, 0.32, 0.86, 1], ['26px', '0px', '0px', '-40px'])

  return (
    <div ref={outerRef} className="h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <motion.div
          className="absolute inset-0 scale-[1.2] bg-cover bg-center"
          style={{ backgroundImage: "url('/scenes/scene-2-constellation.png')", y: bgY }}
        >
          <div className="absolute inset-0 bg-[#0A0E1A]/50" />
        </motion.div>

        <div className="relative z-10 text-center px-8 max-w-3xl">
          <motion.p
            style={{ opacity: labelOpacity, y: labelY }}
            className="text-[#F5A623] text-xs tracking-[0.4em] uppercase mb-8"
          >
            THE COVENANT
          </motion.p>
          <motion.h2
            style={{
              opacity: headlineOpacity,
              y: headlineY,
              fontFamily: "'Cormorant Garamond', serif",
              color: '#E8F0FF',
            }}
            className="text-4xl md:text-6xl font-light leading-tight mb-6"
          >
            Every project is a three-way relationship.
          </motion.h2>
          <motion.p
            style={{ opacity: subtextOpacity, y: subtextY, color: '#D4DCE8' }}
            className="text-base md:text-lg font-light leading-relaxed"
          >
            The client's vision. The builder's craft. Something larger than both.
          </motion.p>
        </div>
      </div>
    </div>
  )
}

// ─── scene 3: the warmth ─────────────────────────────────────────────────────

function SceneWarmth() {
  const outerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  // Last scene: text enters and stays (no exit — this is the final destination)
  const labelOpacity = useTransform(scrollYProgress, [0, 0.13], [0, 1])
  const labelY = useTransform(scrollYProgress, [0, 0.15], ['24px', '0px'])
  const headlineOpacity = useTransform(scrollYProgress, [0.07, 0.22], [0, 1])
  const headlineY = useTransform(scrollYProgress, [0.07, 0.24], ['30px', '0px'])
  const subtextOpacity = useTransform(scrollYProgress, [0.14, 0.3], [0, 1])
  const subtextY = useTransform(scrollYProgress, [0.14, 0.32], ['26px', '0px'])
  const servicesOpacity = useTransform(scrollYProgress, [0.22, 0.42], [0, 1])

  return (
    <div ref={outerRef} className="h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <motion.div
          className="absolute inset-0 scale-[1.2] bg-cover bg-center"
          style={{ backgroundImage: "url('/scenes/scene-4-warmth.png')", y: bgY }}
        >
          <div className="absolute inset-0 bg-[#0A0E1A]/35" />
        </motion.div>

        <div className="relative z-10 text-center px-8 max-w-3xl">
          <motion.p
            style={{ opacity: labelOpacity, y: labelY }}
            className="text-[#F5A623] text-xs tracking-[0.4em] uppercase mb-8"
          >
            ONE BUILDER
          </motion.p>
          <motion.h2
            style={{
              opacity: headlineOpacity,
              y: headlineY,
              fontFamily: "'Cormorant Garamond', serif",
              color: '#F5A623',
              textShadow: '0 0 40px rgba(245,166,35,0.35), 0 0 80px rgba(245,166,35,0.15)',
            }}
            className="text-5xl md:text-7xl font-light leading-tight mb-6"
          >
            Carry the light forward.
          </motion.h2>
          <motion.p
            style={{ opacity: subtextOpacity, y: subtextY, color: '#D4DCE8' }}
            className="text-base md:text-lg font-light leading-relaxed mb-6"
          >
            We work with people who have a calling but need a catalyst.
          </motion.p>
          <motion.p
            style={{ opacity: servicesOpacity, color: '#D4DCE8' }}
            className="text-xs tracking-[0.25em] uppercase font-light opacity-40"
          >
            Websites · Systems · Apps · Automations
          </motion.p>
        </div>
      </div>
    </div>
  )
}

// ─── root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <main>
      <SceneVoid />
      <SceneTriangle />
      <SceneWarmth />
    </main>
  )
}
