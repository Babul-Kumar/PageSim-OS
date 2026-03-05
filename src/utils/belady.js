import { simulateFIFO } from "../algorithms/fifo";

export function generateBeladySeries(reference, minFrames = 2, maxFrames = 8) {
  const minimum = Math.max(1, Math.floor(minFrames));
  const maximum = Math.max(minimum, Math.floor(maxFrames));
  const points = [];

  for (let frames = minimum; frames <= maximum; frames += 1) {
    const result = simulateFIFO(reference, frames);
    points.push({
      frames,
      faults: result.faults,
    });
  }

  const anomalies = [];
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (current.faults > previous.faults) {
      anomalies.push({
        fromFrames: previous.frames,
        toFrames: current.frames,
        fromFaults: previous.faults,
        toFaults: current.faults,
      });
    }
  }

  return {
    points,
    anomalies,
    hasAnomaly: anomalies.length > 0,
  };
}
