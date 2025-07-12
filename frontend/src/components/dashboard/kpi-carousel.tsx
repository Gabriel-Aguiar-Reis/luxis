'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel'
import { KpiCard } from '@/components/dashboard/kpi-card'

import { Skeleton } from '@/components/ui/skeleton'
import Autoplay from 'embla-carousel-autoplay'
import { LucideIcon } from 'lucide-react'

interface KpiCardData {
  title: string
  value: number
  icon: LucideIcon
  description?: string
  prefix?: string
  valueFormatter?: (value: number) => string
}

interface KpiCarouselProps {
  isLoading: boolean
  kpis: KpiCardData[]
  type?: string
}

export function KpiCarousel({ isLoading, kpis }: KpiCarouselProps) {
  return (
    <div className="flex justify-center px-12">
      <Carousel
        className="w-full max-w-5xl"
        opts={{ loop: true, align: 'center' }}
        plugins={[Autoplay({ delay: 6000 })]}
      >
        <CarouselContent>
          {isLoading
            ? Array.from({ length: Math.max(1, kpis.length) }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="w-full max-w-xs justify-center"
                >
                  <Skeleton className="h-44 w-full" />
                </CarouselItem>
              ))
            : kpis.map((kpi, i) => (
                <CarouselItem
                  key={kpi.title}
                  className="w-full max-w-xs justify-center"
                >
                  <KpiCard {...kpi} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
