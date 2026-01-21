'use client'

import React, { createContext, useContext, useRef, ReactNode } from 'react'
import Lenis from 'lenis'
import { useMotion } from './MotionProvider'
import { SCROLL } from '@/lib/constants'

/**
 * Lenis Context Type
 */
interface LenisContextType {
  lenis: Lenis | null
}

/**
 * Lenis Context
 */
const LenisContext = createContext<LenisContextType>({
  lenis: null,
})

/**
 * Hook to access Lenis instance from context
 * @returns Lenis instance or null
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { lenis } = useLenisContext()
 *
 *   const scrollToTop = () => {
 *     lenis?.scrollTo(0)
 *   }
 *
 *   return <button onClick={scrollToTop}>Scroll to top</button>
 * }
 * ```
 */
export function useLenisContext() {
  return useContext(LenisContext)
}

/**
 * Props for LenisProvider component
 */
export interface LenisProviderProps {
  /** Child components */
  children: ReactNode
  /** Whether to enable Lenis (default: true) */
  enabled?: boolean
}

/**
 * Lenis Provider Component
 *
 * Wraps the application or specific sections needing smooth scroll.
 * Initializes Lenis with luxury configuration and provides the instance
 * through context for child components to access.
 *
 * Should be added to the root layout wrapping all page content.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <MotionProvider>
 *           <LenisProvider>
 *             {children}
 *           </LenisProvider>
 *         </MotionProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function LenisProvider({ children, enabled = true }: LenisProviderProps) {
  const { shouldReduceMotion } = useMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)

  React.useEffect(() => {
    // Skip if disabled or reduced motion is preferred
    if (!enabled || shouldReduceMotion) {
      return
    }

    // Initialize Lenis with luxury configuration
    const lenis = new Lenis({
      duration: SCROLL.DURATION,
      easing: SCROLL.EASING,
      orientation: 'vertical' as const,
      smoothWheel: true,
      wheelMultiplier: SCROLL.SMOOTH_MULTIPLIER,
      touchMultiplier: SCROLL.SMOOTH_TOUCH_MULTIPLIER,
      infinite: false,
    })

    // Store the instance in ref
    lenisRef.current = lenis

    // Start requestAnimationFrame loop that calls lenis.raf on each frame
    function raf(time: number) {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }

      // Destroy Lenis instance
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled, shouldReduceMotion])

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  )
}
