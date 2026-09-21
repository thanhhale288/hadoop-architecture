export const FILE_NAME = 'sales.csv'
export const FILE_MB = 300
export const BLOCK_SIZE_MB = 128
export const REPLICATION_FACTOR = 3
export const WORKER_IDS = ['w1', 'w2', 'w3'] as const
export const KILL_TARGET = 'w2'

export type WorkerId = (typeof WORKER_IDS)[number]

export const WORKER_LABEL: Record<WorkerId, string> = {
  w1: 'Worker 1',
  w2: 'Worker 2',
  w3: 'Worker 3',
}

export const BLOCK_TONE: Record<string, string> = {
  b1: 'cyan',
  b2: 'violet',
  b3: 'amber',
}

export interface SceneCopy {
  id: string
  title: string
}

export const SCENES: SceneCopy[] = [
  { id: 'idle', title: 'Idle cluster' },
  { id: 'submit', title: 'Client submits job' },
  { id: 'split', title: 'HDFS splits file' },
  { id: 'place', title: 'Assign + replicate' },
  { id: 'yarn', title: 'YARN allocates' },
  { id: 'mapreduce', title: 'MapReduce parallel' },
  { id: 'failover', title: 'Worker 2 fails' },
  { id: 'complete', title: 'Job recovered' },
]

export const TAKEAWAYS = [
  { title: 'Distributed storage', body: 'Blocks spread across workers.' },
  { title: 'Parallelism', body: 'Workers process at the same time.' },
  { title: 'Coordination', body: 'Master assigns. Workers execute.' },
  { title: 'Fault tolerance', body: 'Replicas keep the job alive.' },
  { title: 'Scalability', body: 'Add workers for bigger jobs.' },
] as const
