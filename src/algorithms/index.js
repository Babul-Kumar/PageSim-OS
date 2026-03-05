import { simulateFIFO } from "./fifo";
import { simulateLRU } from "./lru";
import { simulateOptimal } from "./optimal";

export { ALGORITHM_LABELS, ALGORITHM_DESCRIPTIONS } from "./constants";
export { parseReferenceString } from "./parseReferenceString";
export { simulateFIFO, simulateLRU, simulateOptimal };

const RUNNERS = {
  fifo: simulateFIFO,
  lru: simulateLRU,
  optimal: simulateOptimal,
};

export function simulateByAlgorithm(algorithm, reference, frameCount) {
  const runner = RUNNERS[algorithm] || RUNNERS.optimal;
  return runner(reference, frameCount);
}

export function runSimulations(reference, frameCount, mode) {
  if (mode === "compare") {
    return {
      fifo: simulateByAlgorithm("fifo", reference, frameCount),
      lru: simulateByAlgorithm("lru", reference, frameCount),
      optimal: simulateByAlgorithm("optimal", reference, frameCount),
    };
  }

  return { [mode]: simulateByAlgorithm(mode, reference, frameCount) };
}
