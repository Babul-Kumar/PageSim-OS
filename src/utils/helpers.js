export const ALGORITHMS = ['FIFO', 'LRU', 'Optimal']

export function parseAndValidateInput(frameInput, referenceInput) {
  const frames = Number(frameInput)
  if (!Number.isInteger(frames) || frames <= 0) {
    return {
      isValid: false,
      errorMessage: 'Number of frames must be a positive whole number.',
    }
  }

  const rawTokens = referenceInput
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)

  if (rawTokens.length === 0) {
    return {
      isValid: false,
      errorMessage:
        'Page reference string is empty. Example: 7, 0, 1, 2, 0, 3, 0',
    }
  }

  const references = []
  for (const token of rawTokens) {
    if (!/^\d+$/.test(token)) {
      return {
        isValid: false,
        errorMessage:
          'Reference string only supports non-negative integers separated by commas.',
      }
    }
    references.push(Number(token))
  }

  return {
    isValid: true,
    frames,
    references,
    hash: `${frames}|${references.join(',')}`,
  }
}

export function buildSimulationSummary(steps) {
  const totalHits = steps.filter((step) => step.isHit).length
  const totalFaults = steps.length - totalHits
  const hitRatio = steps.length === 0 ? 0 : (totalHits / steps.length) * 100

  return {
    steps,
    totalFaults,
    totalHits,
    hitRatio,
  }
}

export function calculateVisibleStats(steps, currentStep) {
  if (!steps || steps.length === 0 || currentStep < 0) {
    return { hits: 0, faults: 0, hitRatio: 0 }
  }

  const visibleSteps = steps.slice(0, currentStep + 1)
  const hits = visibleSteps.filter((step) => step.isHit).length
  const faults = visibleSteps.length - hits
  const hitRatio = visibleSteps.length === 0 ? 0 : (hits / visibleSteps.length) * 100

  return { hits, faults, hitRatio }
}

export function formatPercent(value) {
  return `${value.toFixed(2)}%`
}

export function comparisonRowsFromResults(resultsByAlgorithm) {
  return ALGORITHMS.filter((algorithm) => Boolean(resultsByAlgorithm[algorithm])).map(
    (algorithm) => ({
      algorithm,
      ...resultsByAlgorithm[algorithm],
    }),
  )
}

export function findBestPerformer(comparisonRows) {
  if (!comparisonRows || comparisonRows.length === 0) {
    return null
  }

  const sorted = [...comparisonRows].sort((a, b) => {
    if (a.totalFaults !== b.totalFaults) {
      return a.totalFaults - b.totalFaults
    }
    if (a.hitRatio !== b.hitRatio) {
      return b.hitRatio - a.hitRatio
    }
    return a.algorithm.localeCompare(b.algorithm)
  })

  return sorted[0]
}
