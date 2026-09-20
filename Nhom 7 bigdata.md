# Khác 2 nhóm

Đúng là bạn đang chạm vào **hai chủ đề rất dễ bị trùng nhau**, vì Hadoop architecture và NameNode/DataNode đều nằm trong mô hình master–slave. Nhưng **nhóm bạn và nhóm sau hoàn toàn có thể tách biệt rõ**.

Làm **Hadoop HDFS** để simulation. Như vậy sẽ đúng context và dễ giải thích hơn.

## **1\. Hai nhóm khác nhau ở đâu?**

Có thể hiểu đơn giản:

| Nhóm bạn | Nhóm sau |
| ----- | ----- |
| **Hadoop Architecture – Master/Slave Simulation** | **Master-Slave Architecture – NameNode & DataNode Roles** |
| Tập trung vào **kiến trúc tổng thể** | Tập trung vào **vai trò cụ thể của NameNode và DataNode** |
| Master và Slave **phối hợp với nhau như thế nào** | NameNode và DataNode **mỗi bên làm gì** |
| Simulation \= đóng vai các components | Activity \= đóng vai **NameNode vs DataNode** |
| Focus: **workflow / interaction** | Focus: **responsibility / role** |

Nói ngắn gọn:

> **Nhóm bạn nên trả lời: "How does the Hadoop architecture work?"**

Còn nhóm sau:

> **"What does the NameNode do, and what does the DataNode do?"**

---

# **2\. Nhóm bạn nên làm simulation như thế nào?**

Tôi khuyên **đừng làm simulation kiểu đơn giản "tôi là Master, bạn là Slave"**, vì nhóm sau sẽ làm gần như y hệt.

Thay vào đó, hãy mô phỏng **một request thực tế đi qua Hadoop architecture**.

Ví dụ:

### **Scenario: A user wants to store a large file**

Có 4–5 người:

**Person 1 — Client**

> "I want to upload a 300 MB file."

**Person 2 — Master / NameNode**

> "I will manage the metadata and decide where the file blocks should be stored."

**Person 3 — DataNode 1**

> "I store Block 1."

**Person 4 — DataNode 2**

> "I store Block 2."

**Person 5 — DataNode 3**

> "I store Block 3."

Sau đó cho một tình huống:

> **DataNode 2 fails.**

NameNode phát hiện:

> "DataNode 2 is no longer available. I need to replicate the missing block to another DataNode."

Đây sẽ là điểm rất tốt của simulation vì bạn thể hiện được:

**Master → coordinates**

**Slaves → perform/store**

và đặc biệt:

**Distributed storage \+ fault tolerance**

---

# **3\. Nhưng nhóm sau cũng làm NameNode/DataNode thì sao?**

Đây chính là chỗ bạn cần **giới hạn scope**.

### **Nhóm bạn:**

Đừng đi sâu vào:

> "NameNode stores metadata."

> "DataNode stores blocks."

> "NameNode sends instructions to DataNodes."

Bạn **chỉ cần nói ở mức architecture**:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hadoop

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌────────┴────────┐

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│                 │

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Master            Slaves

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│                 │

&nbsp;&nbsp;&nbsp;&nbsp;NameNode       DataNode  DataNode

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DataNode

Sau đó simulation tập trung vào **interaction**:

Client

&nbsp;&nbsp;&nbsp;↓

Master

&nbsp;&nbsp;&nbsp;↓

DataNodes

&nbsp;&nbsp;&nbsp;↓

Store / Process Data

### **Nhóm sau:**

Họ có thể lấy chính hai thành phần đó làm subject:

NameNode

&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;├── Manage metadata

&nbsp;&nbsp;&nbsp;├── Track DataNodes

&nbsp;&nbsp;&nbsp;└── Manage file namespace

&nbsp;

DataNode

&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;├── Store data blocks

&nbsp;&nbsp;&nbsp;├── Read/write data

&nbsp;&nbsp;&nbsp;└── Send heartbeat

Họ sẽ **đào sâu vào từng role**.

---

# **4\. Tôi đề xuất simulation của nhóm bạn**

Nếu activity yêu cầu **"Master-Slave Roles"**, tôi sẽ làm khoảng **5–7 phút**, theo scenario:

### **🎬 "Hadoop receives a large file"**

**Scene 1 — Client sends request**

Client:

> "I have a large file. I want to store it in Hadoop."

Master:

> "I will coordinate how this file is stored across the cluster."

---

**Scene 2 — File is divided**

Master:

> "This file is too large to store as one piece. It will be divided into blocks."

Ví dụ:

File

&nbsp;↓

Block 1

Block 2

Block 3

---

**Scene 3 — Master assigns work**

Master:

> "DataNode 1, store Block 1."

