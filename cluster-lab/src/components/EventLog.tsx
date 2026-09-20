import { useEffect, useRef } from 'react'
import type { ClusterEvent } from '../simulation/engine'

const SOURCE_COLOR: Record<ClusterEvent['source'], string> = {
  CLIENT: 'text-zinc-300',
  MASTER: 'text-cyan-300',
  YARN: 'text-violet-300',
  HDFS: 'text-emerald-300',
  WORKER: 'text-amber-300',
  SYSTEM: 'text-zinc-500',
}

interface EventLogProps {
  events: ClusterEvent[]
}

export function EventLog({ events }: EventLogProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [events.length])

  return (
    <section className="flex h-full min-h-0 flex-col border-t border-white/8 bg-[#07070b]">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
          Cluster events
        </p>
        <p className="font-mono text-[10px] text-zinc-600">{events.length} lines</p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-2 font-mono text-[11px] leading-6">
        {events.map((event) => (
          <p key={event.id} className="flex gap-3">
            <span className="shrink-0 text-zinc-600">{event.time}</span>
            <span className={`w-16 shrink-0 ${SOURCE_COLOR[event.source]}`}>
              {event.source}
            </span>
            <span className="text-zinc-300">{event.message}</span>
          </p>
        ))}
        <div ref={endRef} />
      </div>
    </section>
  )
}
