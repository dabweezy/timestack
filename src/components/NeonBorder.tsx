import React from 'react'

interface NeonBorderProps {
  children: React.ReactNode
  color1?: string
  color2?: string
  duration?: number
  className?: string
}

const NeonBorder: React.FC<NeonBorderProps> = ({
  children,
  color1 = '#0496ff',
  color2 = '#ff0a54',
  duration = 3,
  className = ''
}) => {
  return (
    <div
      className={`relative rounded-lg p-2 animate-neon-border ${className}`}
      style={{
        '--neon-border-duration': `${duration}s`,
        background: `conic-gradient(from 0deg, transparent, ${color1}, ${color2}, transparent)`,
        padding: '2px',
        borderRadius: '0.5rem'
      } as React.CSSProperties}
    >
      <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default NeonBorder
