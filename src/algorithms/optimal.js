import { makeResult } from "./shared";

export function simulateOptimal(reference, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const steps = [];
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
        let victimIndex = 0;
        let farthestNextUse = -1;

        frames.forEach((framePage, frameIndex) => {
          const nextUse = reference.indexOf(framePage, index + 1);
          const distance = nextUse === -1 ? Number.POSITIVE_INFINITY : nextUse;
          if (distance > farthestNextUse) {
            farthestNextUse = distance;
            victimIndex = frameIndex;
          }
        });

        replaced = frames[victimIndex];
        frames[victimIndex] = page;
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

  return makeResult("optimal", frameCount, reference, steps, hits, faults);
}
