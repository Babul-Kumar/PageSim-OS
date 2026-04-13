import { buildSimulationSummary } from '../utils/helpers'

export function simulateFIFO(references, frameCount) {
  const frames = Array(frameCount).fill(null)
  const queue = []
  const steps = []

  references.forEach((page, index) => {
    const isHit = frames.includes(page)
    let evicted = null

    if (!isHit) {
      const emptyFrameIndex = frames.indexOf(null)

      if (emptyFrameIndex !== -1) {
        frames[emptyFrameIndex] = page
        queue.push(emptyFrameIndex)
      } else {
        const replaceFrameIndex = queue.shift()
        evicted = frames[replaceFrameIndex]
        frames[replaceFrameIndex] = page
        queue.push(replaceFrameIndex)
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

export default simulateFIFO
