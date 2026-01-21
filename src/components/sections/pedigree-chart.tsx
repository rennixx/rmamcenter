'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ViewportAnimator } from '@/components/motion/MotionWrapper'
import { Display, Heading, Paragraph, Caption, Text } from '@/components/ui/Typography'
import { cn } from '@/lib/utils'

/**
 * Pedigree tree node data
 */
export interface PedigreeNode {
  id: string
  name: string
  breed?: string
  birthYear?: number
  deathYear?: number
  achievements?: string[]
  color?: string
  gender?: 'stallion' | 'mare'
  imageUrl?: string
  sire?: PedigreeNode
  dam?: PedigreeNode
}

/**
 * Props for PedigreeChart component
 */
export interface PedigreeChartProps {
  /** Root pedigree data (the horse) */
  pedigree: PedigreeNode
  /** Maximum depth to display (1-4 generations) */
  maxDepth?: number
  /** Layout variant */
  variant?: 'tree' | 'horizontal' | 'compact'
  /** Additional class names */
  className?: string
}

/**
 * Individual Pedigree Node Component
 */
function PedigreeNodeCard({
  node,
  depth,
  maxDepth,
  isExpanded,
  onToggle,
}: {
  node: PedigreeNode
  depth: number
  maxDepth: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const hasChildren = depth < maxDepth && (node.sire || node.dam)
  const canExpand = hasChildren && depth < maxDepth

  return (
    <div className="relative">
      {/* Node Card */}
      <GlassPanel
        variant={depth === 0 ? 'elevated' : depth === 1 ? 'bordered' : 'dark'}
        className={cn(
          'p-4 transition-all duration-300 hover:scale-105',
          depth === 0 && 'border-gold/30',
          depth === 1 && 'border-gold/20',
          depth > 1 && 'border-gold/10'
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Gender Indicator */}
            {node.gender && (
              <Caption className={cn(
                'text-xs uppercase tracking-wider mb-1',
                node.gender === 'stallion' ? 'text-blue-400' : 'text-pink-400'
              )}>
                {node.gender === 'stallion' ? 'Stallion' : 'Mare'}
              </Caption>
            )}

            {/* Name */}
            <Heading
              level={depth === 0 ? 4 : depth === 1 ? 5 : 6}
              className="mb-1"
            >
              {node.name}
            </Heading>

            {/* Details */}
            {node.breed && (
              <Text variant="muted" size="sm" className="mb-1">
                {node.breed}
              </Text>
            )}

            {node.color && (
              <Text variant="muted" size="sm">
                {node.color}
              </Text>
            )}

            {/* Years */}
            {(node.birthYear || node.deathYear) && (
              <Caption className="mt-2 text-gold/60">
                {node.birthYear || '?'}
                {node.deathYear && ` - ${node.deathYear}`}
                {!node.deathYear && ' - Present'}
              </Caption>
            )}

            {/* Achievements (only show for top levels) */}
            {depth <= 1 && node.achievements && node.achievements.length > 0 && (
              <div className="mt-2 space-y-1">
                {node.achievements.slice(0, 2).map((achievement, index) => (
                  <Text key={index} size="xs" variant="muted" className="flex items-center gap-1">
                    <span className="text-gold">•</span>
                    {achievement}
                  </Text>
                ))}
                {node.achievements.length > 2 && (
                  <Text size="xs" variant="gold">
                    +{node.achievements.length - 2} more
                  </Text>
                )}
              </div>
            )}
          </div>

          {/* Expand/Collapse Button */}
          {canExpand && (
            <button
              onClick={onToggle}
              className="flex-shrink-0 p-1 rounded hover:bg-gold/10 transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gold" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gold" />
              )}
            </button>
          )}
        </div>
      </GlassPanel>
    </div>
  )
}

/**
 * Tree Layout Component
 */
