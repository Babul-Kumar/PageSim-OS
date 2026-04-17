import { useEffect, useMemo, useState } from 'react'
import simulateFIFO from '../algorithms/fifo'
import simulateLRU from '../algorithms/lru'
import simulateOptimal from '../algorithms/optimal'
import ComparisonChart from '../components/ComparisonChart'
import Controls from '../components/Controls'
import InputForm from '../components/InputForm'
import MemoryGrid from '../components/MemoryGrid'
import StatsPanel from '../components/StatsPanel'
import {
  calculateVisibleStats,
  comparisonRowsFromResults,
  findBestPerformer,
  formatPercent,
  parseAndValidateInput,
} from '../utils/helpers'

const DEFAULT_FRAMES = '3'
const DEFAULT_REFERENCE = '7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2'
const DEFAULT_ALGORITHM = 'FIFO'
const START_SIMULATION_STEP_DELAY = 650
const sectionDelayStyle = (delay) => ({
  animationDelay: `${delay}ms`,
  animationFillMode: 'both',
})

function Simulator() {
  const [frameCountInput, setFrameCountInput] = useState(DEFAULT_FRAMES)
  const [referenceInput, setReferenceInput] = useState(DEFAULT_REFERENCE)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(DEFAULT_ALGORITHM)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [resultsByAlgorithm, setResultsByAlgorithm] = useState({})
  const [currentStep, setCurrentStep] = useState(-1)
  const [simulationHash, setSimulationHash] = useState('')
  const [lastExecutedAlgorithm, setLastExecutedAlgorithm] = useState(DEFAULT_ALGORITHM)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const clearCurrentSimulation = () => {
    setResultsByAlgorithm({})
    setCurrentStep(-1)
    setSimulationHash('')
    setIsAutoPlaying(false)
  }

  const runSimulation = () => {
    const validation = parseAndValidateInput(frameCountInput, referenceInput)
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage)
      return null
    }

    const { frames, references, hash } = validation
    const computedResults = {
      FIFO: simulateFIFO(references, frames),
      LRU: simulateLRU(references, frames),
      Optimal: simulateOptimal(references, frames),
    }

    setResultsByAlgorithm(computedResults)
    setErrorMessage('')
    setSimulationHash(hash)

    return {
      frameCount: frames,
      references,
      hash,
      computedResults,
    }
  }

  const handleStartSimulation = () => {
    const simulationData = runSimulation()
    if (!simulationData) {
      return
    }

    const selectedResult = simulationData.computedResults[selectedAlgorithm]
    if (selectedResult.steps.length === 0) {
      setCurrentStep(-1)
      setIsAutoPlaying(false)
      return
    }

    setCurrentStep(0)
    setIsAutoPlaying(selectedResult.steps.length > 1)
    setLastExecutedAlgorithm(selectedAlgorithm)
  }

  const handleStepSimulation = () => {
    setIsAutoPlaying(false)

    const simulationData = runSimulation()
    if (!simulationData) {
      return
    }

    const selectedResult = simulationData.computedResults[selectedAlgorithm]
    const maxStepIndex = selectedResult.steps.length - 1
    const shouldResetSequence =
      simulationData.hash !== simulationHash || selectedAlgorithm !== lastExecutedAlgorithm

    setCurrentStep((previousStep) => {
      if (shouldResetSequence || previousStep < 0) {
        return 0
      }
      return Math.min(previousStep + 1, maxStepIndex)
    })

    setLastExecutedAlgorithm(selectedAlgorithm)
  }

  const handleReset = () => {
    setFrameCountInput(DEFAULT_FRAMES)
    setReferenceInput(DEFAULT_REFERENCE)
    setSelectedAlgorithm(DEFAULT_ALGORITHM)
    setErrorMessage('')
    setIsDarkMode(false)
    setIsAutoPlaying(false)
    setLastExecutedAlgorithm(DEFAULT_ALGORITHM)
    clearCurrentSimulation()
  }

  const selectedResult = resultsByAlgorithm[selectedAlgorithm]
  const totalSteps = selectedResult?.steps?.length ?? 0
  const hasSimulation = totalSteps > 0 && currentStep >= 0
  const isStepCompleted = hasSimulation && currentStep >= totalSteps - 1

  const visibleStats = useMemo(
    () => calculateVisibleStats(selectedResult?.steps ?? [], currentStep),
    [selectedResult, currentStep],
  )

  const finalStats = selectedResult
    ? {
        hits: selectedResult.totalHits,
        faults: selectedResult.totalFaults,
        hitRatio: selectedResult.hitRatio,
      }
    : null

  const visibleSteps = useMemo(() => {
    if (!selectedResult || currentStep < 0) {
      return []
    }
    return selectedResult.steps.slice(0, currentStep + 1)
  }, [selectedResult, currentStep])

  const comparisonRows = useMemo(() => {
    if (!isStepCompleted) {
      return []
    }
    return comparisonRowsFromResults(resultsByAlgorithm)
  }, [resultsByAlgorithm, isStepCompleted])

  const bestPerformer = useMemo(
    () => findBestPerformer(comparisonRows),
    [comparisonRows],
  )

  useEffect(() => {
    if (!isAutoPlaying || !selectedResult?.steps?.length) {
      return
    }

    const finalStepIndex = selectedResult.steps.length - 1
    const timerId = window.setInterval(() => {
      let reachedFinalStep = false

      setCurrentStep((previousStep) => {
        const nextStep = Math.min(previousStep + 1, finalStepIndex)
        reachedFinalStep = nextStep >= finalStepIndex
        return nextStep
      })

      if (reachedFinalStep) {
        window.clearInterval(timerId)
        setIsAutoPlaying(false)
      }
    }, START_SIMULATION_STEP_DELAY)

    return () => window.clearInterval(timerId)
  }, [isAutoPlaying, selectedResult])

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <header className="enter-up mb-6 rounded-3xl border border-teal-200/80 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 text-white shadow-soft dark:border-teal-900 dark:from-teal-950 dark:via-teal-900 dark:to-emerald-900">
        <h1 className="text-2xl font-bold md:text-4xl">
          Efficient Page Replacement Algorithm Simulator
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-teal-50/95 md:text-base">
          Simulate FIFO, LRU, and Optimal page replacement strategies with clear
          step-by-step memory visualization and performance comparison.
        </p>
      </header>

      <div className="space-y-5">
        <div className="enter-up" style={sectionDelayStyle(80)}>
          <InputForm
            frameCount={frameCountInput}
            referenceString={referenceInput}
            selectedAlgorithm={selectedAlgorithm}
            onFrameCountChange={(value) => {
              setFrameCountInput(value)
              setErrorMessage('')
              clearCurrentSimulation()
            }}
            onReferenceStringChange={(value) => {
              setReferenceInput(value)
              setErrorMessage('')
              clearCurrentSimulation()
            }}
            onAlgorithmChange={setSelectedAlgorithm}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((prevState) => !prevState)}
            errorMessage={errorMessage}
          />
        </div>

        <div className="enter-up" style={sectionDelayStyle(140)}>
          <Controls
            onStart={handleStartSimulation}
            onStep={handleStepSimulation}
            onReset={handleReset}
            disableStep={
              isAutoPlaying || (isStepCompleted && selectedAlgorithm === lastExecutedAlgorithm)
            }
            isAutoPlaying={isAutoPlaying}
          />
        </div>

        <section className="enter-up surface-card" style={sectionDelayStyle(180)}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-teal-950 dark:text-teal-50">
                Execution Status
              </h2>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                Selected algorithm: <span className="mono font-semibold">{selectedAlgorithm}</span>
              </p>
            </div>
            <span className="rounded-full border border-teal-300 bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:border-teal-700 dark:bg-teal-900/30 dark:text-teal-100">
              {hasSimulation
                ? `Step ${currentStep + 1} of ${totalSteps}`
                : 'No active simulation'}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-teal-100 dark:bg-teal-900/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500 transition-all duration-500 ease-out"
              style={{
                width: `${hasSimulation ? ((currentStep + 1) / totalSteps) * 100 : 0}%`,
              }}
            />
          </div>
        </section>

        <div
          className="enter-up grid gap-5 xl:grid-cols-[minmax(0,1.85fr)_minmax(320px,1fr)]"
          style={sectionDelayStyle(220)}
        >
          <div className="min-w-0">
            <MemoryGrid
              steps={selectedResult?.steps ?? []}
              frameCount={Number(frameCountInput) || 0}
              currentStep={currentStep}
            />
          </div>
          <div className="min-w-0">
            <StatsPanel
              currentStats={visibleStats}
              finalStats={finalStats}
              hasSimulation={hasSimulation}
              isComplete={isStepCompleted}
            />
          </div>
        </div>

        <section className="enter-up surface-card" style={sectionDelayStyle(280)}>
          <h2 className="mb-4 text-xl font-bold text-teal-950 dark:text-teal-50">
            Step-by-step Execution Table
          </h2>

          {visibleSteps.length === 0 ? (
            <p className="text-sm text-teal-700 dark:text-teal-300">
              Use Start Simulation or Step-by-Step Execution to populate this table.
            </p>
          ) : (
            <div className="max-h-[380px] overflow-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="sticky top-0 bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Step</th>
                    <th className="px-3 py-2 text-left">Page</th>
                    <th className="px-3 py-2 text-left">Frames</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Evicted Page</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleSteps.map((step, index) => (
                    <tr
                      key={`log-${step.step}-${step.page}`}
                      className={`border-b border-teal-100 transition-colors dark:border-teal-900 ${
                        index === currentStep
                          ? 'bg-amber-50 dark:bg-amber-900/20'
                          : 'bg-white/60 dark:bg-slate-900/40'
                      }`}
                    >
                      <td className="mono px-3 py-2">{step.step}</td>
                      <td className="mono px-3 py-2">{step.page}</td>
                      <td className="mono px-3 py-2">
                        [{step.frames.map((frameValue) => (frameValue ?? '-')).join(', ')}]
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            step.isHit
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-100'
                          }`}
                        >
                          {step.isHit ? 'Hit' : 'Fault'}
                        </span>
                      </td>
                      <td className="mono px-3 py-2">
                        {step.evicted === null ? '-' : step.evicted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="enter-up" style={sectionDelayStyle(320)}>
          <ComparisonChart
            comparisonRows={comparisonRows}
            isDarkMode={isDarkMode}
            isReady={isStepCompleted}
          />
        </div>

        {bestPerformer ? (
          <section className="enter-up surface-card" style={sectionDelayStyle(360)}>
            <h2 className="text-xl font-bold text-teal-950 dark:text-teal-50">
              Insight
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-teal-800 dark:text-teal-200">
              Best performer for this reference string is{' '}
              <span className="font-bold">{bestPerformer.algorithm}</span> with{' '}
              <span className="mono font-semibold">{bestPerformer.totalFaults}</span>{' '}
              page faults and{' '}
              <span className="mono font-semibold">
                {formatPercent(bestPerformer.hitRatio)}
              </span>{' '}
              hit ratio.
            </p>
          </section>
        ) : null}
      </div>
    </main>
    <p className="section-subtitle mt-8 text-center text-xs md:text-sm">
        Developed by Botbros(Babul,Aswati,Tejjas)
    </p>
  )
}

export default Simulator
