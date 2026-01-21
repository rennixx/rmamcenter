'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

/**
 * Motion context interface
 */
interface MotionContextValue {
  /** Whether motion should be reduced based on user/system preference */
  shouldReduceMotion: boolean
  /** Toggle function to manually override motion preference */
  toggleMotion: () => void
  /** Set motion preference directly */
  setReduceMotion: (value: boolean) => void
}

/**
 * Motion context for managing reduced motion preferences across the application
 */
const MotionContext = createContext<MotionContextValue | undefined>(undefined)

/**
 * Props for the MotionProvider component
 */
export interface MotionProviderProps {
  /** Child components that will have access to motion context */
  children: React.ReactNode
  /** Initial reduced motion value (defaults to system preference) */
  initialReducedMotion?: boolean
}

/**
 * Motion Provider Component
 *
 * Detects system-level prefers-reduced-motion setting and provides
 * a way to manually override it. The preference is stored in memory
 * only (not localStorage) per requirements.
 *
 * @example
 * ```tsx
 * <MotionProvider>
 *   <App />
 * </MotionProvider>
 * ```
 */
export function MotionProvider({ children, initialReducedMotion }: MotionProviderProps) {
  // State for tracking reduced motion preference
  const [shouldReduceMotion, setShouldReduceMotion] = useState<boolean>(
    initialReducedMotion ?? false
  )
  const [isInitialized, setIsInitialized] = useState(false)

  // Detect system preference on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setShouldReduceMotion(mediaQuery.matches)
    setIsInitialized(true)

    // Listen for changes in system preference
    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches)
    }

    // Add event listener (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  /**
   * Toggle motion preference
   * Allows users to manually override system preference
   */
  const toggleMotion = useCallback(() => {
    setShouldReduceMotion((prev) => !prev)
  }, [])

  /**
   * Set motion preference directly
   * @param value - The new reduced motion value
   */
  const setReduceMotion = useCallback((value: boolean) => {
    setShouldReduceMotion(value)
  }, [])

  const contextValue: MotionContextValue = {
    shouldReduceMotion,
    toggleMotion,
    setReduceMotion,
  }

  // Don't render children until we've detected system preference
  // This prevents a flash of animated content
  if (!isInitialized) {
    return null
  }

  return (
    <MotionContext.Provider value={contextValue}>
      {children}
    </MotionContext.Provider>
  )
}

/**
 * Hook to access motion context
 *
 * @throws Error if used outside of MotionProvider
 * @returns Motion context value
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { shouldReduceMotion, toggleMotion } = useMotion()
 *
 *   return (
 *     <div>
 *       <p>Motion reduced: {shouldReduceMotion ? 'Yes' : 'No'}</p>
 *       <button onClick={toggleMotion}>Toggle</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useMotion(): MotionContextValue {
  const context = useContext(MotionContext)

  if (context === undefined) {
    throw new Error('useMotion must be used within a MotionProvider')
  }

  return context
}

/**
 * HOC to inject motion context props into a component
 *
 * @param Component - The component to wrap
 * @returns A new component with motion context props
 *
 * @example
 * ```tsx
 * const withMotion = withMotionContext(MyComponent)
 * ```
 */
export function withMotionContext<P extends MotionContextValue>(
  Component: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof MotionContextValue>> {
  return function WithMotionComponent(props: Omit<P, keyof MotionContextValue>) {
    const motionContext = useMotion()

    return <Component {...(props as P)} {...motionContext} />
  }
}
