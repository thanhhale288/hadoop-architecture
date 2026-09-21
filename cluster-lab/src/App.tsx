import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClusterCanvas } from './components/ClusterCanvas'
import { EventLog } from './components/EventLog'
import { Inspector } from './components/Inspector'
import { PlaybackBar } from './components/PlaybackBar'
import { TakeawaysOverlay } from './components/TakeawaysOverlay'
import { ScenarioStrip, TopBar } from './components/TopBar'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { buildState, FAIL_SCENE, LAST_SCENE } from './simulation/engine'

type MrStage = 'map' | 'shuffle' | 'reduce'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const [sceneIndex, setSceneIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [presentation, setPresentation] = useState(false)
  const [takeaways, setTakeaways] = useState(false)
  const [mrStage, setMrStage] = useState<MrStage>('map')

  const state = useMemo(() => buildState(sceneIndex), [sceneIndex])
  const delay = reducedMotion ? 500 : 2600

  const go = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(LAST_SCENE, next))
    setSceneIndex(clamped)
    if (clamped !== LAST_SCENE) setTakeaways(false)
  }, [])

  const onNext = useCallback(() => go(sceneIndex + 1), [go, sceneIndex])
  const onPrev = useCallback(() => {
    setPlaying(false)
    go(sceneIndex - 1)
  }, [go, sceneIndex])
  const onKill = useCallback(() => {
    setPlaying(false)
    go(FAIL_SCENE)
  }, [go])
  const onReplay = useCallback(() => {
    setPlaying(false)
    setTakeaways(false)
    setMrStage('map')
    go(0)
  }, [go])

  useEffect(() => {
    document.documentElement.classList.toggle('presentation', presentation)
  }, [presentation])

  useEffect(() => {
    if (!playing) return
    if (sceneIndex >= LAST_SCENE) {
      setPlaying(false)
      return
    }
    const t = window.setTimeout(() => go(sceneIndex + 1), delay)
    return () => window.clearTimeout(t)
  }, [playing, sceneIndex, delay, go])

  useEffect(() => {
    if (sceneIndex !== 5) {
      setMrStage('map')
      return
    }
    const step = reducedMotion ? 400 : 1600
    const a = window.setTimeout(() => setMrStage('shuffle'), step)
    const b = window.setTimeout(() => setMrStage('reduce'), step * 2)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [sceneIndex, reducedMotion])

  useEffect(() => {
    if (sceneIndex !== LAST_SCENE) return
    const t = window.setTimeout(() => setTakeaways(true), reducedMotion ? 200 : 900)
    return () => window.clearTimeout(t)
  }, [sceneIndex, reducedMotion])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        setPlaying((p) => !p)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setPlaying(false)
        go(sceneIndex + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setPlaying(false)
        go(sceneIndex - 1)
      } else if (e.key === 'k' || e.key === 'K') {
        onKill()
      } else if (e.key === 'r' || e.key === 'R') {
        onReplay()
      } else if (e.key === 'p' || e.key === 'P') {
        setPresentation((v) => !v)
      } else if (e.key === 'Escape') {
        setTakeaways(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onKill, onReplay, sceneIndex])

  return (
    <div
      className={`flex min-h-dvh flex-col bg-[#07070a] text-zinc-200 lg:h-dvh lg:min-h-0 lg:overflow-hidden ${
        presentation ? 'presentation' : ''
      }`}
    >
      <TopBar
        sceneIndex={sceneIndex}
        presentation={presentation}
        onTogglePresentation={() => setPresentation((v) => !v)}
      />
      <ScenarioStrip />

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.95fr)] lg:overflow-hidden">
        <div className="relative flex min-h-[420px] flex-col sm:min-h-[480px] lg:min-h-0">
          <ClusterCanvas state={state} reducedMotion={reducedMotion} />
        </div>

        <div className="flex min-h-0 flex-col border-t border-white/8 lg:border-t-0">
          <div className="min-h-0 lg:flex lg:min-h-0 lg:flex-[1.15] lg:flex-col">
            <Inspector state={state} mrStage={mrStage} />
          </div>
          <div className="flex h-48 shrink-0 flex-col sm:h-56 lg:h-auto lg:min-h-0 lg:flex-[0.85]">
            <EventLog events={state.events} />
          </div>
        </div>
      </div>

      <PlaybackBar
        sceneIndex={sceneIndex}
        playing={playing}
        onPlay={() => {
          if (sceneIndex >= LAST_SCENE) {
            go(0)
          }
          setPlaying(true)
        }}
        onPause={() => setPlaying(false)}
        onNext={onNext}
        onPrev={onPrev}
        onKill={onKill}
        onReplay={onReplay}
        onTakeaways={() => setTakeaways(true)}
      />
      <TakeawaysOverlay
        open={takeaways}
        onClose={() => setTakeaways(false)}
        reducedMotion={reducedMotion}
      />
    </div>
  )
}
