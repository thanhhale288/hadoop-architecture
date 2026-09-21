import { AlertTriangle } from 'lucide-react'
import { blockEquation, type SimState } from '../simulation/engine'
import {
  BLOCK_SIZE_MB,
  FILE_MB,
  FILE_NAME,
  SCENES,
  WORKER_IDS,
  WORKER_LABEL,
} from '../simulation/scenario'

interface InspectorProps {
  state: SimState
  mrStage: 'map' | 'shuffle' | 'reduce'
}

export function Inspector({ state, mrStage }: InspectorProps) {
  const scene = SCENES[state.sceneIndex]!

  return (
    <aside className="flex h-full min-h-0 flex-col bg-[#0c0c11] lg:border-l lg:border-white/8">
      <div className="border-b border-white/8 px-3 py-3 sm:px-4">
        <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">{scene.title}</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-3 py-3 sm:px-4">
        {state.sceneIndex === 0 ? <IdleView /> : null}
        {state.sceneIndex === 1 ? <SubmitView /> : null}
        {state.sceneIndex === 2 ? <SplitView /> : null}
        {state.sceneIndex === 3 ? <ReplicaMatrix state={state} /> : null}
        {state.sceneIndex === 4 ? <YarnView state={state} /> : null}
        {state.sceneIndex === 5 ? <MapReduceView mrStage={mrStage} /> : null}
        {state.sceneIndex === 6 ? <RecoveryView state={state} /> : null}
        {state.sceneIndex === 7 ? <CompleteView /> : null}
      </div>
    </aside>
  )
}

function IdleView() {
  return (
    <dl className="grid grid-cols-2 gap-2 text-sm sm:text-base">
      <Stat k="Master" v="1" />
      <Stat k="Workers" v="3" />
      <Stat k="Storage" v="HDFS" />
      <Stat k="Compute" v="MapReduce" />
    </dl>
  )
}

function SubmitView() {
  return (
    <dl className="grid grid-cols-2 gap-2 text-sm sm:text-base">
      <Stat k="File" v={FILE_NAME} />
      <Stat k="Size" v={`${FILE_MB} MB`} />
    </dl>
  )
}

function SplitView() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-3 font-mono text-base text-cyan-100 sm:text-lg">
        {blockEquation(FILE_MB, BLOCK_SIZE_MB)} MB
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm sm:text-base">
        <Stat k="Block size" v={`${BLOCK_SIZE_MB} MB`} />
        <Stat k="Blocks" v="3" />
      </dl>
    </div>
  )
}

function ReplicaMatrix({ state }: { state: SimState }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[240px] border-collapse text-center font-mono text-sm">
          <thead>
            <tr className="text-zinc-500">
              <th className="pb-2 text-left font-medium">Block</th>
              {WORKER_IDS.map((id) => (
                <th key={id} className="pb-2 font-medium">
                  {id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.blocks.map((block) => (
              <tr key={block.id} className="border-t border-white/8">
                <td className="py-2.5 text-left text-zinc-200">
                  {block.label}
                  <span className="ml-1 text-zinc-500">{block.sizeMB}</span>
                </td>
                {WORKER_IDS.map((id) => {
                  const has = block.locations.includes(id)
                  const dead = state.workerStatus[id] === 'failed'
                  return (
                    <td key={id} className="py-2.5">
                      <span
                        className={`inline-flex size-7 items-center justify-center rounded font-mono text-xs ${
                          !has
                            ? 'bg-zinc-800 text-zinc-600'
                            : dead
                              ? 'bg-rose-500/20 text-rose-300'
                              : block.primaryWorker === id
                                ? 'bg-cyan-400/20 text-cyan-200'
                                : 'bg-violet-400/20 text-violet-200'
                        }`}
                      >
                        {!has ? '·' : dead ? '×' : block.primaryWorker === id ? 'P' : 'R'}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-zinc-500 sm:text-sm">P primary · R replica</p>
    </div>
  )
}

function YarnView({ state }: { state: SimState }) {
  return (
    <ul className="space-y-2">
      {state.containers
        .filter((c) => c.status !== 'killed')
        .map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/3 px-3 py-2.5"
          >
            <p className="text-base text-zinc-100">{WORKER_LABEL[c.workerId]}</p>
            <p className="font-mono text-sm text-violet-300">
              {c.vcores}v · {c.memMB} MB
            </p>
          </li>
        ))}
    </ul>
  )
}

function MapReduceView({ mrStage }: { mrStage: 'map' | 'shuffle' | 'reduce' }) {
  const stages = ['map', 'shuffle', 'reduce'] as const
  return (
    <ol className="space-y-2">
      {stages.map((stage) => {
        const active = stage === mrStage
        return (
          <li
            key={stage}
            className={`rounded-lg border px-3 py-2.5 text-base font-medium capitalize ${
              active
                ? 'border-amber-400/40 bg-amber-400/10 text-zinc-50'
                : 'border-white/8 text-zinc-500'
            }`}
          >
            {stage}
          </li>
        )
      })}
    </ol>
  )
}

function RecoveryView({ state }: { state: SimState }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-950/40 px-3 py-2.5 text-base text-rose-100">
        <AlertTriangle size={18} className="shrink-0 text-rose-400" />
        W2 down · map → W3 · no data lost
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm sm:text-base">
        <Stat k="Data lost" v="none" />
        <Stat k="Reassigned" v="block-2 → w3" />
      </dl>
      <ReplicaMatrix state={state} />
    </div>
  )
}

function CompleteView() {
  return (
    <dl className="grid grid-cols-2 gap-2 text-sm sm:text-base">
      <Stat k="Output" v="ready" />
      <Stat k="Failed nodes" v="1" />
      <Stat k="Lost blocks" v="0" />
      <Stat k="Job" v="complete" />
    </dl>
  )
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-white/8 bg-white/3 px-3 py-2.5">
      <dt className="text-xs tracking-wide text-zinc-500 uppercase">{k}</dt>
      <dd className="mt-0.5 font-medium text-zinc-100">{v}</dd>
    </div>
  )
}
