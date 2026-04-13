import { buildSimulationSummary } from '../utils/helpers'

function findOptimalFrameToReplace(frames, references, currentIndex) {
  let replaceFrameIndex = 0
  let farthestNextUse = -1

  for (let frameIndex = 0; frameIndex < frames.length; frameIndex += 1) {
    const framePage = frames[frameIndex]
    const nextUseDistance = references
      .slice(currentIndex + 1)
      .indexOf(framePage)

    if (nextUseDistance === -1) {
      return frameIndex
    }

    if (nextUseDistance > farthestNextUse) {
      farthestNextUse = nextUseDistance
      replaceFrameIndex = frameIndex
    }
  }

  return replaceFrameIndex
}

export function simulateOptimal(references, frameCount) {
  const frames = Array(frameCount).fill(null)
  const steps = []

  references.forEach((page, index) => {
    const isHit = frames.includes(page)
    let evicted = null

    if (!isHit) {
      const emptyFrameIndex = frames.indexOf(null)

      if (emptyFrameIndex !== -1) {
        frames[emptyFrameIndex] = page
      } else {
        const replaceFrameIndex = findOptimalFrameToReplace(frames, references, index)
        evicted = frames[replaceFrameIndex]
        frames[replaceFrameIndex] = page
      }
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

export default simulateOptimal