> "DataNode 2, store Block 2."

> "DataNode 3, store Block 3."

DataNodes:

> "Received."

> "Stored."

> "Stored."

---

**Scene 4 — Failure**

Một DataNode đứng lên và nói:

> "I have failed\!"

Master:

> "I detected that DataNode 2 is unavailable."

Sau đó:

> "The missing block needs to be replicated to another DataNode."

---

**Scene 5 — Recovery**

DataNode 3:

> "I have received the replicated block."

Master:

> "The data is available again."

Cuối cùng presenter kết luận:

> **"This simulation demonstrates the master-slave architecture: the master coordinates the system, while the slave nodes perform distributed data storage and processing."**

---

# **5\. Có một điểm rất quan trọng**

Bạn **không nên gọi DataNode đơn giản là "slave" trong toàn bộ presentation**.

Trong Hadoop, terminology hiện đại thường dùng:

> **Master/Worker architecture**

thay vì nhấn mạnh "Master/Slave".

Bạn có thể nói:

> "For the purpose of this activity, we use the traditional master-slave terminology to explain the architecture."

Sau đó dùng:

**Master → NameNode**

**Workers → DataNodes**

sẽ chuyên nghiệp hơn.

&nbsp;

### **🎯 Tôi sẽ chia scope cho hai nhóm như này**

**Nhóm bạn — Hadoop Architecture**

> **"Show how the Hadoop cluster works as a whole."**

Activity:  
**Client → Master → Workers → Failure → Recovery**

Focus:  
**Interaction \+ workflow \+ distributed architecture**

**Nhóm sau — Master-Slave Architecture: NameNode & DataNode Roles**

> **"Explain what each node is responsible for."**

Activity:  
**NameNode vs DataNode**

Focus:  
**Responsibilities \+ metadata \+ data blocks \+ heartbeat \+ communication**

Như vậy hai bài **có liên quan nhưng không overlap**. Thậm chí bài nhóm bạn có thể tạo nền tảng để nhóm sau đi sâu vào NameNode/DataNode.

Nếu đây là **team project được giao sẵn slide/content cụ thể**, bạn gửi cho tôi **outline các phần mà nhóm bạn phải present** (hoặc ảnh assignment rubric). Tôi có thể chia luôn cho bạn **5 người trong team: mỗi người nói gì \+ simulation script \+ props/role \+ slide nào**, để tránh đụng nội dung với nhóm sau.

&nbsp;

&nbsp;

# Outline ttrinh

Được. Với **3 người** và activity bắt buộc là **simulation: master–slave roles**, tôi sẽ không làm bài quá rộng. Mục tiêu là đi từ **"Hadoop là gì" → "Hadoop Architecture gồm những gì" → "Master–Worker interaction" → simulation**, đồng thời **không ăn sang bài nhóm sau về NameNode & DataNode Roles**.

Tôi đề xuất bài khoảng **15–20 phút**, trong đó simulation chiếm **5–7 phút**.

# **Hadoop Architecture — Presentation Outline**

## **1\. Introduction: Why Hadoop?**

**Mục tiêu:** Cho người nghe hiểu tại sao Hadoop xuất hiện.

### **Nội dung**

* The Big Data problem  
  * Huge volume of data  
  * Data comes from many sources  
  * Traditional systems become difficult/expensive to scale  
* Basic idea:  
  Instead of processing everything on one powerful machine, Hadoop distributes data and processing across multiple machines.

### **Một slide nên có**

Traditional System

&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Huge Dataset

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌─────────────┐

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ One Server  │

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─────────────┘

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bottleneck

&nbsp;

&nbsp;

Hadoop

&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Huge Dataset

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

&nbsp;&nbsp;&nbsp;&nbsp;┌────────┬────────┬────────┐

&nbsp;&nbsp;&nbsp;&nbsp;│ Node 1 │ Node 2 │ Node 3 │

&nbsp;&nbsp;&nbsp;&nbsp;└────────┴────────┴────────┘

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Distributed

**Người 1**

---

# **2\. What is Hadoop?**

### **Nội dung**

Định nghĩa ngắn:

> **Apache Hadoop is an open-source framework designed to store and process large datasets across a distributed cluster of computers.**

Sau đó giải thích 3 keywords:

* **Distributed**  
* **Scalable**  
* **Fault-tolerant**

### **Đừng sa đà vào lịch sử Hadoop**

Chỉ cần 1 slide rất ngắn:

Google Papers

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

Hadoop

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

Distributed Big Data Processing

Nếu giáo viên yêu cầu history thì mới thêm.

**Người 1**

---

# **3\. Hadoop Architecture — Big Picture**

Đây nên là **slide quan trọng nhất của phần lý thuyết**.

