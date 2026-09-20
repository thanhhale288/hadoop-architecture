import { AnimatePresence, motion } from 'framer-motion'
import { TAKEAWAYS } from '../simulation/scenario'

interface TakeawaysOverlayProps {
  open: boolean
  onClose: () => void
  reducedMotion: boolean
}

export function TakeawaysOverlay({
  open,
  onClose,
  reducedMotion,
}: TakeawaysOverlayProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
    className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="max-h-full w-full max-w-3xl overflow-auto rounded-2xl border border-white/10 bg-[#101014] p-6 shadow-2xl"
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-400 uppercase">
              What the simulation demonstrates
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-50">
              Hadoop architecture in five ideas
            </h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {TAKEAWAYS.map((item, i) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-white/8 bg-white/3 p-4"
                >
                  <p className="font-mono text-[11px] text-cyan-400">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-1 text-base font-medium text-zinc-100">{item.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{item.body}</p>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-300"
            >
              Back to cluster
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
