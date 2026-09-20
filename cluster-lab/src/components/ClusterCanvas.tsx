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
    <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.07),_transparent_50%)] p-4 md:p-6">

      <p className="relative z-10 mb-2 font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase">
        Client → Master
      </p>
      <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <NodeCard
          title="Client"
          subtitle="Submits the file and the job"
          status="client"
          icon="client"
        >
          <AnimatePresence>
            {state.fileAtClient && !state.resultReady ? (
              <motion.div
                key="file"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md border border-white/15 bg-white/5 px-2 py-1 font-mono text-[11px] text-zinc-200"
              >
                {FILE_NAME} · {FILE_MB} MB
              </motion.div>
            ) : null}
            {state.resultReady ? (
              <motion.div
                key="result"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 font-mono text-[11px] text-emerald-200"
              >
                part-r-00000 · ready
              </motion.div>
            ) : null}
          </AnimatePresence>
        </NodeCard>

        <NodeCard
          title="Master"
          subtitle="HDFS + YARN on the coordination layer"
          status={state.sceneIndex >= 4 && state.sceneIndex < 7 ? 'busy' : 'healthy'}
          icon="master"
          badge="HA-ready"
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
            : (
                <span className="text-[11px] text-zinc-500">
                  Coordinates placement, resources, and recovery
                </span>
              )}
        </NodeCard>
      </div>

      <p className="relative z-10 mt-5 mb-2 font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase">
        Workers · store blocks · run tasks
      </p>
      <div className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        {WORKER_IDS.map((id) => {
          const status = state.workerStatus[id]
          const held = replicasOn(state.blocks, id)
          return (
            <NodeCard
              key={id}
              title={WORKER_LABEL[id]}
              subtitle="Storage + compute"
              status={status}
              icon="worker"
              failed={status === 'failed'}
              badge={id.toUpperCase()}
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
                    className="inline-flex items-center rounded border border-violet-400/30 bg-violet-400/10 px-2 py-1 font-mono text-[10px] text-violet-200"
                  >
                    yarn {c.vcores}v / {c.memMB}MB
                    {c.status === 'reassigned' ? ' · reassigned' : ''}
                  </motion.span>
                ))}
              {held.length === 0 && status !== 'failed' && state.sceneIndex < 3 ? (
                <span className="text-[11px] text-zinc-600">waiting for blocks</span>
              ) : null}
            </NodeCard>
          )
        })}
      </div>

      <Legend />
    </section>
  )
}

function Legend() {
  const items = [
    { color: 'bg-zinc-400', label: 'Client' },
    { color: 'bg-cyan-400', label: 'Master' },
    { color: 'bg-emerald-400', label: 'Worker' },
    { color: 'bg-cyan-300', label: 'Block' },
    { color: 'bg-violet-300', label: 'Replica / container' },
    { color: 'bg-rose-500', label: 'Failed' },
  ]
  return (
    <ul className="relative z-10 mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 text-[11px] text-zinc-500">
      {items.map((item) => (
        <li key={item.label} className="inline-flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${item.color}`} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
