import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

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

      // Scene 1 text entrance: time-based mount stagger (not scrubbed)
      gsap.fromTo(
        '#void-content > *',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.35,
          delay: 0.5,
          duration: 1.1,
          ease: 'power2.out',
        }
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
      // Background parallax: drifts upward throughout scene 1
      tl.fromTo('#void-bg', { y: '0%' }, { y: '-5%', ease: 'none', duration: 4 }, 0)

      // Text exits: fades and lifts as user scrolls toward transition
      tl.fromTo(
        '#void-content',
        { opacity: 1, y: 0 },
        { opacity: 0, y: -40, ease: 'power2.in', duration: 1 },
        2.5
      )

      // ── Crossfade 1 → 2 ──────────────────────────────────────────────────────
      tl.fromTo('#void-scene', { opacity: 1 }, { opacity: 0, ease: 'none', duration: 2 }, 3)
      tl.fromTo('#triangle-scene', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 2 }, 3)

      // ── Scene 2 ──────────────────────────────────────────────────────────────
      // Background parallax
      tl.fromTo('#triangle-bg', { y: '0%' }, { y: '-5%', ease: 'none', duration: 4 }, 3)

      // Text entrance: staggered label → headline → subtext
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

      // Text exits
      tl.fromTo(
        '#triangle-content',
        { opacity: 1, y: 0 },
        { opacity: 0, y: -40, ease: 'power2.in', duration: 1 },
        6.5
      )

      // ── Crossfade 2 → 3 ──────────────────────────────────────────────────────
      tl.fromTo('#triangle-scene', { opacity: 1 }, { opacity: 0, ease: 'none', duration: 2 }, 7)
      tl.fromTo('#warmth-scene', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 2 }, 7)

      // ── Scene 3 ──────────────────────────────────────────────────────────────
      // Background parallax
      tl.fromTo('#warmth-bg', { y: '0%' }, { y: '-5%', ease: 'none', duration: 5 }, 7)

      // Text entrance: no exit — this is the final destination
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

      // ── Shared element: candle flame → constellation apex ────────────────────
      // Starts at candle position (upper-center, ~30% from top), travels to the
      // triangle apex (also upper-center, ~22% from top) as Scene 1→2 crossfades.
      // The blur shrinks so it reads as a pinpoint star rather than a warm flame.
      tl.fromTo(
        '#travel-glow',
        { opacity: 1, scale: 1, y: '0%', filter: 'blur(6px)' },
        {
          opacity: 0.85,
          scale: 0.35,
          y: '-12%',
          filter: 'blur(1px)',
          ease: 'power2.inOut',
          duration: 2,
        },
        3
      )
      // Fade out once Scene 2 text is fully on screen — the constellation image
      // itself carries the visual from here
      tl.to('#travel-glow', { opacity: 0, duration: 0.5 }, 5.8)

      // End marker: holds pin briefly after last text enters before unpinning
      tl.to({}, { duration: 0.1 }, 12)
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="relative h-screen overflow-hidden">
      {/* ── Travel glow: candle flame → constellation apex ──────────────── */}
      {/* Positioned at the candle's location in the video (~30% from top, centered).
          GSAP moves it upward and collapses it into a pinpoint as Scene 2 fades in. */}
      <div
        id="travel-glow"
        className="absolute z-20 pointer-events-none"
        style={{
          top: '28%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.95) 0%, rgba(245,166,35,0.4) 50%, transparent 70%)',
          boxShadow: '0 0 12px 6px rgba(245,166,35,0.5), 0 0 30px 12px rgba(245,166,35,0.2)',
        }}
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
            <p
              style={{ color: '#D4DCE8' }}
              className="text-base md:text-lg font-light leading-relaxed"
            >
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
            <p
              id="triangle-label"
              className="text-[#F5A623] text-xs tracking-[0.4em] uppercase mb-8"
            >
              THE COVENANT
            </p>
            <h2
              id="triangle-headline"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#E8F0FF' }}
              className="text-4xl md:text-6xl font-light leading-tight mb-6"
            >
              Every project is a three-way relationship.
            </h2>
            <p
              id="triangle-subtext"
              style={{ color: '#D4DCE8' }}
              className="text-base md:text-lg font-light leading-relaxed"
            >
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
            <p
              id="warmth-label"
              className="text-[#F5A623] text-xs tracking-[0.4em] uppercase mb-8"
            >
              ONE BUILDER
            </p>
            <h2
              id="warmth-headline"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: '#F5A623',
                textShadow:
                  '0 0 40px rgba(245,166,35,0.35), 0 0 80px rgba(245,166,35,0.15)',
              }}
              className="text-5xl md:text-7xl font-light leading-tight mb-6"
            >
              Carry the light forward.
            </h2>
            <p
              id="warmth-subtext"
              style={{ color: '#D4DCE8' }}
              className="text-base md:text-lg font-light leading-relaxed mb-6"
            >
              We work with people who have a calling but need a catalyst.
            </p>
            <p
              id="warmth-services"
              style={{ color: '#D4DCE8' }}
              className="text-xs tracking-[0.25em] uppercase font-light"
            >
              Websites · Systems · Apps · Automations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