Hiển thị architecture:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HADOOP CLUSTER

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌──────────────┴──────────────┐

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│                             │

&nbsp;&nbsp;&nbsp;MASTER / COORDINATION          WORKERS

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│                             │

&nbsp;&nbsp;&nbsp;┌──────────┐            ┌──────┬──────┬──────┐

&nbsp;&nbsp;&nbsp;│ NameNode │            │ DN 1 │ DN 2 │ DN 3 │

&nbsp;&nbsp;&nbsp;└──────────┘            └──────┴──────┴──────┘

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;┌──────────┐

&nbsp;&nbsp;&nbsp;│  YARN    │

&nbsp;&nbsp;&nbsp;│ Resource │

&nbsp;&nbsp;&nbsp;│ Manager  │

&nbsp;&nbsp;&nbsp;└──────────┘

Nhưng ở đây **chỉ giới thiệu**, chưa giải thích chi tiết từng role.

Ví dụ:

> "At a high level, Hadoop consists of a master side that coordinates the cluster and worker nodes that store and process data."

Điều này giúp bạn **không overlap với nhóm sau**.

**Người 2**

---

# **4\. Core Components of Hadoop**

Ở đây giới thiệu 4 thành phần chính:

| Component | High-level function |
| ----- | ----- |
| **HDFS** | Distributed storage |
| **YARN** | Resource management |
| **MapReduce** | Distributed processing |
| **Hadoop Common** | Shared libraries & utilities |

### **Visual**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HADOOP

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────┼───────────┐

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓           ↓           ↓

&nbsp;&nbsp;&nbsp;HDFS        YARN      MapReduce

&nbsp;Storage     Resources   Processing

### **Quan trọng**

Bạn **không cần dạy sâu NameNode/DataNode ở đây**.

Chỉ nói:

> "HDFS manages distributed storage through NameNodes and DataNodes."

Sau đó move on.

Vì nhóm sau sẽ đi sâu vào chính phần này.

**Người 2**

---

# **5\. How Does Hadoop Architecture Work?**

Đây là phần tôi muốn nhóm bạn tập trung nhất.

Thay vì học thuộc component, hãy cho người nghe thấy **workflow**.

## **Scenario: Upload and process a large dataset**

Ví dụ:

> A company has a 1 TB customer dataset and wants to process it.

### **Step 1 — Client submits data**

Client

&nbsp;&nbsp;&nbsp;↓

Hadoop Cluster

### **Step 2 — Data is distributed**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dataset

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────┼───────┐

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓       ↓       ↓

&nbsp;&nbsp;&nbsp;Node 1  Node 2  Node 3

### **Step 3 — Resources are allocated**

YARN manages available resources.

### **Step 4 — Processing happens in parallel**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dataset

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

&nbsp;┌────────┼────────┐

&nbsp;↓        ↓        ↓

Task 1   Task 2   Task 3

&nbsp;↓        ↓        ↓

&nbsp;└────────┼────────┘

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Result

### **Step 5 — Failure handling**

Nếu một worker chết:

Node 1 ✓

Node 2 ✗

Node 3 ✓

&nbsp;

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

&nbsp;

Hadoop detects failure

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

Task/Data can be recovered

**Người 2 hoặc Người 3**

---

# **6\. Master–Worker / Master–Slave Architecture**

Đây là phần **transition vào activity**.

Bạn cần giải thích concept trước khi simulation.

### **Master**

Master có nhiệm vụ **coordinate/manage**:

* Manage metadata/resources  
* Coordinate workers  
* Assign tasks  
* Monitor cluster

### **Workers**

Workers:

* Store data  
* Execute tasks  
* Report status

Nhưng lưu ý:

> **Không cần đi sâu vào "NameNode does X, DataNode does Y".**

Chỉ cần:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MASTER

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Coordinate"

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌────────┼────────┐

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓        ↓        ↓

&nbsp;&nbsp;&nbsp;&nbsp;WORKER   WORKER   WORKER

&nbsp;&nbsp;&nbsp;&nbsp;"Work"   "Work"   "Work"

Sau đó:

> "Now, instead of just explaining this architecture, we will simulate how it works."

**Người 3**

---

# **7\. 🎭 Main Activity — Master–Worker Simulation**

Đây là phần quan trọng nhất của assignment.

Tôi đề xuất **3 người \= 3 roles**:

### **Person 1 — Client \+ Narrator**

### **Person 2 — Master**

### **Person 3 — Worker nodes**

Người 3 có thể cầm 3 cards:

┌─────────┐

│ Worker 1│

└─────────┘

&nbsp;

┌─────────┐

│ Worker 2│

└─────────┘

&nbsp;

┌─────────┐

