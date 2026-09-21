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
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [events.length])

  return (
    <section className="flex h-full min-h-0 flex-col border-t border-white/8 bg-[#07070b]">
      <div className="flex items-center justify-between border-b border-white/8 px-3 py-2 sm:px-4">
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
          Events
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-xs leading-6 sm:px-4 sm:text-sm sm:leading-7">
        {events.map((event) => (
          <p key={event.id} className="flex flex-wrap gap-x-2 gap-y-0.5 sm:flex-nowrap sm:gap-3">
            <span className="shrink-0 text-zinc-600">{event.time}</span>
            <span className={`w-14 shrink-0 sm:w-16 ${SOURCE_COLOR[event.source]}`}>
              {event.source}
            </span>
            <span className="min-w-0 break-words text-zinc-300">{event.message}</span>
          </p>
        ))}
        <div ref={endRef} />
      </div>
    </section>
  )
}
