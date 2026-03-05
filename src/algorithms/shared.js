import { ALGORITHM_LABELS } from "./constants";

function withRatios(hits, faults, total) {
  return {
    hitRatio: total > 0 ? hits / total : 0,
    faultRatio: total > 0 ? faults / total : 0,
  };
}

export function makeResult(algorithm, frameCount, reference, steps, hits, faults) {
  const total = reference.length;
  return {
    algorithm,
    label: ALGORITHM_LABELS[algorithm],
    frameCount,
    reference,
    steps,
    hits,
    faults,
    total,
    ...withRatios(hits, faults, total),
  };
}
