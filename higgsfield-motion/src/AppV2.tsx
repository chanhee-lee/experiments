import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Shared style for floating amber glow orbs — margin-based centering so GSAP
// can freely animate top/left/scale without fighting an inline transform.
const glowOrb = (top: string, left: string, size: number, strength: number) => ({
  top,
  left,
  marginLeft: `${-size / 2}px`,
  marginTop: `${-size / 2}px`,
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%' as const,
  background: `radial-gradient(circle, rgba(245,166,35,${strength}) 0%, rgba(245,166,35,${(strength * 0.4).toFixed(2)}) 50%, transparent 70%)`,
  boxShadow: `0 0 ${size * 0.67}px ${size * 0.33}px rgba(245,166,35,0.45), 0 0 ${size * 1.67}px ${size * 0.67}px rgba(245,166,35,0.18)`,
})

export default function AppV2() {
  const rootRef = useRef<HTMLDivElement>(null)

  // Lenis smooth scroll — wires into GSAP's ticker so scrub stays in sync
  useEffect(() => {
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.destroy()
      gsap.ticker.remove(raf)
    }
  }, [])

  useGSAP(
    () => {
      // Scenes 2 and 3 start invisible — GSAP reveals them via the master timeline
      gsap.set('#triangle-scene, #warmth-scene', { opacity: 0 })

      // Corner dots and merger glow start hidden
      gsap.set('#corner-top, #corner-bl, #corner-br, #merge-burst', { opacity: 0 })

      // Scene 1 text entrance: time-based mount stagger (not scrubbed)
      gsap.fromTo(
        '#void-content > *',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, stagger: 0.35, delay: 0.5, duration: 1.1, ease: 'power2.out' }
      )

      // Master scroll timeline: one scrubbed timeline drives everything
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=400%',
          invalidateOnRefresh: true,
        },
      })

      // ── Scene 1 ──────────────────────────────────────────────────────────────
      tl.fromTo('#void-bg', { y: '0%' }, { y: '-5%', ease: 'none', duration: 4 }, 0)
      tl.fromTo(
        '#void-content',
        { opacity: 1, y: 0 },
        { opacity: 0, y: -40, ease: 'power2.in', duration: 1 },
        2.5
      )

      // ── Crossfade 1 → 2 ──────────────────────────────────────────────────────
      tl.fromTo('#void-scene', { opacity: 1 }, { opacity: 0, ease: 'none', duration: 2 }, 3)
      tl.fromTo('#triangle-scene', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 2 }, 3)

      // ── Shared: candle flame → constellation apex ─────────────────────────────
      // Starts at candle position, shrinks and blurs down to a pinpoint star
      tl.fromTo(
        '#travel-glow',
        { opacity: 1, scale: 1, filter: 'blur(6px)' },
        { opacity: 0.85, scale: 0.35, filter: 'blur(1px)', ease: 'power2.inOut', duration: 2 },
        3
      )
      tl.to('#travel-glow', { opacity: 0, duration: 0.5 }, 5.8)

      // ── Scene 2 ──────────────────────────────────────────────────────────────
      tl.fromTo('#triangle-bg', { y: '0%' }, { y: '-5%', ease: 'none', duration: 4 }, 3)
      tl.fromTo(
        '#triangle-label',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
        4.5
      )
      tl.fromTo(
        '#triangle-headline',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
        5.0
      )
      tl.fromTo(
        '#triangle-subtext',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
        5.5
      )

      // Corner lights appear once text is fully visible
      tl.to('#corner-top, #corner-bl, #corner-br', { opacity: 1, duration: 0.6 }, 6.0)

      tl.fromTo(
        '#triangle-content',
        { opacity: 1, y: 0 },
        { opacity: 0, y: -40, ease: 'power2.in', duration: 1 },
        6.5
      )

      // ── Scene 2 → 3: three corners converge to radiant center ────────────────
      // Each corner travels to viewport center (50% / 50%) as the crossfade happens
      tl.fromTo('#triangle-scene', { opacity: 1 }, { opacity: 0, ease: 'none', duration: 2 }, 7)
      tl.fromTo('#warmth-scene', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 2 }, 7)

      tl.to('#corner-top', { top: '50%', left: '50%', ease: 'power2.inOut', duration: 2 }, 7)
      tl.to('#corner-bl', { top: '50%', left: '50%', ease: 'power2.inOut', duration: 2 }, 7)
      tl.to('#corner-br', { top: '50%', left: '50%', ease: 'power2.inOut', duration: 2 }, 7)

      // Burst: corners merge at center, expand and dissolve — Scene 3 radiant takes over
      tl.to('#corner-top, #corner-bl, #corner-br', { scale: 3, opacity: 0, duration: 0.7, ease: 'power2.out' }, 8.8)
      tl.fromTo(
        '#merge-burst',
        { opacity: 0, scale: 0.5 },
        { opacity: 0.7, scale: 1.8, duration: 0.5, ease: 'power2.out' },
        8.8
      )
      tl.to('#merge-burst', { opacity: 0, scale: 3, duration: 0.8, ease: 'power2.in' }, 9.3)

      // ── Scene 3 ──────────────────────────────────────────────────────────────
      tl.fromTo('#warmth-bg', { y: '0%' }, { y: '-5%', ease: 'none', duration: 5 }, 7)
      tl.fromTo(
        '#warmth-label',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
        8.5
      )
      tl.fromTo(
        '#warmth-headline',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
        9.2
      )
      tl.fromTo(
        '#warmth-subtext',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
        9.9
      )
      tl.fromTo(
        '#warmth-services',
        { opacity: 0 },
        { opacity: 0.4, ease: 'power2.out', duration: 0.8 },
        10.6
      )

      // End marker
      tl.to({}, { duration: 0.1 }, 12)
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="relative h-screen overflow-hidden">

      {/* ── Travel glow: candle flame → constellation apex ──────────────── */}
      <div
        id="travel-glow"
        className="absolute z-20 pointer-events-none"
        style={glowOrb('14%', '50%', 18, 0.95)}
      />

      {/* ── Corner lights: constellation corners → radiant center ───────── */}
      {/* Top apex of triangle */}
      <div id="corner-top" className="absolute z-20 pointer-events-none" style={glowOrb('19%', '50%', 16, 0.9)} />
      {/* Bottom-left corner */}
      <div id="corner-bl" className="absolute z-20 pointer-events-none" style={glowOrb('71%', '33%', 16, 0.9)} />
      {/* Bottom-right corner */}
      <div id="corner-br" className="absolute z-20 pointer-events-none" style={glowOrb('71%', '67%', 16, 0.9)} />

      {/* ── Merge burst: flash at center as corners combine ─────────────── */}
      <div
        id="merge-burst"
        className="absolute z-20 pointer-events-none"
        style={glowOrb('50%', '50%', 60, 0.8)}
      />

      {/* ── Scene 1: The Void ────────────────────────────────────────────── */}
      <div id="void-scene" className="absolute inset-0">
        <div id="void-bg" className="absolute inset-0 scale-[1.15]">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/scenes/scene-1-void.png"
          >
            <source src="/scenes/scene-1-void.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0A0E1A]/40" />
        </div>
        <div
          id="void-content"
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8"
        >
          <div className="max-w-3xl">
            <p className="text-[#F5A623] text-xs tracking-[0.4em] uppercase mb-8">LUMENARK</p>
            <h1
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#E8F0FF' }}
              className="text-5xl md:text-7xl font-light leading-tight mb-6"
            >
              A lumen is not the bulb.
            </h1>
            <p style={{ color: '#D4DCE8' }} className="text-base md:text-lg font-light leading-relaxed">
              It's not the electricity. It's the light that actually reaches you.
            </p>
            <div className="mt-16 mx-auto w-px h-12 bg-[#F5A623]/60" />
          </div>
        </div>
      </div>

      {/* ── Scene 2: The Triangle ────────────────────────────────────────── */}
      <div id="triangle-scene" className="absolute inset-0">
        <div
          id="triangle-bg"
          className="absolute inset-0 scale-[1.15] bg-cover bg-center"
          style={{ backgroundImage: "url('/scenes/scene-2-constellation.png')" }}
        >
          <div className="absolute inset-0 bg-[#0A0E1A]/50" />
        </div>
        <div
          id="triangle-content"
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8"
        >
          <div className="max-w-3xl">
            <p id="triangle-label" className="text-[#F5A623] text-xs tracking-[0.4em] uppercase mb-8">
              THE COVENANT
            </p>
            <h2
              id="triangle-headline"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#E8F0FF' }}
              className="text-4xl md:text-6xl font-light leading-tight mb-6"
            >
              Every project is a three-way relationship.
            </h2>
            <p id="triangle-subtext" style={{ color: '#D4DCE8' }} className="text-base md:text-lg font-light leading-relaxed">
              The client's vision. The builder's craft. Something larger than both.
            </p>
          </div>
        </div>
      </div>

      {/* ── Scene 3: The Warmth ──────────────────────────────────────────── */}
      <div id="warmth-scene" className="absolute inset-0">
        <div
          id="warmth-bg"
          className="absolute inset-0 scale-[1.15] bg-cover bg-center"
          style={{ backgroundImage: "url('/scenes/scene-4-warmth.png')" }}
        >
          <div className="absolute inset-0 bg-[#0A0E1A]/35" />
        </div>
        <div
          id="warmth-content"
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8"
        >
          <div className="max-w-3xl">
            <p id="warmth-label" className="text-[#F5A623] text-xs tracking-[0.4em] uppercase mb-8">
              ONE BUILDER
            </p>
            <h2
              id="warmth-headline"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: '#F5A623',
                textShadow: '0 0 40px rgba(245,166,35,0.35), 0 0 80px rgba(245,166,35,0.15)',
              }}
              className="text-5xl md:text-7xl font-light leading-tight mb-6"
            >
              Carry the light forward.
            </h2>
            <p id="warmth-subtext" style={{ color: '#D4DCE8' }} className="text-base md:text-lg font-light leading-relaxed mb-6">
              We work with people who have a calling but need a catalyst.
            </p>
            <p id="warmth-services" style={{ color: '#D4DCE8' }} className="text-xs tracking-[0.25em] uppercase font-light">
              Websites · Systems · Apps · Automations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
