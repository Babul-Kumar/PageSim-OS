import { buildSimulationSummary } from '../utils/helpers'

export function simulateLRU(references, frameCount) {
  const frames = Array(frameCount).fill(null)
  const lastUsedAt = new Map()
  const steps = []

  references.forEach((page, index) => {
    const existingIndex = frames.indexOf(page)
    const isHit = existingIndex !== -1
    let evicted = null

    if (isHit) {
      lastUsedAt.set(page, index)
    } else {
      const emptyFrameIndex = frames.indexOf(null)

      if (emptyFrameIndex !== -1) {
        frames[emptyFrameIndex] = page
      } else {
        let leastRecentlyUsedIndex = 0
        let leastRecentTime = Infinity

        frames.forEach((framePage, frameIndex) => {
          const lastSeen = lastUsedAt.get(framePage) ?? -1
          if (lastSeen < leastRecentTime) {
            leastRecentTime = lastSeen
            leastRecentlyUsedIndex = frameIndex
          }
        })

        evicted = frames[leastRecentlyUsedIndex]
        lastUsedAt.delete(evicted)
        frames[leastRecentlyUsedIndex] = page
      }

      lastUsedAt.set(page, index)
    }

    steps.push({
      step: index + 1,
      page,
      frames: [...frames],
      isHit,
      evicted,
    })
  })

  return buildSimulationSummary(steps)
}

export default simulateLRU