function TreeLayout({
  node,
  depth = 0,
  maxDepth = 4,
}: {
  node: PedigreeNode
  depth?: number
  maxDepth?: number
}) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([node.id]))

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const isExpanded = expandedNodes.has(node.id)
  const showChildren = isExpanded && depth < maxDepth

  return (
    <div className={cn('flex flex-col', depth > 0 && 'ml-8')}>
      {/* Current Node */}
      <div className="mb-4">
        <PedigreeNodeCard
          node={node}
          depth={depth}
          maxDepth={maxDepth}
          isExpanded={isExpanded}
          onToggle={() => toggleNode(node.id)}
        />
      </div>

      {/* Children */}
      {showChildren && (
        <div className="flex gap-8 pl-4 border-l-2 border-gold/20">
          {/* Sire (Father) */}
          {node.sire && (
            <div className="flex-1">
              <div className="mb-2">
                <Caption className="text-blue-400 uppercase tracking-wider text-xs">
                  Sire
                </Caption>
              </div>
              <TreeLayout node={node.sire} depth={depth + 1} maxDepth={maxDepth} />
            </div>
          )}

          {/* Dam (Mother) */}
          {node.dam && (
            <div className="flex-1">
              <div className="mb-2">
                <Caption className="text-pink-400 uppercase tracking-wider text-xs">
                  Dam
                </Caption>
              </div>
              <TreeLayout node={node.dam} depth={depth + 1} maxDepth={maxDepth} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Horizontal Layout Component
 */
function HorizontalLayout({
  node,
  depth = 0,
  maxDepth = 4,
}: {
  node: PedigreeNode
  depth?: number
  maxDepth?: number
}) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([node.id]))

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const isExpanded = expandedNodes.has(node.id)
  const showChildren = isExpanded && depth < maxDepth

  return (
    <div className="flex items-start gap-6">
      {/* Current Node */}
      <div className="flex-shrink-0">
        <PedigreeNodeCard
          node={node}
          depth={depth}
          maxDepth={maxDepth}
          isExpanded={isExpanded}
          onToggle={() => toggleNode(node.id)}
        />
      </div>

      {/* Children */}
      {showChildren && (
        <div className="flex-1 space-y-4 border-t-2 border-gold/20 pt-4">
          {/* Sire (Father) */}
          {node.sire && (
            <div>
              <Caption className="text-blue-400 uppercase tracking-wider text-xs mb-2">
                Sire
              </Caption>
              <HorizontalLayout node={node.sire} depth={depth + 1} maxDepth={maxDepth} />
            </div>
          )}

          {/* Dam (Mother) */}
          {node.dam && (
            <div>
              <Caption className="text-pink-400 uppercase tracking-wider text-xs mb-2">
                Dam
              </Caption>
              <HorizontalLayout node={node.dam} depth={depth + 1} maxDepth={maxDepth} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Compact Table Layout Component
 */
function CompactLayout({
  pedigree,
  maxDepth = 4,
}: {
  pedigree: PedigreeNode
  maxDepth?: number
}) {
  // Flatten pedigree into generations
  const generations: PedigreeNode[][] = [[pedigree]]

  for (let i = 1; i < maxDepth; i++) {
    const prevGen = generations[i - 1]
    const currentGen: PedigreeNode[] = []

    prevGen.forEach((node) => {
      if (node.sire) currentGen.push(node.sire)
      if (node.dam) currentGen.push(node.dam)
    })

    if (currentGen.length === 0) break
    generations.push(currentGen)
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {generations.map((_, index) => (
            <div key={index} className="text-center">
              <Caption className="text-gold uppercase tracking-wider">
                {index === 0 ? 'Subject' : `Generation ${index}`}
              </Caption>
            </div>
          ))}
        </div>

        {/* Rows */}
        {generations[0].map((rootNode, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4">
            {generations.map((generation, colIndex) => {
              const nodeIndex = Math.floor(rowIndex / Math.pow(2, colIndex))
              const node = generation[nodeIndex]

              if (!node) return <div key={colIndex} />

              return (
                <GlassPanel
                  key={colIndex}
                  variant={colIndex === 0 ? 'elevated' : 'dark'}
                  className="p-3"
                >
                  <Heading level={6} className="mb-1">
                    {node.name}
                  </Heading>
                  {node.breed && (
                    <Text size="xs" variant="muted">
                      {node.breed}
                    </Text>
                  )}
                  {node.gender && (
                    <Caption
                      className={cn(
                        'text-xs mt-1',
                        node.gender === 'stallion' ? 'text-blue-400' : 'text-pink-400'
                      )}
                    >
                      {node.gender === 'stallion' ? 'Sire' : 'Dam'}
                    </Caption>
                  )}
                </GlassPanel>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Pedigree Chart Section
 *
 * Interactive pedigree tree visualization with multiple layout options.
 * Displays ancestral lineage with expandable nodes and detailed information.
 *
 * @example
 * ```tsx
 * <PedigreeChart
 *   pedigree={horsePedigreeData}
 *   maxDepth={4}
 *   variant="tree"
 * />
 * ```
 */
export function PedigreeChart({
  pedigree,
  maxDepth = 4,
  variant = 'tree',
  className,
}: PedigreeChartProps) {
  return (
    <section className={`px-6 py-16 bg-midnight ${className || ''}`}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <ViewportAnimator animation="fade-in">
          <div className="text-center mb-12">
            <Display size="2xl" className="mb-4">
              Pedigree
            </Display>
            <Paragraph size="lg" maxWidth="prose">
              Explore the ancestral lineage and heritage of this exceptional horse
            </Paragraph>
          </div>
        </ViewportAnimator>

        {/* Legend */}
        <ScrollReveal delay={100}>
          <GlassPanel variant="dark" className="p-4 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-400/20 border border-blue-400" />
                <Text size="sm">Sire (Father)</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-pink-400/20 border border-pink-400" />
                <Text size="sm">Dam (Mother)</Text>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gold" />
                <Text size="sm">Click arrows to expand/collapse</Text>
              </div>
            </div>
          </GlassPanel>
        </ScrollReveal>

        {/* Pedigree Content */}
        <ScrollReveal delay={200}>
          {variant === 'tree' && (
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <TreeLayout node={pedigree} maxDepth={maxDepth} />
              </div>
            </div>
          )}

          {variant === 'horizontal' && (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-max">
                <HorizontalLayout node={pedigree} maxDepth={maxDepth} />
              </div>
            </div>
          )}

          {variant === 'compact' && (
            <CompactLayout pedigree={pedigree} maxDepth={maxDepth} />
          )}
        </ScrollReveal>

        {/* Info Panel */}
        <ScrollReveal delay={400}>
          <GlassPanel variant="elevated" className="mt-8 p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <Heading level={5} className="mb-2">
                  Understanding Pedigree
                </Heading>
                <Paragraph size="base" maxWidth="prose">
                  A pedigree shows the ancestral lineage of a horse, typically spanning 4-5 generations.
                  The sire (father) appears on the top or left, while the dam (mother) appears on the
                  bottom or right. This lineage helps predict traits, abilities, and genetic characteristics.
                </Paragraph>
              </div>
            </div>
          </GlassPanel>
        </ScrollReveal>
      </div>
    </section>
  )
}
