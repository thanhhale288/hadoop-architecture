import { AnimatePresence, motion } from 'framer-motion'
import type { Block, SimState } from '../simulation/engine'
import { FILE_MB, FILE_NAME, WORKER_IDS, WORKER_LABEL } from '../simulation/scenario'
import { BlockChip } from './BlockChip'
import { NodeCard } from './NodeCard'

interface ClusterCanvasProps {
  state: SimState
  reducedMotion: boolean
}

function replicasOn(blocks: Block[], workerId: Block['locations'][number]) {
  return blocks.filter((b) => b.locations.includes(workerId))
}

export function ClusterCanvas({ state, reducedMotion }: ClusterCanvasProps) {
  const duration = reducedMotion ? 0 : 0.45
  const unplaced = state.sceneIndex === 2

  return (
    <section className="relative flex min-h-0 flex-1 flex-col overflow-auto bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.07),_transparent_50%)] p-3 sm:p-4 md:overflow-hidden md:p-5">
      <div className="relative z-10 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        <NodeCard title="Client" status="client" icon="client">
          <AnimatePresence>
            {state.fileAtClient && !state.resultReady ? (
              <motion.div
                key="file"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono text-sm text-zinc-200"
              >
                {FILE_NAME} · {FILE_MB} MB
              </motion.div>
            ) : null}
            {state.resultReady ? (
              <motion.div
                key="result"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1.5 font-mono text-sm text-emerald-200"
              >
                result ready
              </motion.div>
            ) : null}
          </AnimatePresence>
        </NodeCard>

        <NodeCard
          title="Master"
          status={state.sceneIndex >= 4 && state.sceneIndex < 7 ? 'busy' : 'healthy'}
          icon="master"
        >
          {unplaced
            ? state.blocks.map((block) => (
                <BlockChip
                  key={block.id}
                  id={block.id}
                  label={block.label}
                  sizeMB={block.sizeMB}
                  layoutId={`block-${block.id}`}
                />
              ))
            : null}
        </NodeCard>
      </div>

      <div className="relative z-10 mt-4 grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WORKER_IDS.map((id) => {
          const status = state.workerStatus[id]
          const held = replicasOn(state.blocks, id)
          return (
            <NodeCard
              key={id}
              title={WORKER_LABEL[id]}
              status={status}
              icon="worker"
              failed={status === 'failed'}
              className="min-h-[130px] sm:min-h-[150px] lg:min-h-0"
            >
              {held.map((block) => (
                <BlockChip
                  key={`${block.id}-${id}`}
                  id={block.id}
                  label={block.label}
                  sizeMB={block.sizeMB}
                  replica={block.primaryWorker !== id}
                  mapping={block.processing === 'mapping' && block.mappedOn === id}
                  layoutId={
                    block.mappedOn === id ||
                    (block.primaryWorker === id && status !== 'failed')
                      ? `block-${block.id}`
                      : `block-${block.id}-${id}`
                  }
                />
              ))}
              {state.containers
                .filter((c) => c.workerId === id && c.status !== 'killed')
                .map((c) => (
                  <motion.span
                    key={c.id}
                    layout
                    transition={{ duration }}
                    className="inline-flex items-center rounded border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 font-mono text-xs text-violet-200"
                  >
                    yarn
                    {c.status === 'reassigned' ? ' · reassigned' : ''}
                  </motion.span>
                ))}
            </NodeCard>
          )
        })}
      </div>

      <ul className="relative z-10 mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 sm:mt-auto sm:pt-4 sm:text-sm">
        {[
          ['bg-zinc-400', 'Client'],
          ['bg-cyan-400', 'Master'],
          ['bg-emerald-400', 'Worker'],
          ['bg-cyan-300', 'Block'],
          ['bg-violet-300', 'Replica'],
          ['bg-rose-500', 'Failed'],
        ].map(([color, label]) => (
          <li key={label} className="inline-flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${color}`} />
            {label}
          </li>
        ))}
      </ul>
    </section>
  )
}
