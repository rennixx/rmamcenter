'use client'

import { useState, useEffect } from 'react'

/**
 * Cursor position tracking hook
 * Tracks mouse/touch position relative to viewport with touch detection
 */
export function useCursorPosition() {
  const [cursorPosition, setCursorPosition] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  })
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouch(isTouchDevice)

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice) return // Don't track on touch devices
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    const handleTouchStart = (e: TouchEvent) => {
      // Only track single touch for spotlight
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        setCursorPosition({ x: touch.clientX, y: touch.clientY })
      }
    }

    const handleTouchEnd = () => {
      setCursorPosition({ x: null, y: null })
    }

    const handleMouseLeave = () => {
      setCursorPosition({ x: null, y: null })
    }

    // Only add mouse listeners on non-touch devices
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
    }

    // Add touch listeners for all devices
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseleave', handleMouseLeave)
      }
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isTouch])

  return {
    x: isTouch ? cursorPosition.x : cursorPosition.x,
    y: isTouch ? cursorPosition.y : cursorPosition.y,
    isTouch,
  }
}
