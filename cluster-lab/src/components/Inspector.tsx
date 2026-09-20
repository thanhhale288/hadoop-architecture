import { AlertTriangle } from 'lucide-react'
import { blockEquation, type SimState } from '../simulation/engine'
import {
  BLOCK_SIZE_MB,
  FILE_MB,
  FILE_NAME,
  REPLICATION_FACTOR,
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
    <aside className="flex h-full min-h-0 flex-col border-b border-white/8 bg-[#0c0c11] lg:border-b-0 lg:border-l">
      <div className="border-b border-white/8 px-4 py-3">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
          Inspector
        </p>
        <h2 className="mt-1 text-base font-semibold text-zinc-100">{scene.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{scene.narration}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-3">
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
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <Stat k="Master" v="1 · HA-ready" />
      <Stat k="Workers" v="3 · commodity" />
      <Stat k="Storage" v="HDFS" />
      <Stat k="Resources" v="YARN" />
      <Stat k="Processing" v="MapReduce" />
      <Stat k="Job" v="idle" />
    </dl>
  )
}

function SubmitView() {
  return (
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <Stat k="File" v={FILE_NAME} />
      <Stat k="Size" v={`${FILE_MB} MB`} />
      <Stat k="Pattern" v="write once, read many" />
      <Stat k="Job" v="submitted" />
    </dl>
  )
}

function SplitView() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-3 font-mono text-sm text-cyan-100">
        {blockEquation(FILE_MB, BLOCK_SIZE_MB)} MB
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <Stat k="Block size" v={`${BLOCK_SIZE_MB} MB`} />
        <Stat k="Blocks" v="3" />
        <Stat k="Last block" v="44 MB" />
        <Stat k="Padding" v="none" />
      </dl>
      <p className="text-xs leading-relaxed text-zinc-500">
        HDFS does not waste the remaining 84 MB on disk. Mapper tasks later process one block each.
      </p>
    </div>
  )
}

function ReplicaMatrix({ state }: { state: SimState }) {
  return (
    <div>
      <p className="mb-2 text-xs text-zinc-500">
        Replication factor {REPLICATION_FACTOR}. Primary placement plus copies on the other workers.
      </p>
      <table className="w-full border-collapse text-center font-mono text-xs">
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
              <td className="py-2 text-left text-zinc-300">
                {block.label}
                <span className="ml-1 text-zinc-600">{block.sizeMB}</span>
              </td>
              {WORKER_IDS.map((id) => {
                const has = block.locations.includes(id)
                const dead = state.workerStatus[id] === 'failed'
                return (
                  <td key={id} className="py-2">
                    <span
                      className={`inline-flex size-6 items-center justify-center rounded font-mono text-[10px] ${
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
      <p className="mt-3 text-[11px] text-zinc-500">
        P = primary · R = replica · × = node lost
      </p>
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
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/3 px-3 py-2"
          >
            <div>
              <p className="text-sm text-zinc-200">{WORKER_LABEL[c.workerId]}</p>
              <p className="font-mono text-[11px] text-zinc-500">{c.label}</p>
            </div>
            <p className="font-mono text-xs text-violet-300">
              {c.vcores} vCPU · {c.memMB} MB
            </p>
          </li>
        ))}
    </ul>
  )
}

function MapReduceView({ mrStage }: { mrStage: 'map' | 'shuffle' | 'reduce' }) {
  const stages = [
    { id: 'map', title: 'Map', body: 'Each block becomes key/value pairs on its worker.' },
    { id: 'shuffle', title: 'Shuffle', body: 'Pairs with the same key move together.' },
    { id: 'reduce', title: 'Reduce', body: 'Values are merged. Output lands back on HDFS.' },
  ] as const
  return (
    <ol className="space-y-2">
      {stages.map((stage) => {
        const active = stage.id === mrStage
        return (
          <li
            key={stage.id}
            className={`rounded-lg border px-3 py-2 ${
              active
                ? 'border-amber-400/40 bg-amber-400/10'
                : 'border-white/8 bg-transparent opacity-60'
            }`}
          >
            <p className="text-sm font-medium text-zinc-100">{stage.title}</p>
            <p className="text-xs text-zinc-400">{stage.body}</p>
          </li>
        )
      })}
    </ol>
  )
}

function RecoveryView({ state }: { state: SimState }) {
  const remaining = state.blocks.reduce((n, b) => n + b.locations.length, 0)
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-950/40 px-3 py-2 text-sm text-rose-100">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-400" />
        Worker 2 missed its heartbeat. Container killed. Data still on W1 and W3.
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <Stat k="Under-replicated" v={state.underReplicated ? 'yes' : 'no'} />
        <Stat k="Replicas left" v={`${remaining}`} />
        <Stat k="Reassigned" v="block-2 map → w3" />
        <Stat k="Data lost" v="none" />
      </dl>
      <ReplicaMatrix state={state} />
    </div>
  )
}

function CompleteView() {
  return (
    <div className="space-y-2">
      <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
        Job complete. Result is on HDFS even though Worker 2 never recovered.
      </p>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <Stat k="Output" v="part-r-00000" />
        <Stat k="Failed nodes" v="1" />
        <Stat k="Lost blocks" v="0" />
        <Stat k="Job" v="complete" />
      </dl>
    </div>
  )
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-white/8 bg-white/3 px-2.5 py-2">
      <dt className="text-[10px] tracking-wide text-zinc-500 uppercase">{k}</dt>
      <dd className="mt-0.5 text-zinc-100">{v}</dd>
    </div>
  )
}
