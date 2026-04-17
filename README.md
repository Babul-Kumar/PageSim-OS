# 🚀 Efficient Page Replacement Algorithm Simulator

An interactive, production-ready web application to **visualize and compare page replacement algorithms** used in Operating Systems.

🔗 **Live Demo:** https://page-sim-os-ovjs.vercel.app/

---

## 📌 Overview

This simulator helps users understand how memory management works by visually demonstrating how different page replacement algorithms behave step-by-step.

It supports:

* **FIFO (First In First Out)**
* **LRU (Least Recently Used)**
* **Optimal (Theoretical Best)**

---

## ✨ Features

### 🎯 Simulation

* Real-time memory frame visualization
* Step-by-step execution mode
* Auto-play with speed control
* Page hit / fault highlighting
* Evicted page tracking

### 📊 Analytics

* Page Fault count
* Page Hit count
* Hit Ratio calculation
* Dynamic stats update per step

### 📈 Comparison Mode

* Compare FIFO vs LRU vs Optimal
* Interactive bar chart (Chart.js)
* Best algorithm insight detection

### 🎨 UI/UX

* Fully responsive (mobile + desktop)
* Smooth animations and transitions
* Dark mode UI
* Scrollable grid & tables (no layout breaking)

---

## 🧠 Algorithms Explained

| Algorithm   | Strategy                                      |
| ----------- | --------------------------------------------- |
| **FIFO**    | Replaces the oldest loaded page               |
| **LRU**     | Replaces the least recently used page         |
| **Optimal** | Replaces the page used farthest in the future |

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite, JavaScript)
* **Styling:** Tailwind CSS
* **Charts:** Chart.js (`react-chartjs-2`)
* **Deployment:** Vercel

---

## 📂 Project Structure

```text
src/
  algorithms/
    fifo.js
    lru.js
    optimal.js

  components/
    ComparisonChart.jsx
    Controls.jsx
    InputForm.jsx
    MemoryGrid.jsx
    StatsPanel.jsx
    StepTable.jsx
    PageReel.jsx

  pages/
    Simulator.jsx

  utils/
    helpers.js

  App.jsx
  index.css
  main.jsx
```

---

## ⚙️ Setup Instructions

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run development server

```bash
npm run dev
```

### 3️⃣ Open in browser

```
http://localhost:5173
```

---

## 🏗️ Build & Preview

### Build production version

```bash
npm run build
```

### Preview build

```bash
npm run preview
```

---

## 🧪 How to Use

1. Enter **number of frames**
2. Enter **page reference string**
   Example:

   ```
   7, 0, 1, 2, 0, 3, 0, 4
   ```
3. Select algorithm:

   * FIFO
   * LRU
   * Optimal
4. Click:

   * ▶ **Run Simulation**
   * ⏭ **Step-by-Step**
   * 🔄 **Reset**

---

## 📊 Output Sections

* 🧩 Memory Frame Grid
* 📋 Step-by-step Table
* 📈 Statistics Panel
* 📊 Comparison Chart

---

## 💡 Key Highlights

* Handles large inputs efficiently (optimized rendering)
* Prevents UI overflow using scroll-based layout system
* Uses memoization (`useMemo`, `memo`) for performance
* Clean separation of concerns:

  * Algorithms → Logic
  * Components → UI
  * Simulator → State management

---

## 🚀 Future Improvements

* Export simulation results (CSV / PDF)
* Add more algorithms (Clock, LFU)
* Keyboard controls for navigation
* Save & load test cases

---

## 👨‍💻 Author

**Babul Kumar**

---

## 📄 License

This project is licensed under the MIT License.
