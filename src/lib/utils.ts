import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines clsx and tailwind-merge for conditional Tailwind classes
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Checks if the user's operating system prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Performance monitoring helper for tracking Core Web Vitals
 */
export const performanceMonitor = {
  /**
   * Measures the time it takes for a function to execute
   * @param name - Label for the measurement
   * @param fn - Function to measure
   * @returns Result of the function
   */
  measure<T>(name: string, fn: () => T): T {
    if (typeof window === 'undefined' || !window.performance) {
      return fn()
    }

    const start = performance.now()
    const result = fn()
    const end = performance.now()

    const duration = end - start
    if (duration > 100) {
      console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`)
    }

    return result
  },

  /**
   * Marks a specific point in the performance timeline
   * @param name - Label for the mark
   */
  mark(name: string): void {
    if (typeof window === 'undefined' || !window.performance) return
    performance.mark(name)
  },

  /**
   * Measures the time between two marks
   * @param name - Label for the measurement
   * @param startMark - Starting mark name
   * @param endMark - Ending mark name
   */
  measureMark(name: string, startMark: string, endMark: string): void {
    if (typeof window === 'undefined' || !window.performance) return
    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name)[0]
      if (measure && measure.duration > 100) {
        console.warn(`[Performance] ${name} took ${measure.duration.toFixed(2)}ms`)
      }
    } catch (e) {
      // Marks may not exist, ignore error
    }
  },

  /**
   * Gets the current memory usage if available (Chrome only)
   * @returns Memory info or null
   */
  getMemoryUsage(): { used: number; total: number } | null {
    if (typeof window === 'undefined') return null

    // memory API is Chrome-specific and not in standard types
    const perf = performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }
    const memory = perf.memory
    if (!memory) return null

    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
      total: Math.round(memory.totalJSHeapSize / 1048576),
    }
  },

  /**
   * Observes performance entries for specific types
   * @param type - Entry type to observe
   * @param callback - Function to call when new entries are observed
   */
  observeEntries(
    type: string,
    callback: (entries: PerformanceEntry[]) => void
  ): () => void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return () => {}
    }

    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries())
    })

    observer.observe({ entryTypes: [type] })

    return () => observer.disconnect()
  },
}
