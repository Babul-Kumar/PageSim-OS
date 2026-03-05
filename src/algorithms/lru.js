import { makeResult } from "./shared";

export function simulateLRU(reference, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const lastUsed = new Map();
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
        let lruIndex = 0;
        let oldestAccess = Number.POSITIVE_INFINITY;

        frames.forEach((framePage, frameIndex) => {
          const access = lastUsed.has(framePage) ? lastUsed.get(framePage) : -1;
          if (access < oldestAccess) {
            oldestAccess = access;
            lruIndex = frameIndex;
          }
        });

        replaced = frames[lruIndex];
        frames[lruIndex] = page;
      }
    }

    lastUsed.set(page, index);
    steps.push({
      step: index + 1,
      page,
      frames: [...frames],
      hit: isHit,
      replaced,
    });
  });

  return makeResult("lru", frameCount, reference, steps, hits, faults);
}
