/**
 * Configuration values for the MAM Center luxury equestrian website
 */

/**
 * Animation timing values
 */
export const ANIMATION = {
  /** Default duration for UI transitions in seconds */
  DURATION_DEFAULT: 0.5,
  /** Fast duration for micro-interactions in seconds */
  DURATION_FAST: 0.2,
  /** Slow duration for major state changes in seconds */
  DURATION_SLOW: 0.8,
  /** Page transition duration in seconds */
  DURATION_PAGE: 1,
  /** Stagger delay between animated elements in seconds */
  STAGGER_DEFAULT: 0.1,
} as const

/**
 * Scroll configuration for Lenis smooth scrolling
 */
export const SCROLL = {
  /** Smooth scroll duration in seconds */
  DURATION: 1.2,
  /** Scroll easing function */
  EASING: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  /** Multiplier for scroll speed */
  SMOOTH_MULTIPLIER: 1,
  /** Multiplier for touch scroll speed */
  SMOOTH_TOUCH_MULTIPLIER: 2,
} as const

/**
 * Breakpoint values matching Tailwind config
 */
export const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560,
} as const

/**
 * Device size categories for responsive logic
 */
export const DEVICE_SIZES = {
  /** Portrait mobile phones */
  MOBILE_SMALL: 375,
  /** Landscape phones and small tablets */
  MOBILE_LARGE: 640,
  /** Tablets portrait */
  TABLET: 768,
  /** Tablets landscape and small laptops */
  LAPTOP: 1024,
  /** Desktops */
  DESKTOP: 1280,
  /** Large desktops */
  DESKTOP_LARGE: 1536,
  /** Extra large displays */
  DESKTOP_XL: 1920,
  /** 4K displays */
  DESKTOP_4K: 2560,
} as const

/**
 * Image optimization sizes
 */
export const IMAGE_SIZES = {
  /** Thumbnail size for avatars and small previews */
  THUMBNAIL: 48,
  /** Small size for cards and list items */
  SMALL: 96,
  /** Medium size for featured content */
  MEDIUM: 256,
  /** Large size for hero images */
  LARGE: 512,
  /** Extra large size for full-width images */
  XLARGE: 1024,
  /** Maximum size for high-resolution displays */
  MAX: 2048,
} as const

/**
 * Z-index layers for consistent stacking context
 */
export const Z_INDEX = {
  /** Base layer for page content */
  BASE: 0,
  /** Sticky elements */
  STICKY: 10,
  /** Dropdown menus and tooltips */
  DROPDOWN: 100,
  /** Modal overlays */
  MODAL: 1000,
  /** Toast notifications */
  TOAST: 1100,
  /** Loading overlays */
  LOADING: 1200,
} as const

/**
 * Glass morphism visual properties
 */
export const GLASS = {
  /** Default background opacity */
  BG_OPACITY: 0.6,
  /** Light background opacity for cards */
  BG_OPACITY_LIGHT: 0.4,
  /** Dark background opacity for overlays */
  BG_OPACITY_DARK: 0.7,
  /** Border opacity */
  BORDER_OPACITY: 0.1,
  /** Default blur amount in pixels */
  BLUR_DEFAULT: 12,
  /** High blur amount for prominent glass effects */
  BLUR_HIGH: 24,
  /** Maximum blur amount */
  BLUR_MAX: 80,
} as const

/**
 * Luxe color palette
 */
export const COLORS = {
  /** Primary dark background */
  MIDNIGHT: '#0a0e27',
  /** Accent green */
  HUNTER: '#1a3a2e',
  /** Neutral dark */
  CHARCOAL: '#1a1a1f',
  /** Luxury gold accent */
  GOLD: '#d4af37',
} as const
