import { ChevronRight, Play, RotateCcw, Skull, Square } from 'lucide-react'
import { FAIL_SCENE, LAST_SCENE } from '../simulation/engine'

interface PlaybackBarProps {
  sceneIndex: number
  playing: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
  onKill: () => void
  onReplay: () => void
  onTakeaways: () => void
}

export function PlaybackBar({
  sceneIndex,
  playing,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onKill,
  onReplay,
  onTakeaways,
}: PlaybackBarProps) {
  const canKill = sceneIndex < FAIL_SCENE
  const canNext = sceneIndex < LAST_SCENE

  return (
    <footer className="sticky bottom-0 z-20 flex shrink-0 flex-wrap items-center gap-2 border-t border-white/8 bg-[#0c0c10]/95 px-3 py-2.5 backdrop-blur sm:px-4">
      <button
        type="button"
        onClick={playing ? onPause : onPlay}
        className="inline-flex items-center gap-1.5 rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-300"
      >
        {playing ? <Square size={15} /> : <Play size={15} />}
        {playing ? 'Pause' : 'Play'}
      </button>
      <button
        type="button"
        onClick={onPrev}
        disabled={sceneIndex === 0}
        className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 disabled:opacity-30"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="inline-flex items-center gap-1 rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 disabled:opacity-30"
      >
        Next <ChevronRight size={15} />
      </button>
      <button
        type="button"
        onClick={onKill}
        disabled={!canKill}
        className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-900/60 disabled:opacity-30"
      >
        <Skull size={15} />
        Kill W2
      </button>
      <button
        type="button"
        onClick={onReplay}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
      >
        <RotateCcw size={15} />
        Replay
      </button>
      {sceneIndex === LAST_SCENE ? (
        <button
          type="button"
          onClick={onTakeaways}
          className="rounded-md border border-cyan-400/30 px-3 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-400/10"
        >
          Takeaways
        </button>
      ) : null}
    </footer>
  )
}
