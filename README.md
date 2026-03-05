**🧠 PageSim-OS**
**Interactive Page Replacement Algorithm Simulator**

An interactive web-based simulator that visualizes and compares page replacement algorithms used in Operating Systems.

This tool demonstrates how FIFO, LRU, and Optimal algorithms manage memory frames using step-by-step visualization, performance metrics, and algorithm comparison graphs.

It is designed as an educational platform for students learning virtual memory and paging concepts.

🚀 Features
📊 Algorithm Simulation

Supports major page replacement algorithms:

🔹 FIFO (First In First Out)

🔹 LRU (Least Recently Used)

🔹 Optimal Page Replacement

🔍 Step-by-Step Visualization

Visual representation of how pages move through memory.

Frame allocation timeline

Page hit & page fault highlighting

Memory frame tracking

📈 Performance Metrics

The simulator automatically calculates:

Total requests

Page faults

Page hits

Hit ratio

Fault ratio

📉 Algorithm Comparison Graph

Compare algorithms visually using charts:

Page faults

Page hits

Hit ratio

Graphs help students understand algorithm efficiency clearly.

⚠️ Belady’s Anomaly Detection

Demonstrates cases where:

Increasing the number of memory frames increases page faults in FIFO.

This concept is important in Operating System memory management theory.

🎮 Interactive Controls

▶️ Step-by-step simulation

⏩ Auto-play mode

⚡ Adjustable animation speed

📄 Export Report

Generate PDF reports containing:

Simulation metrics

Graph snapshots

Algorithm results

🎨 Modern UI

🌙 Dark / Light mode

📱 Responsive design

✨ Smooth animations

🎯 Clean visualization layout

🧑‍💻 Operating System Concepts Demonstrated

This project demonstrates key Operating System memory management concepts:

Virtual Memory

Paging

Page Fault Handling

Memory Frame Allocation

Page Replacement Algorithms

Belady’s Anomaly

Algorithm Performance Analysis

🛠️ Tech Stack
Frontend

React.js

JavaScript (ES6)

HTML5

CSS3

Visualization

Chart.js

react-chartjs-2

Animation

Framer Motion

Export Tools

html2canvas

jsPDF

Build Tool

Vite

📁 Project Structure
src
│
├── algorithms
│   ├── constants.js
│   ├── fifo.js
│   ├── lru.js
│   ├── optimal.js
│   ├── parseReferenceString.js
│   └── shared.js
│
├── components
│   ├── AlgorithmExplanationPanel.jsx
│   ├── MetricCard.jsx
│   ├── SimulationTable.jsx
│   └── index.js
│
├── utils
│   └── belady.js
│
├── algorithms.js
├── App.jsx
├── App.css
└── main.jsx
⚙️ Installation
1️⃣ Clone the repository
git clone https://github.com/Babul-Kumar/PageSim-OS.git
2️⃣ Navigate to the project folder
cd PageSim-OS
3️⃣ Install dependencies
npm install
▶️ Run the Project

Start the development server:

npm run dev

The project will run at:

http://localhost:5173
🏗️ Build for Production
npm run build

Preview production build:

npm run preview
🧪 Example Simulation
Reference String
7 0 1 2 0 3 0 4
Frames
3
Algorithm
FIFO
Output

Page Faults: 7

Page Hits: 1

Hit Ratio: 12.5%

The simulator also displays the complete frame allocation timeline.

🎓 Use Cases

This simulator can be used by:

🎓 Computer Science students

🧑‍🏫 Operating System instructors

🧪 Algorithm visualization labs

📚 Educational demonstrations

💻 Self-learning OS concepts

🚀 Future Improvements

Planned features:

Clock Page Replacement Algorithm

Second Chance Algorithm

Interactive memory diagrams

Save simulations in browser storage

Performance benchmarking tools

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Babul Kumar
B.Tech Computer Science Engineering
2nd Year Student
