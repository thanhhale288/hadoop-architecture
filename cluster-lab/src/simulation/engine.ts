import {
  BLOCK_SIZE_MB,
  FILE_MB,
  FILE_NAME,
  KILL_TARGET,
  REPLICATION_FACTOR,
  SCENES,
  WORKER_IDS,
  type WorkerId,
} from './scenario'

export type JobStatus =
  | 'idle'
  | 'submitted'
  | 'splitting'
  | 'placing'
  | 'allocating'
  | 'mapping'
  | 'shuffling'
  | 'reducing'
  | 'recovering'
  | 'complete'

export type NodeStatus = 'healthy' | 'failed' | 'busy'
export type BlockProcessing = 'idle' | 'mapping' | 'done'
export type ContainerStatus = 'pending' | 'running' | 'killed' | 'complete' | 'reassigned'
export type EventSource = 'CLIENT' | 'MASTER' | 'YARN' | 'HDFS' | 'WORKER' | 'SYSTEM'

export interface Block {
  id: string
  label: string
  sizeMB: number
  locations: WorkerId[]
  primaryWorker: WorkerId
  processing: BlockProcessing
  mappedOn: WorkerId | null
}

export interface Container {
  id: string
  workerId: WorkerId
  vcores: number
  memMB: number
  status: ContainerStatus
  label: string
}

export interface ClusterEvent {
  id: string
  time: string
  source: EventSource
  message: string
}

export interface SimState {
  sceneIndex: number
  job: JobStatus
  fileAtClient: boolean
  resultReady: boolean
  workerStatus: Record<WorkerId, NodeStatus>
  blocks: Block[]
  containers: Container[]
  events: ClusterEvent[]
  underReplicated: boolean
}

export function splitFile(
  fileMB: number,
  blockSizeMB: number,
): Pick<Block, 'id' | 'label' | 'sizeMB'>[] {
  const blocks: Pick<Block, 'id' | 'label' | 'sizeMB'>[] = []
  let remaining = fileMB
  let n = 1
  while (remaining > 0) {
    const size = Math.min(blockSizeMB, remaining)
    blocks.push({ id: `b${n}`, label: `block-${n}`, sizeMB: size })
    remaining -= size
    n += 1
  }
  return blocks
}

export function placeReplicas(
  parts: Pick<Block, 'id' | 'label' | 'sizeMB'>[],
  workerIds: readonly WorkerId[],
  rf: number,
): Block[] {
  const factor = Math.min(rf, workerIds.length)
  return parts.map((part, i) => {
    const locations = workerIds.map(
      (_, r) => workerIds[(i + r) % workerIds.length]!,
    ).slice(0, factor)
    return {
      ...part,
      locations,
      primaryWorker: workerIds[i % workerIds.length]!,
      processing: 'idle',
      mappedOn: null,
    }
  })
}

export function blockEquation(fileMB: number, blockSizeMB: number): string {
  const parts = splitFile(fileMB, blockSizeMB)
  return `${fileMB} = ${parts.map((p) => p.sizeMB).join(' + ')}`
}

