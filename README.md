# Hadoop Architecture

Unit 7 demo and notes for **Hadoop Architecture** (HDFS + YARN + MapReduce).

## Hadoop Cluster Lab

Offline, projector-ready web simulator in [`cluster-lab/`](cluster-lab/).

No Hadoop install. No backend. Walk through eight scenes: client upload → block split → replication → YARN → MapReduce → worker failure → recovery.

### Run

```bash
cd cluster-lab
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/).

### Live controls

| Key | Action |
| --- | --- |
| Space | Play / pause |
| → / ← | Next / previous scene |
| K | Kill Worker 2 |
| R | Replay |
| P | Presentation mode |

Default scenario: `sales.csv` 300 MB, 128 MB HDFS blocks, 3 workers, replication factor 3.

## Notes

[`Nhom 7 bigdata.md`](Nhom%207%20bigdata.md) — presentation outline and simulation script for the group.
