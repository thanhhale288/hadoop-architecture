import { AlertTriangle, Database, Laptop, Server } from 'lucide-react'
import type { ReactNode } from 'react'
import type { NodeStatus } from '../simulation/engine'

interface NodeCardProps {
  title: string
  subtitle: string
  status: NodeStatus | 'client'
  icon: 'client' | 'master' | 'worker'
  badge?: string
  failed?: boolean
  children?: ReactNode
  className?: string
}

const ICONS = {
  client: Laptop,
  master: Server,
  worker: Database,
}

export function NodeCard({
  title,
  subtitle,
  status,
  icon,
  badge,
  failed,
  children,
  className = '',
}: NodeCardProps) {
  const Icon = ICONS[icon]
  const down = failed || status === 'failed'
  const ring = down
    ? 'border-rose-500/50 bg-rose-950/40 opacity-70'
    : status === 'busy'
      ? 'border-cyan-400/35 bg-[#12121a] shadow-[0_0_24px_rgba(34,211,238,0.08)]'
      : icon === 'master'
        ? 'border-cyan-400/25 bg-[#12121a]'
        : 'border-white/10 bg-[#12121a]'

  return (
    <article
      className={`relative flex h-full min-h-0 min-w-0 flex-col rounded-xl border p-4 ${ring} ${className}`}
    >
      {down ? (
        <span className="absolute -top-2 right-3 inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-950 px-2 py-0.5 font-mono text-[10px] text-rose-300">
          <AlertTriangle size={10} /> FAILED
        </span>
      ) : null}
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
            down
              ? 'bg-rose-500/15 text-rose-300'
              : icon === 'master'
                ? 'bg-cyan-400/10 text-cyan-300'
                : icon === 'client'
                  ? 'bg-zinc-800 text-zinc-300'
                  : 'bg-emerald-400/10 text-emerald-300'
          }`}
        >
          <Icon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-zinc-100">{title}</h3>
            {badge ? (
              <span className="rounded-full border border-white/10 px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-zinc-400 uppercase">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="text-[11px] text-zinc-500">{subtitle}</p>
        </div>
        {status !== 'client' && !down ? (
          <span
            className={`mt-1 size-2 shrink-0 rounded-full ${
              status === 'busy' ? 'bg-cyan-400' : 'bg-emerald-400'
            }`}
          />
        ) : null}
      </div>
      {children ? (
        <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">{children}</div>
      ) : null}
    </article>
  )
}
