import { ALGORITHMS } from '../utils/helpers'

function InputForm({
  frameCount,
  referenceString,
  selectedAlgorithm,
  onFrameCountChange,
  onReferenceStringChange,
  onAlgorithmChange,
  isDarkMode,
  onToggleDarkMode,
  errorMessage,
}) {
  return (
    <section className="surface-card">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-teal-950 dark:text-teal-50">
            Simulation Input
          </h2>
          <p className="text-sm text-teal-700 dark:text-teal-300">
            Enter frames, page sequence, and choose an algorithm.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="rounded-full border border-teal-300 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-900 transition duration-300 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-100 dark:border-teal-700 dark:bg-slate-900/70 dark:text-teal-100 dark:hover:border-teal-500 dark:hover:bg-teal-900/40"
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="frameCount" className="form-label">
            Number of Frames
          </label>
          <input
            id="frameCount"
            type="number"
            min="1"
            value={frameCount}
            onChange={(event) => onFrameCountChange(event.target.value)}
            className="field-input mono"
            placeholder="Ex: 3"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="referenceString" className="form-label">
            Page Reference String (comma-separated)
          </label>
          <input
            id="referenceString"
            type="text"
            value={referenceString}
            onChange={(event) => onReferenceStringChange(event.target.value)}
            className="field-input mono"
            placeholder="Ex: 7, 0, 1, 2, 0, 3, 0"
          />
        </div>
      </div>

      <div className="mt-4 max-w-xs">
        <label htmlFor="algorithmSelect" className="form-label">
          Select Algorithm
        </label>
        <select
          id="algorithmSelect"
          value={selectedAlgorithm}
          onChange={(event) => onAlgorithmChange(event.target.value)}
          className="field-input"
        >
          {ALGORITHMS.map((algorithm) => (
            <option key={algorithm} value={algorithm}>
              {algorithm}
            </option>
          ))}
        </select>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-xl border border-rose-300 bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
          {errorMessage}
        </p>
      ) : null}
    </section>
  )
}

export default InputForm
