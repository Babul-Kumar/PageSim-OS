import { makeResult } from "./shared";

export function simulateFIFO(reference, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const steps = [];
  let pointer = 0;
  let hits = 0;
  let faults = 0;

  reference.forEach((page, index) => {
    const isHit = frames.includes(page);
    let replaced = null;

    if (isHit) {
      hits += 1;
    } else {
      faults += 1;
      const freeSlot = frames.indexOf(null);
      if (freeSlot !== -1) {
        frames[freeSlot] = page;
      } else {
        replaced = frames[pointer];
        frames[pointer] = page;
        pointer = (pointer + 1) % frameCount;
      }
    }

    steps.push({
      step: index + 1,
      page,
      frames: [...frames],
      hit: isHit,
      replaced,
    });
  });

  return makeResult("fifo", frameCount, reference, steps, hits, faults);
}
