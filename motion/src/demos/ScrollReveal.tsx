import { motion } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast',    desc: 'Optimized for speed at every layer of the stack.' },
  { icon: '🔒', title: 'Secure by Default', desc: 'End-to-end encryption and zero-trust architecture.' },
  { icon: '📈', title: 'Built to Scale',    desc: 'Handles millions of requests without breaking a sweat.' },
  { icon: '🔌', title: 'Easy Integration',  desc: 'Connect to any tool via our REST API or SDKs.' },
  { icon: '🎯', title: 'Precise Analytics', desc: 'Real-time insights into every user interaction.' },
  { icon: '🤝', title: 'Team-Ready',        desc: 'Roles, permissions, and audit logs built in.' },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function ScrollReveal() {
  return (
    <DemoLayout title="Scroll Reveal" apis={['whileInView', 'viewport']} accent="#6366F1">
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 font-heading" style={{ color: 'var(--text-primary)' }}>
            Everything you need
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Scroll down to see the cards animate in</p>
        </div>
        <div className="h-48" aria-hidden="true" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="rounded-xl p-6 border"
              style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2 font-heading" style={{ color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </DemoLayout>
  )
}
