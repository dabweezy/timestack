import React from 'react'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  anchor?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  size = 200,
  duration = 15000,
  borderWidth = 1.5,
  anchor = 90,
  colorFrom = '#ffaa40',
  colorTo = '#9c40ff',
  delay = 0
}) => {
  const durationInSeconds = `${duration}s`
  const delayInSeconds = `${delay}s`
  
  // Calculate beam length as a percentage of the total perimeter
  const beamLength = Math.min(size * 0.15, 35) // Slightly longer beam, max 35px

  return (
    <div
      className={`border-beam pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--beam-length)*1px)] animate-border-beam-clockwise-reverse after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-to),var(--color-from),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] ${className}`}
      style={{
        '--size': size,
        '--beam-length': beamLength,
        '--duration': durationInSeconds,
        '--anchor': anchor,
        '--border-width': borderWidth,
        '--color-from': colorFrom,
        '--color-to': colorTo,
        '--delay': delayInSeconds
      } as React.CSSProperties}
    />
  )
}

export default BorderBeam
