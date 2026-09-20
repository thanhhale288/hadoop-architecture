# Hadoop Cluster Lab

Offline, projector-ready simulator for **Unit 7: Hadoop Architecture**.

No Hadoop install. No backend. Open it, click through eight scenes, then press **K** to kill Worker 2.

## Run

```bash
cd cluster-lab
npm install
npm run dev
```

Build a static copy for class (then `npm run preview`):

```bash
npm run build
npm run preview
```

## Live demo (about 4 minutes)

Default scenario: `sales.csv` 300 MB, 128 MB HDFS blocks, 3 workers, replication factor 3.

| Key | Action |
| --- | --- |
| Space | Play / pause autoplay |
| → / ← | Next / previous scene |
| K | Kill Worker 2 |
| R | Replay from idle |
| P | Presentation mode |

Or use the bar: **Play scene**, **Next**, **Kill Worker 2**, **Replay**.

## What it shows

1. Idle commodity cluster
2. Client submits the file
3. HDFS split `300 = 128 + 128 + 44`
4. Master places blocks and replicas
5. YARN allocates containers
6. MapReduce runs in parallel
7. Worker 2 fails; map reassigned
8. Job completes; five architecture takeaways

Master coordinates. Workers store and process. The next group can still own NameNode vs DataNode internals.
