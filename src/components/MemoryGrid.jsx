import { useEffect, useMemo, useRef } from 'react'

function MemoryGrid({ steps, frameCount, currentStep }) {
  const scrollRef = useRef(null)

  const visibleSteps = useMemo(() => {
    if (!steps || steps.length === 0 || currentStep < 0) {
      return []
    }
    return steps.slice(0, currentStep + 1)
  }, [steps, currentStep])

  useEffect(() => {
    if (!scrollRef.current || visibleSteps.length === 0) {
      return
    }

    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollWidth,
      behavior: 'smooth',
    })
  }, [visibleSteps.length])

  if (visibleSteps.length === 0) {
    return (
      <section className="surface-card min-w-0">
        <h2 className="mb-3 text-xl font-bold text-teal-950 dark:text-teal-50">
          Memory Frame Visualization Grid
        </h2>
        <p className="text-sm text-teal-700 dark:text-teal-300">
          Run a simulation to visualize memory behavior over time.
        </p>
      </section>
    )
  }

  return (
    <section className="surface-card min-w-0">
      <h2 className="mb-4 text-xl font-bold text-teal-950 dark:text-teal-50">
        Memory Frame Visualization Grid
      </h2>

      <div className="mb-3 flex gap-3 text-xs font-medium">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
          Green = Page Hit
        </span>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
          Red = Page Fault
        </span>
      </div>

      <div ref={scrollRef} className="overflow-x-auto pb-2">
        <table className="w-max border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-[86px] rounded-lg bg-teal-100 px-2 py-2 text-left text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-200">
                Frame
              </th>
              {visibleSteps.map((step, index) => {
                const isCurrent = index === currentStep
                return (
                  <th
                    key={`${step.step}-${step.page}`}
                    className={`min-w-[90px] rounded-lg border px-2 py-2 text-center text-xs transition-all ${
                      step.isHit
                        ? 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-100'
                        : 'border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-900/50 dark:text-rose-100'
                    } ${isCurrent ? 'animate-pop ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''}`}
                  >
                    <div>Step {step.step}</div>
                    <div className="mono mt-1 text-sm">P{step.page}</div>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: frameCount }).map((_, frameIndex) => (
              <tr key={`frame-${frameIndex}`}>
                <td className="sticky left-0 z-10 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 dark:bg-teal-950/80 dark:text-teal-200">
                  Frame {frameIndex + 1}
                </td>
                {visibleSteps.map((step, stepIndex) => {
                  const isCurrent = stepIndex === currentStep
                  const previousValue =
                    stepIndex === 0 ? null : visibleSteps[stepIndex - 1].frames[frameIndex]
                  const isInserted = previousValue !== step.frames[frameIndex]
                  return (
                    <td
                      key={`cell-${frameIndex}-${step.step}`}
                      className={`mono rounded-lg border border-teal-200 px-3 py-2 text-center text-sm font-semibold text-teal-950 transition-all dark:border-teal-800 dark:text-teal-50 ${
                        isCurrent ? 'animate-pop bg-amber-50 dark:bg-amber-900/30' : 'bg-white/85 dark:bg-slate-800/85'
                      } ${
                        isCurrent && isInserted
                          ? 'ring-2 ring-sky-400 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                          : ''
                      }`}
                    >
                      {step.frames[frameIndex] === null ? '-' : step.frames[frameIndex]}
                    </td>
                  )
                })}
              </tr>
            ))}

            <tr>
              <td className="sticky left-0 z-10 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Evicted
              </td>
              {visibleSteps.map((step, index) => (
                <td
                  key={`evicted-${step.step}`}
                  className={`mono rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200 ${
                    index === currentStep ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-slate-50 dark:bg-slate-900'
                  }`}
                >
                  {step.evicted === null ? '-' : step.evicted}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MemoryGrid
