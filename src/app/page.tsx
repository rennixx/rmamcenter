import { cn } from '@/lib/utils'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-midnight">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-24">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-hunter to-midnight opacity-50" />

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-gold/3 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 font-serif text-5xl font-bold text-white md:text-6xl lg:text-7xl">
              Welcome to <span className="text-gradient-gold">MAM Center</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
              Experience the pinnacle of equestrian luxury with our world-class
              facilities and premium services.
            </p>
          </div>

          {/* Glass Panel Demo Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Standard Glass Panel */}
            <div className="glass-card">
              <h3 className="mb-3 font-serif text-2xl font-semibold text-gold">
                Standard Glass
              </h3>
              <p className="text-gray-300">
                A beautiful glass morphism panel with backdrop blur and subtle
                borders. Perfect for content cards.
              </p>
            </div>

            {/* Glass Panel Dark */}
            <div className="glass-panel-dark p-6">
              <h3 className="mb-3 font-serif text-2xl font-semibold text-gold">
                Dark Glass
              </h3>
              <p className="text-gray-300">
                Enhanced dark background with increased opacity for better
                content visibility and depth.
              </p>
            </div>

            {/* Glass Panel Blur */}
            <div className="glass-panel-blur p-6">
              <h3 className="mb-3 font-serif text-2xl font-semibold text-gold">
                High Blur Glass
              </h3>
              <p className="text-gray-300">
                Maximum blur effect with lighter borders for a premium,
                luxurious appearance.
              </p>
            </div>

            {/* Glass Card with Shine Effect */}
            <div className="glass-card glass-shine">
              <h3 className="mb-3 font-serif text-2xl font-semibold text-gold">
                Shine Effect
              </h3>
              <p className="text-gray-300">
                Interactive glass panel with a subtle shine animation on hover.
                Try hovering over this card!
              </p>
            </div>

            {/* Glass Card with Glow */}
            <div className="glass-card glow-subtle">
              <h3 className="mb-3 font-serif text-2xl font-semibold text-gold">
                Golden Glow
              </h3>
              <p className="text-gray-300">
                Elegant glass panel with a subtle golden glow effect that
                intensifies on hover.
              </p>
            </div>

            {/* Navigation Glass Demo */}
            <div className="glass-nav p-6 rounded-xl">
              <h3 className="mb-3 font-serif text-2xl font-semibold text-gold">
                Navigation Glass
              </h3>
              <p className="text-gray-300">
                Maximum blur (80px) designed for sticky navigation bars and
                headers.
              </p>
            </div>
          </div>

          {/* Feature Section */}
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="glass-panel-dark p-8">
              <h2 className="mb-4 font-serif text-3xl font-bold text-white">
                Luxury Color Palette
              </h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-lg bg-midnight border border-glass-border" />
                  <span className="mt-2 text-sm text-gray-400">Midnight</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-lg bg-hunter border border-glass-border" />
                  <span className="mt-2 text-sm text-gray-400">Hunter</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-lg bg-charcoal border border-glass-border" />
                  <span className="mt-2 text-sm text-gray-400">Charcoal</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-lg bg-gold border border-glass-border" />
                  <span className="mt-2 text-sm text-gray-400">Gold</span>
                </div>
              </div>
            </div>

            <div className="glass-panel-dark p-8">
              <h2 className="mb-4 font-serif text-3xl font-bold text-white">
                Accessibility Features
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  Respects prefers-reduced-motion settings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  ARIA-friendly component structure
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  Keyboard navigable with visible focus states
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  High contrast text for readability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  Fallback styles for older browsers
                </li>
              </ul>
            </div>
          </div>

          {/* Animation Demo */}
          <div className="mt-16 text-center">
            <h2 className="mb-8 font-serif text-3xl font-bold text-white">
              Animation Classes
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="glass-card animate-fade-in">
                <h3 className="mb-2 font-serif text-xl text-gold">Fade In</h3>
                <p className="text-gray-300">Smooth opacity transition</p>
              </div>
              <div className="glass-card animate-slide-up">
                <h3 className="mb-2 font-serif text-xl text-gold">Slide Up</h3>
                <p className="text-gray-300">Elegant slide animation</p>
              </div>
              <div className="glass-card animate-scale-in">
                <h3 className="mb-2 font-serif text-xl text-gold">Scale In</h3>
                <p className="text-gray-300">Subtle scale effect</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
