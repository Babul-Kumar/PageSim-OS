import { motion } from "framer-motion";

export default function SimulationTable({
  result,
  visibleSteps,
  showAll,
  variants,
  highlightStep = 0,
}) {
  const rows = showAll ? result.steps : result.steps.slice(0, visibleSteps);
  const snapshot = rows.length > 0 ? rows[rows.length - 1] : null;

  return (
    <motion.article
      className="table-card"
      variants={variants}
      initial="hidden"
      animate="visible"
      layout
    >
      <h3>{result.label} Timeline</h3>
      {snapshot && (
        <div className="frame-strip" aria-label={`${result.label} memory frame snapshot`}>
          {snapshot.frames.map((frame, index) => (
            <div
              key={`${result.algorithm}-snapshot-${index + 1}`}
              className={`frame-pill ${frame === null ? "frame-empty" : ""}`}
            >
              <span>Frame {index + 1}</span>
              <strong>{frame === null ? "-" : frame}</strong>
            </div>
          ))}
        </div>
      )}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>Page</th>
              {Array.from({ length: result.frameCount }, (_, index) => (
                <th key={`header-${index + 1}`}>Frame {index + 1}</th>
              ))}
              <th>Status</th>
              <th>Replaced</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length && !showAll && (
              <tr className="timeline-empty-row">
                <td colSpan={result.frameCount + 4}>
                  Use Next or Auto Play to begin stepping through the timeline.
                </td>
              </tr>
            )}
            {rows.map((step, index) => {
              const isActive = !showAll && step.step === highlightStep;
              return (
                <tr
                  key={`${result.algorithm}-${step.step}`}
                  className={`${step.hit ? "hit-row" : "fault-row"} table-row-enter ${isActive ? "active-step-row current-step" : ""}`}
                  style={{ animationDelay: `${index * 36}ms` }}
                >
                  <td>{step.step}</td>
                  <td>{step.page}</td>
                  {step.frames.map((frame, frameIndex) => (
                    <td key={`${result.algorithm}-${step.step}-frame-${frameIndex}`}>
                      {frame === null ? "-" : frame}
                    </td>
                  ))}
                  <td>{step.hit ? "Hit" : "Fault"}</td>
                  <td>{step.replaced === null ? "-" : step.replaced}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.article>
  );
}
