'use client'

import React, { useState, useRef, Suspense } from 'react'
import { Star, ArrowRight, Sparkles, Users, Trophy, ChevronDown, Trees } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GlassPanel, GlassPanelSection } from '@/components/ui/GlassPanel'
import { GlassCard, GlassCardGrid } from '@/components/ui/GlassCard'
import { GlassButton, GlassButtonGroup } from '@/components/ui/GlassButton'
import {
  Display,
  Heading,
  Paragraph,
  Text,
  Label,
  Caption,
  Link as TextLink,
} from '@/components/ui/Typography'
import { MotionWrapper, StaggerContainer, ViewportAnimator } from '@/components/motion/MotionWrapper'
import { ParallaxSection } from '@/components/motion/parallax-section'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ScrollControlled3D } from '@/components/3d/scroll-controlled-3d'
import { CanvasWrapper } from '@/components/3d/canvas-wrapper'
import { useMotion } from '@/components/providers/MotionProvider'
import { useLenisScroll } from '@/hooks/use-lenis'

export default function HomePage() {
  const { shouldReduceMotion, toggleMotion } = useMotion()
  const { scrollTo } = useLenisScroll()
  const [isLoading, setIsLoading] = useState(false)
  const cubeRef = useRef<any>(null)

  const handleLoadingClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const scrollToIntro = () => {
    scrollTo(window.innerHeight)
  }

  return (
    <>
      <Header />

      {/* Hero Section with Parallax Background */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
        {/* Parallax Background Elements */}
        <ParallaxSection speed={-0.3} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-midnight via-hunter to-midnight opacity-50" />
          <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-gold/3 blur-3xl" />
        </ParallaxSection>

        <ParallaxSection speed={-0.5} className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-gold/20 blur-xl" />
          <div className="absolute top-3/4 right-1/4 h-2 w-2 rounded-full bg-gold/10 blur-xl" />
        </ParallaxSection>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <StaggerContainer animation="fade-in" staggerDelay={150}>
            <MotionWrapper animation="slide-down">
              <p className="text-gold font-medium tracking-wide uppercase text-sm mb-4">
                Welcome to MAM Center
              </p>
            </MotionWrapper>

            <MotionWrapper animation="slide-up" delay={100}>
              <Display size="3xl" gradient="gold" className="mb-6">
                Luxury Equestrian Excellence
              </Display>
            </MotionWrapper>

            <MotionWrapper animation="fade-in" delay={200}>
              <Paragraph size="lg" maxWidth="prose" className="mb-8">
                Experience the pinnacle of equestrian luxury with our world-class
                facilities, premium services, and exclusive experiences.
              </Paragraph>
            </MotionWrapper>

            <MotionWrapper animation="slide-up" delay={300}>
              <GlassButtonGroup>
                <GlassButton variant="primary" size="large" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore Our Services
                </GlassButton>
                <GlassButton variant="secondary" size="large">
                  Learn More
                </GlassButton>
              </GlassButtonGroup>
            </MotionWrapper>
          </StaggerContainer>
        </div>

        {/* Scroll Indicator */}
        <MotionWrapper animation="fade-in" delay={500}>
          <button
            onClick={scrollToIntro}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/60 hover:text-gold transition-colors"
            aria-label="Scroll to explore more"
          >
            <Caption>Scroll to explore</Caption>
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </button>
        </MotionWrapper>
      </section>

      {/* Smooth Scroll Indicator Section */}
      <section className="relative px-6 py-24 bg-midnight">
        <div className="mx-auto max-w-4xl text-center">
          <ViewportAnimator animation="fade-in">
            <Display size="2xl" className="mb-6">
              Experience Smooth Scrolling
            </Display>
            <Paragraph size="lg" maxWidth="prose" className="mb-8">
              Scroll down to see our luxury smooth scroll experience powered by Lenis.
            </Paragraph>
          </ViewportAnimator>
        </div>
      </section>

      {/* Parallax Showcase Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with parallax layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight to-hunter" />

        <ParallaxSection speed={0.3} className="absolute top-20 left-10">
          <GlassPanel variant="dark" className="p-6">
            <Trees className="h-8 w-8 text-gold mb-2" />
            <Heading level={4}>World-Class Horses</Heading>
            <Paragraph size="sm">Premium equestrian facilities</Paragraph>
          </GlassPanel>
        </ParallaxSection>

        <ParallaxSection speed={0.5} className="absolute top-40 right-20">
          <GlassPanel variant="elevated" className="p-6">
            <Trophy className="h-8 w-8 text-gold mb-2" />
            <Heading level={4}>Award Winning</Heading>
            <Paragraph size="sm">Excellence in equine care</Paragraph>
          </GlassPanel>
        </ParallaxSection>

        <ParallaxSection speed={0.2} className="absolute bottom-40 left-20">
          <GlassPanel variant="bordered" className="p-6">
            <Trees className="h-8 w-8 text-gold mb-2" />
            <Heading level={4}>Beautiful Environment</Heading>
            <Paragraph size="sm">60 acres of pristine grounds</Paragraph>
          </GlassPanel>
        </ParallaxSection>

        <div className="relative z-10 text-center px-6">
          <ViewportAnimator animation="slide-up">
            <Display size="2xl" gradient="gold" className="mb-4">
              Parallax Effects
            </Display>
            <Paragraph size="lg" maxWidth="prose">
              Elements move at different speeds as you scroll, creating depth and immersion.
            </Paragraph>
          </ViewportAnimator>
        </div>
      </section>

      {/* Scroll Reveal Showcase */}
      <section className="relative px-6 py-32 bg-midnight">
        <div className="mx-auto max-w-6xl">
          <ViewportAnimator animation="fade-in">
            <div className="text-center mb-16">
              <Display size="2xl" className="mb-4">Scroll Reveal</Display>
              <Paragraph maxWidth="prose">
                Elements gracefully appear as they enter your viewport.
              </Paragraph>
            </div>
          </ViewportAnimator>

          <ScrollReveal stagger={100} threshold={0.15}>
            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard
                icon={<Star className="h-6 w-6" />}
                title="Premium Quality"
                description="World-class facilities and services"
                noise
              />
              <GlassCard
                icon={<Sparkles className="h-6 w-6" />}
                title="Luxury Experience"
                description="Exclusive amenities for clients"
                variant="elevated"
                noise
              />
              <GlassCard
                icon={<Trophy className="h-6 w-6" />}
                title="Award Winning"
                description="Excellence in equestrian care"
                variant="bordered"
                noise
              />
            </div>
          </ScrollReveal>

          <ScrollReveal stagger={100} threshold={0.15} delay={300}>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <GlassCard
                icon={<Users className="h-6 w-6" />}
                title="Expert Team"
                description="Dedicated professionals"
                noise
              />
              <GlassCard
                icon={<Trees className="h-6 w-6" />}
                title="Horse Training"
                description="Custom programs for all levels"
                variant="elevated"
                noise
              />
              <GlassCard
                icon={<Trees className="h-6 w-6" />}
                title="Scenic Trails"
                description="60 acres of exploration"
                variant="bordered"
                noise
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3D Scroll-Controlled Animation Demo */}
      <section className="relative py-32 overflow-hidden">
        <ScrollControlled3D
          scrollRange={2000}
          pin
          animations={[
            {
              target: cubeRef,
              property: 'rotation',
              axis: 'y',
              startValue: 0,
              endValue: Math.PI * 2,
            },
            {
              target: cubeRef,
              property: 'rotation',
              axis: 'x',
              startValue: 0,
              endValue: Math.PI,
            },
          ]}
          description="3D cube rotating as you scroll"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <group ref={cubeRef}>
            <mesh castShadow>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="#d4af37" metalness={0.3} roughness={0.4} />
            </mesh>
          </group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#0a0e27" roughness={1} />
          </mesh>
        </ScrollControlled3D>

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <ViewportAnimator animation="fade-in">
              <Display size="3xl" className="mb-4">
                Scroll to Rotate
              </Display>
              <Paragraph size="lg">
                The cube rotates based on your scroll position
              </Paragraph>
            </ViewportAnimator>
          </div>
        </div>
      </section>

      {/* 3D Canvas Demo Section */}
      <section className="relative px-6 py-24 bg-midnight">
        <div className="mx-auto max-w-4xl">
          <ViewportAnimator animation="fade-in">
            <div className="text-center mb-12">
              <Display size="2xl" className="mb-4">
                Interactive 3D Experience
              </Display>
              <Paragraph size="lg" maxWidth="prose">
                Move your cursor over the canvas to see interactive lighting.
              </Paragraph>
            </div>
          </ViewportAnimator>

          <ViewportAnimator animation="slide-up" delay={200}>
            <div className="h-[500px] rounded-xl overflow-hidden border border-gold/20">
              <CanvasWrapper
                cameraPosition={[3, 2, 5]}
                ariaLabel="Interactive 3D cube with lighting"
                shadows
              >
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
                <pointLight position={[-5, 3, -5]} intensity={0.5} color="#d4af37" />

                <mesh castShadow>
                  <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                  <meshStandardMaterial color="#1a3a2e" metalness={0.8} roughness={0.2} />
                </mesh>

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
                  <planeGeometry args={[10, 10]} />
                  <meshStandardMaterial color="#0a0e27" roughness={1} />
                </mesh>
              </CanvasWrapper>
            </div>
          </ViewportAnimator>
        </div>
      </section>

      {/* Features Section with Glass Components */}
      <section className="relative px-6 py-24 md:px-12 lg:px-24 bg-gradient-to-b from-midnight to-hunter">
        <div className="mx-auto max-w-7xl">
          <ViewportAnimator animation="slide-up">
            <div className="text-center mb-16">
              <Heading level={2} className="mb-4">Premium Features</Heading>
              <Paragraph maxWidth="prose">
                Our luxury components with glassmorphism design and adaptive motion.
              </Paragraph>
            </div>
          </ViewportAnimator>

          <GlassCardGrid cols={3} gap="lg">
            <GlassCard
              icon={<Star className="h-6 w-6" />}
              title="Premium Quality"
              description="World-class facilities and services"
              noise
              action={<GlassButton variant="ghost" size="small">Learn More</GlassButton>}
            />
            <GlassCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Luxury Experience"
              description="Exclusive amenities for clients"
              variant="elevated"
              noise
              action={<GlassButton variant="ghost" size="small">Learn More</GlassButton>}
            />
            <GlassCard
              icon={<Trophy className="h-6 w-6" />}
              title="Award Winning"
              description="Excellence in equestrian care"
              variant="bordered"
              noise
              action={<GlassButton variant="ghost" size="small">Learn More</GlassButton>}
            />
          </GlassCardGrid>
        </div>
      </section>

      {/* Motion Control Section */}
      <section className="relative px-6 py-24 bg-midnight">
        <div className="mx-auto max-w-4xl">
          <ViewportAnimator animation="fade-in">
            <GlassPanel variant="dark" className="p-8">
              <div className="text-center mb-6">
                <Display size="2xl" className="mb-4">
                  Animation Controls
                </Display>
                <Paragraph maxWidth="prose">
                  Toggle between full motion and reduced motion preferences.
                </Paragraph>
              </div>

              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <Caption className="mb-2">Current State</Caption>
                  <Text variant={shouldReduceMotion ? "muted" : "gold"} className="text-lg font-semibold">
                    {shouldReduceMotion ? 'Reduced Motion' : 'Full Motion'}
                  </Text>
                </div>

                <GlassButton
                  variant={shouldReduceMotion ? 'outline' : 'primary'}
                  size="large"
                  onClick={toggleMotion}
                  leftIcon={<Sparkles className="h-4 w-4" />}
                >
                  {shouldReduceMotion ? 'Enable' : 'Reduce'} Motion
                </GlassButton>
              </div>

              <div className="mt-8 pt-8 border-t border-gold/10">
                <Paragraph size="sm" maxWidth="prose" className="text-center">
                  Reduced motion disables smooth scrolling, 3D animations, and transitions
                  while maintaining all functionality.
                </Paragraph>
              </div>
            </GlassPanel>
          </ViewportAnimator>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative px-6 py-32 bg-gradient-to-br from-hunter to-midnight overflow-hidden">
        <ParallaxSection speed={0.2} className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold/3 blur-3xl" />
        </ParallaxSection>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <ViewportAnimator animation="slide-up">
            <Display size="3xl" gradient="gold" className="mb-6">
              Ready to Experience Luxury?
            </Display>
            <Paragraph size="lg" maxWidth="prose" className="mb-8">
              Join us at MAM Center and discover the ultimate equestrian experience.
            </Paragraph>
            <GlassButton variant="primary" size="large" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Get Started Today
            </GlassButton>
          </ViewportAnimator>
        </div>
      </section>

      <Footer showNewsletter showMotionToggle />
    </>
  )
}