function stamp(sceneIndex: number, offset: number): string {
  const total = sceneIndex * 7 + offset
  const mm = String(Math.floor(total / 60)).padStart(2, '0')
  const ss = String(total % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

function ev(
  sceneIndex: number,
  offset: number,
  source: EventSource,
  message: string,
): ClusterEvent {
  return {
    id: `${sceneIndex}-${offset}-${source}`,
    time: stamp(sceneIndex, offset),
    source,
    message,
  }
}

const JOB_BY_SCENE: JobStatus[] = [
  'idle',
  'submitted',
  'splitting',
  'placing',
  'allocating',
  'mapping',
  'recovering',
  'complete',
]

function eventsThrough(sceneIndex: number): ClusterEvent[] {
  const log: ClusterEvent[] = [
    ev(0, 0, 'SYSTEM', 'cluster online'),
  ]

  if (sceneIndex >= 1) {
    log.push(ev(1, 0, 'CLIENT', `put ${FILE_NAME} ${FILE_MB} MB`))
  }
  if (sceneIndex >= 2) {
    log.push(ev(2, 0, 'HDFS', `${blockEquation(FILE_MB, BLOCK_SIZE_MB)} MB`))
  }
  if (sceneIndex >= 3) {
    const placed = placeReplicas(
      splitFile(FILE_MB, BLOCK_SIZE_MB),
      WORKER_IDS,
      REPLICATION_FACTOR,
    )
    placed.forEach((block, i) => {
      log.push(
        ev(3, i, 'MASTER', `${block.label} → ${block.primaryWorker} ×${REPLICATION_FACTOR}`),
      )
    })
  }
  if (sceneIndex >= 4) {
    log.push(ev(4, 0, 'YARN', 'containers on w1 w2 w3'))
  }
  if (sceneIndex >= 5) {
    log.push(ev(5, 0, 'WORKER', 'map parallel on all workers'))
  }
  if (sceneIndex >= 6) {
    log.push(
      ev(6, 0, 'SYSTEM', 'w2 failed'),
      ev(6, 1, 'MASTER', 'reassign block-2 → w3'),
    )
  }
  if (sceneIndex >= 7) {
    log.push(ev(7, 0, 'CLIENT', 'result ready'))
  }
  return log
}

export function buildState(sceneIndex: number): SimState {
  const idx = Math.max(0, Math.min(SCENES.length - 1, sceneIndex))
  const failed = idx >= 6
  const parts = splitFile(FILE_MB, BLOCK_SIZE_MB)
  const placed = placeReplicas(parts, WORKER_IDS, REPLICATION_FACTOR)

  let blocks: Block[] = []
  if (idx >= 2) {
    blocks = (idx >= 3 ? placed : parts.map((p) => ({
      ...p,
      locations: [] as WorkerId[],
      primaryWorker: WORKER_IDS[0],
      processing: 'idle' as const,
      mappedOn: null,
    })))
  }

  if (failed) {
    blocks = blocks.map((block) => {
      const locations = block.locations.filter((id) => id !== KILL_TARGET)
      const mapping = block.id === 'b2'
      return {
        ...block,
        locations,
        processing: mapping && idx < 7 ? 'mapping' : 'done',
        mappedOn: mapping ? 'w3' : block.primaryWorker === KILL_TARGET ? 'w3' : block.primaryWorker,
      }
    })
  } else if (idx >= 5) {
    blocks = blocks.map((block) => ({
      ...block,
      processing: 'mapping',
      mappedOn: block.primaryWorker,
    }))
  }

  if (idx >= 7) {
    blocks = blocks.map((block) => ({ ...block, processing: 'done' }))
  }

  const allocating = idx === 4 || idx === 5
  const workerStatus: Record<WorkerId, NodeStatus> = {
    w1: allocating ? 'busy' : 'healthy',
    w2: failed ? 'failed' : allocating ? 'busy' : 'healthy',
    w3: failed && idx < 7 ? 'busy' : allocating ? 'busy' : 'healthy',
  }

  let containers: Container[] = []
  if (idx >= 4) {
    containers = WORKER_IDS.map((id, i) => ({
      id: `c${i + 1}`,
      workerId: id,
      vcores: 2,
      memMB: 2048,
      status:
        failed && id === KILL_TARGET
          ? 'killed'
          : idx >= 7
            ? 'complete'
            : idx >= 5
              ? 'running'
              : 'pending',
      label: `map-${i + 1}`,
    }))
  }
  if (failed) {
    containers = [
      ...containers.filter((c) => c.workerId !== KILL_TARGET),
      {
        id: 'c4',
        workerId: 'w3',
        vcores: 2,
        memMB: 2048,
        status: idx >= 7 ? 'complete' : 'reassigned',
        label: 'map-2 (reassigned)',
      },
    ]
    if (idx < 7) {
      containers.push({
        id: 'c2-dead',
        workerId: 'w2',
        vcores: 2,
        memMB: 2048,
        status: 'killed',
        label: 'map-2',
      })
    }
  }

  return {
    sceneIndex: idx,
    job: JOB_BY_SCENE[idx] ?? 'idle',
    fileAtClient: idx >= 1,
    resultReady: idx >= 7,
    workerStatus,
    blocks,
    containers,
    events: eventsThrough(idx),
    underReplicated: failed,
  }
}

export const LAST_SCENE = SCENES.length - 1
export const FAIL_SCENE = 6
