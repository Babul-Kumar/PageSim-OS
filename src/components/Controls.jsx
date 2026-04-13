function Controls({ onStart, onStep, onReset, disableStep }) {
  return (
    <section className="surface-card">
      <h2 className="mb-4 text-xl font-bold text-teal-950 dark:text-teal-50">
        Controls
      </h2>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-teal-500 sm:w-auto"
        >
          Start Simulation
        </button>
        <button
          type="button"
          onClick={onStep}
          disabled={disableStep}
          className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:from-amber-300 hover:to-orange-300 disabled:cursor-not-allowed disabled:bg-amber-300/70 disabled:text-slate-600 sm:w-auto dark:disabled:bg-amber-900/60 dark:disabled:text-amber-200"
        >
          Step-by-Step Execution
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-xl border border-slate-300 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-200 sm:w-auto dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          Reset
        </button>
      </div>
    </section>
  )
}

export default Controls
