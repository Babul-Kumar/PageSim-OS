import { formatPercent } from '../utils/helpers'

function StatsPanel({ currentStats, finalStats, hasSimulation, isComplete }) {
  return (
    <section className="surface-card xl:sticky xl:top-4">
      <h2 className="mb-4 text-xl font-bold text-teal-950 dark:text-teal-50">
        Stats Panel
      </h2>

      {!hasSimulation ? (
        <p className="text-sm text-teal-700 dark:text-teal-300">
          Start the simulation to view page faults, page hits, and hit ratio.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 transition-transform duration-300 hover:-translate-y-0.5 dark:border-rose-900 dark:bg-rose-900/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-200">
                Page Faults
              </p>
              <p className="mono mt-1 text-2xl font-bold text-rose-800 dark:text-rose-100">
                {currentStats.faults}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 transition-transform duration-300 hover:-translate-y-0.5 dark:border-emerald-900 dark:bg-emerald-900/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                Page Hits
              </p>
              <p className="mono mt-1 text-2xl font-bold text-emerald-800 dark:text-emerald-100">
                {currentStats.hits}
              </p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 transition-transform duration-300 hover:-translate-y-0.5 dark:border-sky-900 dark:bg-sky-900/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-200">
                Hit Ratio
              </p>
              <p className="mono mt-1 text-2xl font-bold text-sky-800 dark:text-sky-100">
                {formatPercent(currentStats.hitRatio)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-900/20 dark:text-teal-100">
            <p className="font-semibold">
              {isComplete ? 'Simulation complete.' : 'Step-by-step mode in progress.'}
            </p>
            {finalStats ? (
              <p className="mt-1">
                Final totals for selected algorithm: faults{' '}
                <span className="mono font-semibold">{finalStats.faults}</span>, hits{' '}
                <span className="mono font-semibold">{finalStats.hits}</span>, hit ratio{' '}
                <span className="mono font-semibold">
                  {formatPercent(finalStats.hitRatio)}
                </span>
                .
              </p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  )
}

export default StatsPanel
