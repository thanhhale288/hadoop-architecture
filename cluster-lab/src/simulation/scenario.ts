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
  kicker: string
  narration: string
}

export const SCENES: SceneCopy[] = [
  {
    id: 'idle',
    title: 'Idle cluster',
    kicker: 'Commodity machines',
    narration:
      'Hadoop runs on a cluster of ordinary machines, not one supercomputer. The master coordinates. Workers store data and run tasks.',
  },
  {
    id: 'submit',
    title: 'Client submits a job',
    kicker: 'Write once, read many',
    narration:
      'The client uploads sales.csv (300 MB) and asks the cluster to store and process it. The master accepts the request.',
  },
  {
    id: 'split',
    title: 'HDFS splits the file',
    kicker: 'Default block size 128 MB',
    narration:
      'A single disk cannot hold huge files cleanly. HDFS breaks the file into blocks: 128 + 128 + 44 MB. The last block is not padded.',
  },
  {
    id: 'place',
    title: 'Master assigns and replicates',
    kicker: 'Replication factor ×3',
    narration:
      'The master coordinates placement. Workers store the blocks. Each block is copied three times so one machine can fail without losing data.',
  },
  {
    id: 'yarn',
    title: 'YARN allocates resources',
    kicker: 'Resource management layer',
    narration:
      'YARN is the resource layer. The ResourceManager places containers on workers — CPU and memory — so processing can start next to the data.',
  },
  {
    id: 'mapreduce',
    title: 'MapReduce runs in parallel',
    kicker: 'Compute moves to the data',
    narration:
      'Each worker maps its block at the same time. Shuffle groups the keys. Reduce writes one result back to HDFS.',
  },
  {
    id: 'failover',
    title: 'Worker 2 fails',
    kicker: 'Fault tolerance',
    narration:
      'Worker 2 is gone. Replicas still live on healthy nodes, so no block is lost. The master reassigns the unfinished map to Worker 3.',
  },
  {
    id: 'complete',
    title: 'Job recovered',
    kicker: 'Cluster still delivers',
    narration:
      'The job finishes without Worker 2. Centralized coordination plus distributed storage and processing keeps the result available.',
  },
]

export const TAKEAWAYS = [
  {
    title: 'Distributed storage',
    body: 'The file is split into blocks and spread across workers.',
  },
  {
    title: 'Parallelism',
    body: 'Workers process different blocks at the same time.',
  },
  {
    title: 'Centralized coordination',
    body: 'The master assigns work. Workers store and execute.',
  },
  {
    title: 'Fault tolerance',
    body: 'Replicas and reassignment keep the job alive after a node dies.',
  },
  {
    title: 'Scalability',
    body: 'Add workers to store more data and finish larger jobs.',
  },
] as const
