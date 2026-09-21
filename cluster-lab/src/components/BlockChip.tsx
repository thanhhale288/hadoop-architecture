import { motion } from 'framer-motion'
import { BLOCK_TONE } from '../simulation/scenario'

const TONE: Record<string, string> = {
  cyan: 'border-cyan-400/50 bg-cyan-400/15 text-cyan-100',
  violet: 'border-violet-400/50 bg-violet-400/15 text-violet-100',
  amber: 'border-amber-400/50 bg-amber-400/15 text-amber-100',
}

interface BlockChipProps {
  id: string
  label: string
  sizeMB: number
  replica?: boolean
  mapping?: boolean
  layoutId?: string
}

export function BlockChip({
  id,
  label,
  sizeMB,
  replica,
  mapping,
  layoutId,
}: BlockChipProps) {
  const tone = TONE[BLOCK_TONE[id] ?? 'cyan'] ?? TONE.cyan

  return (
    <motion.div
      layoutId={layoutId}
      layout
      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 font-mono text-xs sm:text-sm ${tone} ${
        mapping ? 'ring-1 ring-amber-300/80' : ''
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className="opacity-70">{sizeMB}</span>
      {replica ? <span className="opacity-50">r</span> : null}
    </motion.div>
  )
}
