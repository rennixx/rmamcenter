'use client'

import React, { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, Filter } from 'lucide-react'
import { GlassCard, GlassCardGrid } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ViewportAnimator } from '@/components/motion/MotionWrapper'
import { Display, Paragraph, Heading, Label, Text } from '@/components/ui/Typography'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassPanel } from '@/components/ui/GlassPanel'

/**
 * Horse data type
 */
export interface Horse {
  id: string
  name: string
  breed: string
  age: number
  gender: 'Male' | 'Female'
  color: string
  height: string
  discipline: string[]
  price: number
  image: string
  description: string
  competitionRecord?: string[]
}

/**
 * Filter options
 */
export interface FilterOptions {
  breed: string[]
  discipline: string[]
  minAge: number
  maxAge: number
  minPrice: number
  maxPrice: number
  searchQuery: string
  sortBy: 'name' | 'price' | 'age' | 'recent'
}

/**
 * Props for HorsePortfolio component
 */
export interface HorsePortfolioProps {
  /** Horses to display */
  horses: Horse[]
  /** Breeds available for filtering */
  breeds?: string[]
  /** Disciplines available for filtering */
  disciplines?: string[]
  /** Age range in years */
  ageRange?: [number, number]
  /** Price range */
  priceRange?: [number, number]
  /** Horse card click handler */
  onHorseClick?: (horse: Horse) => void
  /** Additional class names */
  className?: string
}

/**
 * Filter Controls Component
 */
function FilterControls({
  filters,
  onFilterChange,
  breeds,
  disciplines,
}: {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  breeds: string[]
  disciplines: string[]
}) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <Heading level={3}>Available Horses</Heading>

        <GlassButton
          variant="outline"
          size="small"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<Filter className="h-4 w-4" />}
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </GlassButton>
      </div>

      {showFilters && (
        <GlassPanel variant="elevated" className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <Label className="mb-2">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                <input
                  type="text"
                  placeholder="Search horses..."
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-midnight/50 border border-gold/20 rounded-lg text-white placeholder:text-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            {/* Breed Filter */}
            <div>
              <Label className="mb-2">Breed</Label>
              <select
                value={filters.breed[0] || 'all'}
                onChange={(e) => {
                  const value = e.target.value
                  onFilterChange({ ...filters, breed: value === 'all' ? [] : [value] })
                }}
                className="w-full px-4 py-2 bg-midnight/50 border border-gold/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="all">All Breeds</option>
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
            </div>

            {/* Discipline Filter */}
            <div>
              <Label className="mb-2">Discipline</Label>
              <select
                value={filters.discipline[0] || 'all'}
                onChange={(e) => {
                  const value = e.target.value
                  onFilterChange({ ...filters, discipline: value === 'all' ? [] : [value] })
                }}
                className="w-full px-4 py-2 bg-midnight/50 border border-gold/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="all">All Disciplines</option>
                {disciplines.map((discipline) => (
                  <option key={discipline} value={discipline}>{discipline}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <Label className="mb-2">Sort By</Label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
                className="w-full px-4 py-2 bg-midnight/50 border border-gold/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
                <option value="age">Age (Young to Old)</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="mt-4">
            <Label className="mb-2">
              Price Range: ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
            </Label>
            <input
              type="range"
              min={0}
              max={100000}
              step={5000}
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) })}
              className="w-full mb-2 accent-gold"
            />
            <input
              type="range"
              min={0}
              max={100000}
              step={5000}
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-gold"
            />
          </div>
        </GlassPanel>
      )}
    </div>
  )
}

/**
 * Horse Portfolio Section
 *
 * Grid-based horse portfolio with filtering, sorting, and search.
 * Displays glass cards with scroll reveal animations.
 *
 * @example
 * ```tsx
 * <HorsePortfolio
 *   horses={horses}
 *   breeds={['Arabian', 'Thoroughbred']}
 *   disciplines={['Dressage', 'Show Jumping']}
 *   onHorseClick={(horse) => navigateToHorsePage(horse.id)}
 * />
 * ```
 */
export function HorsePortfolio({
  horses,
  breeds = [],
  disciplines = [],
  ageRange = [0, 30],
  priceRange = [0, 100000],
  onHorseClick,
  className,
}: HorsePortfolioProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    breed: [],
    discipline: [],
    minAge: ageRange[0],
    maxAge: ageRange[1],
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    searchQuery: '',
    sortBy: 'name',
  })

  // Filter and sort horses
  const filteredHorses = useMemo(() => {
    let filtered = [...horses]

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter((horse) =>
        horse.name.toLowerCase().includes(query) ||
        horse.breed.toLowerCase().includes(query) ||
        horse.discipline.some((d) => d.toLowerCase().includes(query))
      )
    }

    // Apply breed filter
    if (filters.breed.length > 0) {
      filtered = filtered.filter((horse) => filters.breed.includes(horse.breed))
    }

    // Apply discipline filter
    if (filters.discipline.length > 0) {
      filtered = filtered.filter((horse) =>
        horse.discipline.some((d) => filters.discipline.includes(d))
      )
    }

    // Apply age range filter
    filtered = filtered.filter((horse) => horse.age >= filters.minAge && horse.age <= filters.maxAge)

    // Apply price range filter
    filtered = filtered.filter((horse) => horse.price >= filters.minPrice && horse.price <= filters.maxPrice)

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.price - b.price
        case 'age':
          return a.age - b.age
        case 'recent':
          return 0 // Placeholder - would need actual date field
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [horses, filters])

  return (
    <section className={`px-6 py-24 bg-midnight ${className || ''}`}>
      <FilterControls
        filters={filters}
        onFilterChange={setFilters}
        breeds={breeds}
        disciplines={disciplines}
      />

      {/* Results count */}
      <ViewportAnimator animation="fade-in">
        <Paragraph className="mb-6">
          Showing {filteredHorses.length} of {horses.length} horses
        </Paragraph>
      </ViewportAnimator>

      {/* Horse Grid */}
      {filteredHorses.length > 0 ? (
        <ScrollReveal stagger={100} threshold={0.1}>
          <GlassCardGrid cols={3} gap="lg">
            {filteredHorses.map((horse) => (
              <GlassCard
                key={horse.id}
                title={horse.name}
                description={`${horse.breed} • ${horse.age} years • ${horse.gender}`}
                variant="elevated"
                onClick={() => onHorseClick?.(horse)}
              >
                {/* Image */}
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 -mt-10 -mx-10">
                  <img
                    src={horse.image}
                    alt={horse.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Metadata */}
                <div className="space-y-1 mb-4">
                  <Text size="sm">Height: {horse.height}</Text>
                  <Text size="sm">Discipline: {horse.discipline.join(', ')}</Text>
                </div>
              </GlassCard>
            ))}
          </GlassCardGrid>
        </ScrollReveal>
      ) : (
        <ViewportAnimator animation="fade-in">
          <GlassPanel variant="dark" className="p-12 text-center">
            <Paragraph size="lg">No horses match your filters. Try adjusting your criteria.</Paragraph>
            <GlassButton
              variant="outline"
              className="mt-4"
              onClick={() => setFilters({
                breed: [],
                discipline: [],
                minAge: ageRange[0],
                maxAge: ageRange[1],
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                searchQuery: '',
                sortBy: 'name',
              })}
            >
              Clear Filters
            </GlassButton>
          </GlassPanel>
        </ViewportAnimator>
      )}
    </section>
  )
}
