import { Activity, Cpu, Database, Monitor, Server, ShieldAlert } from 'lucide-react'
import { SCENES } from '../simulation/scenario'

interface TopBarProps {
  sceneIndex: number
  presentation: boolean
  onTogglePresentation: () => void
}

export function TopBar({
  sceneIndex,
  presentation,
  onTogglePresentation,
}: TopBarProps) {
  const scene = SCENES[sceneIndex]!

  return (
    <header className="flex shrink-0 items-center gap-6 border-b border-white/8 bg-[#0c0c10] px-5 py-3">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-cyan-400 uppercase">
          Hadoop Cluster Lab
        </p>
        <p className="text-xs text-zinc-500">
          Unit 7 · Architecture · HDFS + YARN + MapReduce
        </p>
      </div>

      <div className="hidden min-w-0 flex-1 md:block">
        <div className="flex items-center gap-2">
          {SCENES.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  i < sceneIndex
                    ? 'bg-cyan-400/80'
                    : i === sceneIndex
                      ? 'bg-cyan-400'
                      : 'bg-zinc-800'
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <p className="truncate text-sm font-medium text-zinc-100">
            <span className="text-zinc-500">{scene.kicker} · </span>
            {scene.title}
          </p>
          <p className="shrink-0 font-mono text-xs text-zinc-500">
            {sceneIndex + 1} / {SCENES.length}
          </p>
        </div>
      </div>

      <div className="ml-auto hidden items-center gap-3 text-[11px] text-zinc-500 lg:flex">
        <span className="inline-flex items-center gap-1">
          <Server size={12} className="text-cyan-400" /> Master
        </span>
        <span className="inline-flex items-center gap-1">
          <Database size={12} className="text-emerald-400" /> HDFS
        </span>
        <span className="inline-flex items-center gap-1">
          <Cpu size={12} className="text-violet-400" /> YARN
        </span>
        <span className="inline-flex items-center gap-1">
          <Activity size={12} className="text-amber-400" /> MapReduce
        </span>
      </div>

      <button
        type="button"
        onClick={onTogglePresentation}
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
          presentation
            ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200'
            : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
        }`}
      >
        <Monitor size={14} />
        {presentation ? 'Presenting' : 'Presentation'}
      </button>
    </header>
  )
}

export function ScenarioStrip() {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-white/8 bg-[#0a0a0e] px-5 py-2 font-mono text-[11px] text-zinc-500">
      <span>
        FILE <span className="text-zinc-200">sales.csv</span>
      </span>
      <span>
        SIZE <span className="text-zinc-200">300 MB</span>
      </span>
      <span>
        BLOCK <span className="text-zinc-200">128 MB</span>
      </span>
      <span>
        RF <span className="text-zinc-200">×3</span>
      </span>
      <span>
        WORKERS <span className="text-zinc-200">3</span>
      </span>
      <span className="inline-flex items-center gap-1 text-zinc-600">
        <ShieldAlert size={11} /> HA-ready master
      </span>
    </div>
  )
}
