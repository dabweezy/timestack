'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface CountingNumberProps {
  number: number
  fromNumber?: number
  decimalPlaces?: number
  duration?: number
  className?: string
}

const CountingNumber: React.FC<CountingNumberProps> = ({
  number,
  fromNumber = 0,
  decimalPlaces = 0,
  duration = 2,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  const spring = useSpring(fromNumber, {
    stiffness: 90,
    damping: 50,
    duration: duration * 1000
  })
  
  const display = useTransform(spring, (current) => {
    return current.toFixed(decimalPlaces)
  })

  useEffect(() => {
    setIsVisible(true)
    spring.set(number)
  }, [number, spring])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
    >
      {display}
    </motion.span>
  )
}

export default CountingNumber
