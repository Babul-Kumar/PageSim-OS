# Efficient Page Replacement Algorithm Simulator

Interactive simulator for understanding and comparing page replacement algorithms:

- FIFO (First In First Out)
- LRU (Least Recently Used)
- Optimal

Built with:

- React (Vite, JavaScript)
- Tailwind CSS
- Chart.js (`react-chartjs-2`)

## Features

- Real-time memory frame simulation
- Step-by-step execution mode
- Hit/Fault highlighting
- Evicted page tracking
- Stats panel (faults, hits, hit ratio)
- Comparison chart for FIFO vs LRU vs Optimal
- Dark mode toggle
- Best algorithm insight

## Project Structure

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
  pages/
    Simulator.jsx
  utils/
    helpers.js
  App.jsx
  index.css
  main.jsx
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open the local URL shown in terminal (usually `http://localhost:5173`).

## Build and Preview

1. Build production files:

```bash
npm run build
```

2. Preview production build:

```bash
npm run preview
```

## How to Use

1. Enter number of frames.
2. Enter reference string (comma-separated), for example: `7, 0, 1, 2, 0, 3, 0, 4`.
3. Select algorithm (`FIFO`, `LRU`, or `Optimal`).
4. Click:
   - `Start Simulation` to run full simulation immediately.
   - `Step-by-Step Execution` to advance one step at a time.
   - `Reset` to restore defaults.
5. Check:
   - Memory Frame Visualization Grid
   - Step-by-step execution table
   - Stats Panel
   - Comparison Chart
