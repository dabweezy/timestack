import React from 'react'

interface NeonBorderProps {
  children: React.ReactNode
  color1?: string
  color2?: string
  animationType?: 'none' | 'half' | 'full'
  duration?: number
  className?: string
}

const NeonBorder: React.FC<NeonBorderProps> = ({
  children,
  color1 = '#0496ff',
  color2 = '#ff0a54',
  animationType = 'half',
  duration = 6,
  className = ''
}) => {
  const getWidth = (type: 'none' | 'half' | 'full') => {
    switch (type) {
      case 'none':
        return 12
      case 'half':
        return 50
      case 'full':
        return 100
      default:
        return 50
    }
  }

  const animWidth = getWidth(animationType)
  const durationInSeconds = `${duration}s`

  return (
    <div
      className={`relative inline-block h-10 w-full max-w-sm overflow-hidden rounded-lg p-px z-10 ${className}`}
      style={{
        '--neon-border-duration': durationInSeconds,
        '--anim-width': `${animWidth}%`,
        '--color1': color1,
        '--color2': color2
      } as React.CSSProperties}
    >
      {/* First border layer */}
      <div
        className={`neon-border-one rounded-lg ${animationType !== 'none' ? 'animate-neon-border' : ''}`}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          filter: `blur(1px) drop-shadow(0 0 12px ${color1})`,
          zIndex: -1,
          inset: 0
        }}
      >
        <div
          className="neon-border-one-before"
          style={{
            position: 'absolute',
            overflow: 'hidden',
            top: 0,
            left: 0,
            width: `${animWidth}%`,
            height: '100%',
            background: `linear-gradient(135deg, ${color1}, ${color1}, transparent, transparent)`
          }}
        />
      </div>

      {/* Second border layer */}
      <div
        className={`neon-border-two rounded-lg ${animationType !== 'none' ? 'animate-neon-border' : ''}`}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          filter: `blur(1px) drop-shadow(0 0 12px ${color2})`,
          zIndex: -1,
          inset: 0
        }}
      >
        <div
          className="neon-border-two-before"
          style={{
            position: 'absolute',
            bottom: '0%',
            right: '0%',
            overflow: 'hidden',
            width: `${animWidth}%`,
            height: '100%',
            background: `linear-gradient(135deg, transparent, transparent, ${color2}, ${color2})`
          }}
        />
      </div>

      {/* Content */}
      <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center relative z-10">
        {children}
      </div>
    </div>
  )
}

export default NeonBorder
