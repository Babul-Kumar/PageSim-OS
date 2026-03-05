import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { ALGORITHM_LABELS, parseReferenceString, runSimulations, generateBeladySeries } from "./algorithms";
import { AlgorithmExplanationPanel, MetricCard, SimulationTable } from "./components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const entryVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.99 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: index * 0.06, duration: 0.42, ease: "easeOut" },
  }),
};

const DISPLAY_KEYS = ["fifo", "lru", "optimal"];

function percent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function speedLabel(ms) {
  if (ms <= 420) {
    return "Fast";
  }
  if (ms <= 820) {
    return "Balanced";
  }
  return "Slow";
}

async function captureSection(node, theme, html2canvasFn) {
  if (!node) {
    return null;
  }

  return html2canvasFn(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: theme === "light" ? "#f7fafc" : "#04101a",
  });
}

function addCanvasPage(pdf, canvas, title) {
  if (!canvas) {
    return;
  }

  pdf.addPage("a4", "portrait");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const titleY = 12;
  const imageTop = 20;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - imageTop - margin;
  const scale = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
  const imageWidth = canvas.width * scale;
  const imageHeight = canvas.height * scale;
  const imageX = (pageWidth - imageWidth) / 2;
  const imageY = imageTop;

  pdf.setFontSize(13);
  pdf.text(title, margin, titleY);
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", imageX, imageY, imageWidth, imageHeight, undefined, "FAST");
}

