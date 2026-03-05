import { motion } from "framer-motion";
import { ALGORITHM_DESCRIPTIONS, ALGORITHM_LABELS } from "../algorithms";

const DISPLAY_KEYS = ["fifo", "lru", "optimal"];

export default function AlgorithmExplanationPanel({ mode, variants }) {
  const keys = mode === "compare" ? DISPLAY_KEYS : [mode];

  return (
    <motion.section className="panel" custom={1} variants={variants}>
      <h2>Algorithm Explanation</h2>
      <div className="explanation-grid">
        {keys.map((key) => (
          <article key={key} className="explanation-card">
            <h3>{ALGORITHM_LABELS[key]}</h3>
            <p>{ALGORITHM_DESCRIPTIONS[key]}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
