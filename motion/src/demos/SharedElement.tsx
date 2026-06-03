import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { DemoLayout } from '../components/DemoLayout'

const PHOTOS = [
  { id: 1, title: 'Mountain Dawn',   category: 'Landscape',    gradient: 'from-indigo-900 to-blue-700' },
  { id: 2, title: 'Urban Geometry',  category: 'Architecture', gradient: 'from-slate-800 to-zinc-600' },
  { id: 3, title: 'Ocean Depths',    category: 'Nature',       gradient: 'from-cyan-900 to-teal-700' },
  { id: 4, title: 'Desert Bloom',    category: 'Nature',       gradient: 'from-amber-900 to-orange-700' },
  { id: 5, title: 'City at Night',   category: 'Urban',        gradient: 'from-purple-900 to-indigo-700' },
  { id: 6, title: 'Fog & Forest',    category: 'Landscape',    gradient: 'from-emerald-900 to-green-700' },
]

export function SharedElement() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = PHOTOS.find(p => p.id === selectedId)

  return (
    <DemoLayout title="Shared Element" apis={['layoutId', 'AnimatePresence']} accent="#22D3EE">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 font-heading" style={{ color: 'var(--text-primary)' }}>
            Portfolio
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Click any photo to expand</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PHOTOS.map(photo => (
            <motion.div
              key={photo.id}
              layoutId={`card-${photo.id}`}
              onClick={() => setSelectedId(photo.id)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`bg-gradient-to-br ${photo.gradient} rounded-xl h-40 cursor-pointer flex flex-col justify-end p-4`}
            >
              <motion.h3
                layoutId={`title-${photo.id}`}
                className="text-white font-semibold text-sm font-heading"
              >
                {photo.title}
              </motion.h3>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSelectedId(null)}
            />
            <motion.div
              layoutId={`card-${selected.id}`}
              onClick={() => setSelectedId(null)}
              className={`fixed inset-8 md:inset-16 lg:inset-24 bg-gradient-to-br ${selected.gradient} rounded-2xl z-50 flex flex-col justify-end p-8 cursor-pointer`}
            >
              <motion.h2
                layoutId={`title-${selected.id}`}
                className="text-white text-3xl font-bold mb-2 font-heading"
              >
                {selected.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
                className="text-white/70 text-sm"
              >
                {selected.category} · Click to close
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DemoLayout>
  )
}
