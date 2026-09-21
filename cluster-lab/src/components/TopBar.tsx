import { Monitor } from 'lucide-react'
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
    <header className="flex shrink-0 items-center gap-4 border-b border-white/8 bg-[#0c0c10] px-3 py-3 sm:gap-6 sm:px-5">
      <p className="shrink-0 text-sm font-semibold tracking-wide text-cyan-400 sm:text-base">
        Hadoop Cluster Lab
      </p>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {SCENES.map((s, i) => (
            <div
              key={s.id}
              className={`h-2 flex-1 rounded-full ${
                i < sceneIndex
                  ? 'bg-cyan-400/80'
                  : i === sceneIndex
                    ? 'bg-cyan-400'
                    : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate text-base font-semibold text-zinc-100 sm:text-lg">
            {scene.title}
          </p>
          <p className="shrink-0 font-mono text-sm text-zinc-400">
            {sceneIndex + 1}/{SCENES.length}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onTogglePresentation}
        className={`inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
          presentation
            ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200'
            : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
        }`}
        aria-label={presentation ? 'Exit presentation' : 'Presentation mode'}
      >
        <Monitor size={16} />
        <span className="hidden sm:inline">{presentation ? 'Presenting' : 'Present'}</span>
      </button>
    </header>
  )
}

export function ScenarioStrip() {
  return (
    <div className="flex shrink-0 gap-x-4 overflow-x-auto border-b border-white/8 bg-[#0a0a0e] px-3 py-2.5 font-mono text-xs text-zinc-400 sm:gap-x-5 sm:px-5 sm:text-sm">
      <span className="shrink-0 whitespace-nowrap">
        <span className="text-zinc-200">sales.csv</span> 300 MB
      </span>
      <span className="shrink-0 whitespace-nowrap">
        block <span className="text-zinc-200">128 MB</span>
      </span>
      <span className="shrink-0 whitespace-nowrap">
        RF <span className="text-zinc-200">×3</span>
      </span>
      <span className="shrink-0 whitespace-nowrap">
        workers <span className="text-zinc-200">3</span>
      </span>
    </div>
  )
}
