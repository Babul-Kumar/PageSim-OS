import { motion } from "framer-motion";

function percent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

export default function MetricCard({ result, variants, isBest }) {
  return (
    <motion.article
      className={`metric-card ${isBest ? "best-algo" : ""}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      layout
    >
      <h3>{result.label}</h3>
      <p className="metric-chip">Frames: {result.frameCount}</p>
      <ul>
        <li>Total Requests: {result.total}</li>
        <li>Page Faults: {result.faults}</li>
        <li>Page Hits: {result.hits}</li>
        <li>Hit Ratio: {percent(result.hitRatio)}</li>
        <li>Fault Ratio: {percent(result.faultRatio)}</li>
      </ul>
    </motion.article>
  );
}
