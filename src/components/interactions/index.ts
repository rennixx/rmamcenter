/**
 * Advanced Interactions & Micro-animations
 *
 * Phase 6: Luxury interaction components for MAM Center
 * All components support reduced motion preferences for accessibility.
 */

// Cursor Spotlight
export {
  CursorSpotlight,
  ConfigurableSpotlight,
  SpotlightProvider,
} from './cursor-spotlight'
export type { CursorSpotlightProps, ConfigurableSpotlightProps } from './cursor-spotlight'

// Magnetic Element
export { MagneticElement, MagneticButton } from './magnetic-element'
export type { MagneticElementProps } from './magnetic-element'

// Texture Renderer
export { TextureRenderer, TexturePanel } from './texture-renderer'
export type { TextureRendererProps } from './texture-renderer'

// Loading Overlay
export {
  LoadingOverlay,
  Skeleton,
  BlurUpImage,
  PageLoader,
} from './loading-overlay'
export type { LoadingOverlayProps, SkeletonProps as LoadingSkeletonProps } from './loading-overlay'

// Button Ripple
export { ButtonRipple, RippleButton, RippleLink, useRipple } from './button-ripple'
export type { ButtonRippleProps, RippleButtonProps, RippleLinkProps } from './button-ripple'

// Scroll Progress
export {
  ScrollProgress,
  CircularScrollProgress,
  ReadingProgress,
  useScrollProgress,
} from './scroll-progress'
export type {
  ScrollProgressProps,
  CircularScrollProgressProps,
  ReadingProgressProps,
} from './scroll-progress'

// Count Up Animation
export {
  CountUp,
  AnimatedStat,
  StatsGrid,
  useCountUp,
  CountUpTimer,
} from './count-up'
export type { CountUpProps, AnimatedStatProps, StatsGridProps } from './count-up'

// Particle System
export {
  ParticleBackground,
  FloatingParticles,
  DustMotes,
  SparkleField,
  ParticleSystemProvider,
} from './particle-system'
export type {
  ParticleBackgroundProps,
  FloatingParticlesProps,
  DustMotesProps,
  SparkleFieldProps,
  ParticleSystemProviderProps,
} from './particle-system'

// Hooks
export { useCursorPosition } from '@/hooks/use-cursor-position'

export { useMagneticEffect, useHoverLight } from '@/hooks/use-magnetic-effect'