│ Worker 3│

└─────────┘

Không nhất thiết phải có 5 người.

---

## **Simulation scenario**

### **Scene 1 — Client submits a job**

**Client:**

> "I have a large dataset. I want Hadoop to process it."

**Master:**

> "I will coordinate this job and distribute the work among the workers."

---

### **Scene 2 — Master distributes work**

Master:

> "Worker 1, process Part 1."

> "Worker 2, process Part 2."

> "Worker 3, process Part 3."

Workers:

> "Received."

---

### **Scene 3 — Parallel processing**

Ba workers cùng diễn:

> Worker 1: "Processing Part 1."

> Worker 2: "Processing Part 2."

> Worker 3: "Processing Part 3."

Narrator:

> "Instead of processing the entire dataset on one machine, Hadoop processes different parts in parallel."

**Đây là điểm bạn muốn khán giả nhớ.**

---

### **Scene 4 — Worker failure**

Worker 2:

> "My node has failed\!"

Master:

> "Worker 2 is unavailable. I need to handle the failed task."

Worker 1 hoặc 3:

> "I can process the failed task."

Master:

> "Task reassigned."

---

### **Scene 5 — Result**

Workers:

> "Task completed."

Master:

> "All tasks are completed. The final result is ready."

Narrator:

> "This demonstrates the key idea of Hadoop's architecture: centralized coordination with distributed storage and processing."

---

# **8\. What Does the Simulation Demonstrate?**

Sau simulation **đừng kết thúc ngay**.

Có một slide debrief:

### **Our simulation demonstrates:**

**1\. Distributed processing**

> Work is divided among multiple machines.

**2\. Parallelism**

> Multiple workers process tasks simultaneously.

**3\. Centralized coordination**

> The master coordinates the workers.

**4\. Fault tolerance**

> The system can handle worker failure.

**5\. Scalability**

> More workers can be added to handle larger workloads.

Slide này giúp activity không bị biến thành "đóng kịch cho vui", mà chứng minh được kiến thức.

**Người 3**

---

# **9\. Advantages & Limitations**

Chỉ cần **1 slide**.

### **Advantages**

* Scalable  
* Cost-effective  
* Fault tolerant  
* Suitable for large datasets  
* Distributed processing

### **Limitations**

* Complex to manage  
* Not ideal for real-time processing  
* High latency for small workloads  
* Requires cluster infrastructure

---

# **10\. Conclusion**

3 key takeaways:

> **1\. Hadoop distributes data and computation across multiple machines.**

> **2\. The master coordinates the cluster while workers perform tasks.**

> **3\. This architecture enables scalability, parallel processing and fault tolerance.**

Sau đó:

> **"Thank you. Any questions?"**

---

# **Phân chia 3 người**

Tôi sẽ chia như này để workload khá cân bằng:

| Person | Sections | Focus |
| ----- | ----- | ----- |
| **Person 1** | 1 → 2 | Why Hadoop \+ What is Hadoop |
| **Person 2** | 3 → 5 | Architecture \+ Components \+ Workflow |
| **Person 3** | 6 → 10 | Master–Worker \+ Simulation \+ Debrief \+ Conclusion |

Nhưng **simulation cả 3 người cùng tham gia**.

---

# **Toàn bộ flow của presentation**

Bạn có thể copy trực tiếp flow này vào group chat:

1\. Why Hadoop?

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

2\. What is Hadoop?

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

3\. Hadoop Architecture – Big Picture

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

4\. Core Components

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

5\. How Hadoop Works – Workflow

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

6\. Master–Worker Architecture

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

7\. 🎭 Master–Worker Simulation

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

8\. Simulation Debrief

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

9\. Advantages & Limitations

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓

10\. Conclusion

### **Và điểm mấu chốt để tránh trùng nhóm sau:**

**Nhóm bạn \= Architecture \+ Interaction \+ Simulation**

> **"How do the components work together?"**

**Nhóm sau \= NameNode/DataNode Roles**

> **"What exactly does each node do?"**

Đừng biến phần 4–6 của nhóm bạn thành một bài chi tiết về **NameNode, DataNode, heartbeat, metadata, block replication...**. Nếu làm vậy thì gần như chắc chắn sẽ đụng bài nhóm sau.

**Một điều nữa:** tôi sẽ **không dùng MongoDB cho simulation**. Nếu assignment là Hadoop Architecture, hãy mô phỏng **Hadoop cluster trực tiếp**. MongoDB có thể nhắc ở phần *comparison/real-world analogy* nếu cần, nhưng không nên là core example.

Hoàn thiện bài thuyết trình Hadoop

* Soạn kịch bản simulation 5 phút  
* Viết script 3 người theo từng slide

&nbsp;