export default function App() {
  const [referenceInput, setReferenceInput] = useState("7 0 1 2 0 3 0 4");
  const [frameInput, setFrameInput] = useState("3");
  const [mode, setMode] = useState("fifo");
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(680);
  const [isExporting, setIsExporting] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    return window.localStorage.getItem("sim-theme") || "dark";
  });

  const chartPanelRef = useRef(null);
  const beladyPanelRef = useRef(null);
  const timelineRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const activeAlgorithm = mode === "compare" ? null : mode;
  const activeResult = useMemo(() => {
    if (!results || !activeAlgorithm) {
      return null;
    }
    return results[activeAlgorithm] || null;
  }, [results, activeAlgorithm]);

  const totalSteps = activeResult ? activeResult.steps.length : 0;
  const hasResults = results && Object.keys(results).length > 0;
  const currentStepData = useMemo(() => {
    if (!activeResult || currentStep <= 0) {
      return null;
    }
    return activeResult.steps[currentStep - 1] || null;
  }, [activeResult, currentStep]);

  const chartPalette = useMemo(
    () =>
      theme === "light"
        ? {
            tick: "#1f3442",
            grid: "rgba(39, 67, 84, 0.18)",
            legend: "#1d2f3d",
            faults: "rgba(210, 92, 58, 0.8)",
            hits: "rgba(42, 170, 117, 0.8)",
            ratioLine: "rgba(54, 95, 213, 0.92)",
            ratioFill: "rgba(54, 95, 213, 0.2)",
          }
        : {
            tick: "#ddeaf2",
            grid: "rgba(165, 198, 217, 0.18)",
            legend: "#f3f8fb",
            faults: "rgba(255, 130, 91, 0.84)",
            hits: "rgba(89, 220, 158, 0.84)",
            ratioLine: "rgba(101, 188, 255, 0.95)",
            ratioFill: "rgba(101, 188, 255, 0.26)",
          },
    [theme],
  );

  const primaryResult = useMemo(() => {
    if (!hasResults) {
      return null;
    }
    return Object.values(results)[0] || null;
  }, [hasResults, results]);

  const beladySeries = useMemo(() => {
    if (!primaryResult) {
      return null;
    }
    const frameCount = Number(frameInput);
    const center = Number.isInteger(frameCount) ? frameCount : primaryResult.frameCount;
    const minFrames = Math.max(1, center - 2);
    const maxFrames = Math.min(10, Math.max(center + 2, minFrames + 3));
    return generateBeladySeries(primaryResult.reference, minFrames, maxFrames);
  }, [frameInput, primaryResult]);

  const bestAlgorithm = useMemo(() => {
    if (!hasResults || mode !== "compare") {
      return null;
    }
    const entries = Object.values(results);
    if (!entries.length) {
      return null;
    }
    return entries.reduce((best, current) =>
      current.faults < best.faults ? current : best
    ).algorithm;
  }, [hasResults, mode, results]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("sim-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!isPlaying || mode === "compare" || !activeResult) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentStep((previous) => {
        if (previous >= totalSteps) {
          setIsPlaying(false);
          return previous;
        }
        const next = previous + 1;
        if (next >= totalSteps) {
          setIsPlaying(false);
        }
        return next;
      });
    }, playSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, mode, activeResult, totalSteps, playSpeed]);

  useEffect(() => {
    if (mode === "compare") {
      setIsPlaying(false);
    }
  }, [mode]);

  useEffect(
    () => () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isPlaying || !timelineRef.current) {
      return;
    }

    timelineRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentStep, isPlaying]);

  const comparisonData = useMemo(() => {
    if (!hasResults) {
      return null;
    }

    const keys = mode === "compare" ? DISPLAY_KEYS : [mode];
    const entries = keys.map((key) => results[key]).filter(Boolean);
    if (!entries.length) {
      return null;
    }

    return {
      labels: entries.map((entry) => entry.label),
      datasets: [
        {
          label: "Page Faults",
          data: entries.map((entry) => entry.faults),
          backgroundColor: chartPalette.faults,
          borderRadius: 10,
          borderSkipped: false,
          yAxisID: "y",
        },
        {
          label: "Page Hits",
          data: entries.map((entry) => entry.hits),
          backgroundColor: chartPalette.hits,
          borderRadius: 10,
          borderSkipped: false,
          yAxisID: "y",
        },
        {
          type: "line",
          label: "Hit Ratio (%)",
          data: entries.map((entry) => Number((entry.hitRatio * 100).toFixed(2))),
          borderColor: chartPalette.ratioLine,
          backgroundColor: chartPalette.ratioFill,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 5,
          tension: 0.25,
          yAxisID: "yRatio",
        },
      ],
    };
  }, [chartPalette, hasResults, mode, results]);

  const comparisonOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      scales: {
        x: {
          ticks: { color: chartPalette.tick, font: { family: "IBM Plex Mono" } },
          grid: { display: false },
        },
        y: {
          ticks: { color: chartPalette.tick, precision: 0, font: { family: "IBM Plex Mono" } },
          grid: { color: chartPalette.grid },
          beginAtZero: true,
          title: {
            display: true,
            text: "Requests",
            color: chartPalette.tick,
            font: { family: "IBM Plex Mono", size: 11 },
          },
        },
        yRatio: {
          position: "right",
          beginAtZero: true,
          max: 100,
          grid: { display: false },
          ticks: { color: chartPalette.tick, callback: (value) => `${value}%` },
          title: {
            display: true,
            text: "Hit Ratio",
            color: chartPalette.tick,
            font: { family: "IBM Plex Mono", size: 11 },
          },
        },
      },
      plugins: {
        legend: {
          labels: { color: chartPalette.legend, font: { family: "Space Grotesk", weight: "600" } },
        },
      },
    }),
    [chartPalette],
  );

  function toggleTheme() {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  }

  function generateRandomInput() {
    const sample = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10));
    setReferenceInput(sample.join(" "));
    if (!frameInput || Number(frameInput) < 1) {
      setFrameInput("3");
    }
    setError("");
  }

  function resetAll() {
    setReferenceInput("");
    setFrameInput("3");
    setMode("fifo");
    setError("");
    setResults(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setPlaySpeed(680);
  }

  function runSimulation(event) {
    event.preventDefault();
    setError("");
    setIsPlaying(false);

    const parsedReference = parseReferenceString(referenceInput);
    const frameCount = Number(frameInput);

    if (!parsedReference) {
      setError("Use only non-negative integers separated by spaces or commas.");
      return;
    }

    if (!Number.isInteger(frameCount) || frameCount < 1 || frameCount > 20) {
      setError("Frames must be an integer from 1 to 20.");
      return;
    }

    const simulation = runSimulations(parsedReference, frameCount, mode);
    setResults(simulation);
    setCurrentStep(0);
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }

  async function exportReportAsPdf() {
    if (!hasResults || isExporting) {
      return;
    }

    setIsExporting(true);
    setError("");

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 12;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const lineWidth = pageWidth - margin * 2;
      let cursorY = 14;

      const metricLines = Object.values(results).map(
        (result) =>
          `${result.label}: faults=${result.faults}, hits=${result.hits}, hitRatio=${percent(result.hitRatio)}`,
      );

      const beladyLines = beladySeries
        ? beladySeries.points.map((point) => `Frames ${point.frames}: FIFO faults ${point.faults}`)
        : ["No Belady analysis generated."];

      const anomalyLines =
        beladySeries && beladySeries.hasAnomaly
          ? beladySeries.anomalies.map(
              (item) =>
                `Anomaly: ${item.fromFrames}->${item.toFrames} frames (${item.fromFaults}->${item.toFaults} faults)`,
            )
          : ["No Belady anomaly detected in selected range."];

      const reportBody = [
        `Generated: ${new Date().toLocaleString()}`,
        `Reference String: ${referenceInput.trim()}`,
        `Frames: ${frameInput}`,
        `Mode: ${mode === "compare" ? "Compare All" : ALGORITHM_LABELS[mode]}`,
        "",
        "Performance Summary:",
        ...metricLines,
        "",
        "Belady Analysis (FIFO):",
        ...beladyLines,
        ...anomalyLines,
      ];

      pdf.setFontSize(16);
      pdf.text("Page Replacement Simulation Report", margin, cursorY);
      cursorY += 8;
      pdf.setFontSize(10);

      const wrappedBody = pdf.splitTextToSize(reportBody.join("\n"), lineWidth);
      pdf.text(wrappedBody, margin, cursorY);

      const chartCanvas = await captureSection(chartPanelRef.current, theme, html2canvas);
      const beladyCanvas = await captureSection(beladyPanelRef.current, theme, html2canvas);

      addCanvasPage(pdf, chartCanvas, "Algorithm Efficiency Snapshot");
      addCanvasPage(pdf, beladyCanvas, "Belady Analysis Snapshot");

      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      pdf.save(`simulation-report-${stamp}.pdf`);
    } catch (exportError) {
      setError(`PDF export failed: ${exportError.message}`);
    } finally {
      setIsExporting(false);
    }
  }

  function nextStep() {
    if (!activeResult) {
      return;
    }
    setIsPlaying(false);
    setCurrentStep((step) => Math.min(step + 1, activeResult.steps.length));
  }

  function previousStep() {
    setIsPlaying(false);
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function showAllSteps() {
    if (!activeResult) {
      return;
    }
    setCurrentStep(activeResult.steps.length);
    setIsPlaying(false);
  }

  function togglePlay() {
    if (!activeResult) {
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (currentStep >= activeResult.steps.length) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }

  return (
    <div className="page">
      <div className="bg-shape bg-a" />
      <div className="bg-shape bg-b" />

      <motion.main
        className="app-shell"
        initial="hidden"
        animate="visible"
        variants={entryVariants}
      >
        <motion.section className="hero panel" custom={0} variants={panelVariants}>
          <p className="hero-kicker">Operating Systems Interactive Lab</p>
          <h1>Page Replacement Algorithm Simulator</h1>
          <p>
            React-powered simulation for FIFO, LRU, and Optimal replacement with animated
            visualization, step playback, Belady anomaly detection, and performance comparison.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-subtle" onClick={toggleTheme}>
              {theme === "dark" ? "\u2600 Light Mode" : "\uD83C\uDF19 Dark Mode"}
            </button>
            {hasResults && (
              <button
                type="button"
                className="btn"
                onClick={exportReportAsPdf}
                disabled={isExporting}
              >
                {isExporting ? "Generating PDF..." : "\uD83D\uDCC4 Export PDF Report"}
              </button>
            )}
          </div>
        </motion.section>

        <AlgorithmExplanationPanel mode={mode} variants={panelVariants} />

        <motion.section className="panel" custom={2} variants={panelVariants}>
          <h2>Simulation Input</h2>
          <form onSubmit={runSimulation} noValidate>
            <div className="input-grid">
              <label className="field">
                <span>Reference String</span>
                <input
                  type="text"
                  value={referenceInput}
                  onChange={(event) => setReferenceInput(event.target.value)}
                  placeholder="Example: 7 0 1 2 0 3 0 4"
                />
                <small>Use spaces or commas between page numbers.</small>
              </label>

              <label className="field">
                <span>Frames</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={frameInput}
                  onChange={(event) => setFrameInput(event.target.value)}
                />
                <small>Allowed range: 1 to 20.</small>
              </label>

              <label className="field">
                <span>Mode</span>
                <select value={mode} onChange={(event) => setMode(event.target.value)}>
                  {Object.entries(ALGORITHM_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                  <option value="compare">Compare All</option>
                </select>
                <small>Compare All runs FIFO, LRU, and Optimal together.</small>
              </label>
            </div>

            <div className="button-row">
              <button className="btn btn-primary" type="submit">
                Run Simulation
              </button>
              <button className="btn" type="button" onClick={generateRandomInput}>
                Random Input
              </button>
              <button className="btn btn-subtle" type="button" onClick={resetAll}>
                Reset
              </button>
            </div>
            <p className="error-text">{error}</p>
          </form>
        </motion.section>

        <AnimatePresence mode="wait">
          {hasResults && mode !== "compare" && (
            <motion.section
              className="panel"
              custom={3}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -8 }}
            >
              <h2>Step Controls</h2>
              <div className="button-row">
                <button
                  type="button"
                  className="btn btn-subtle"
                  onClick={previousStep}
                  disabled={currentStep <= 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={!activeResult || currentStep >= activeResult.steps.length}
                >
                  Next
                </button>
                <button type="button" className="btn" onClick={togglePlay} disabled={!activeResult}>
                  {isPlaying ? "Pause" : "Auto Play"}
                </button>
                <button
                  type="button"
                  className="btn btn-subtle"
                  onClick={showAllSteps}
                  disabled={!activeResult || currentStep >= activeResult.steps.length}
                >
                  Show All
                </button>
              </div>
              <label className="speed-control">
                <span>
                  Animation Speed: {playSpeed} ms ({speedLabel(playSpeed)})
                </span>
                <input
                  type="range"
                  min="220"
                  max="1400"
                  step="40"
                  value={playSpeed}
                  onChange={(event) => setPlaySpeed(Number(event.target.value))}
                />
              </label>
              <p className="step-counter">
                Step {currentStep} of {totalSteps}
              </p>
              {currentStepData ? (
                <div className="step-inspector" role="status" aria-live="polite">
                  <span>
                    <strong>Page:</strong> {currentStepData.page}
                  </span>
                  <span>
                    <strong>Status:</strong> {currentStepData.hit ? "Hit" : "Fault"}
                  </span>
                  <span>
                    <strong>Replaced:</strong> {currentStepData.replaced ?? "-"}
                  </span>
                </div>
              ) : (
                <p className="step-hint">Press Next or Auto Play to start step visualization.</p>
              )}
              <div className="progress-track" role="presentation" aria-hidden="true">
                <motion.div
                  className="progress-fill"
                  animate={{ width: totalSteps > 0 ? `${(currentStep / totalSteps) * 100}%` : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasResults && (
            <motion.section
              ref={timelineRef}
              className="panel"
              custom={4}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
            >
              <h2>Frame Allocation Timeline</h2>
              <div className="tables-grid">
                {mode === "compare" &&
                  Object.values(results).map((result) => (
                    <SimulationTable
                      key={result.algorithm}
                      result={result}
                      visibleSteps={result.steps.length}
                      showAll
                      variants={entryVariants}
                    />
                  ))}

                {mode !== "compare" && activeResult && (
                  <SimulationTable
                    result={activeResult}
                    visibleSteps={currentStep}
                    showAll={false}
                    highlightStep={currentStep}
                    variants={entryVariants}
                  />
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasResults && (
            <motion.section
              className="panel"
              custom={5}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
            >
              <h2>Performance Metrics</h2>
              <div className="metrics-grid">
                {Object.values(results).map((result) => (
                  <MetricCard
                    key={result.algorithm}
                    result={result}
                    variants={entryVariants}
                    isBest={mode === "compare" && result.algorithm === bestAlgorithm}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasResults && comparisonData && (
            <motion.section
              ref={chartPanelRef}
              className="panel chart-panel"
              custom={6}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
            >
              <h2>Algorithm Efficiency Graph</h2>
              <div className="chart-wrap">
                <Bar data={comparisonData} options={comparisonOptions} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasResults && beladySeries && (
            <motion.section
              ref={beladyPanelRef}
              className="panel"
              custom={7}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
            >
              <h2>Belady&apos;s Anomaly Demo (FIFO)</h2>
              <p>
                Increasing frame count can occasionally increase faults in FIFO. This table checks that
                behavior around your selected frame count.
              </p>
              <div className="belady-scroll">
                <table className="belady-table">
                  <thead>
                    <tr>
                      <th>Frames</th>
                      <th>FIFO Faults</th>
                      <th>Change vs Prev</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beladySeries.points.map((point, index) => {
                      const previous = index > 0 ? beladySeries.points[index - 1] : null;
                      const delta = previous ? point.faults - previous.faults : 0;
                      const anomaly = delta > 0;

                      return (
                        <tr key={`belady-${point.frames}`} className={anomaly ? "anomaly-row" : ""}>
                          <td>{point.frames}</td>
                          <td>{point.faults}</td>
                          <td>{previous ? `${delta > 0 ? "+" : ""}${delta}` : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className={beladySeries.hasAnomaly ? "belady-alert" : "belady-ok"}>
                {beladySeries.hasAnomaly
                  ? "Belady anomaly detected in this frame range."
                  : "No Belady anomaly detected in this frame range."}
              </p>
            </motion.section>
          )}
        </AnimatePresence>

      </motion.main>
    </div>
  );
}

