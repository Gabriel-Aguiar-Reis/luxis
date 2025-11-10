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
    <div className="flex justify-center px-4 sm:px-8 md:px-12">
      <Carousel
        className="w-full max-w-5xl"
        opts={{ loop: true, align: 'center' }}
        plugins={[Autoplay({ delay: 6000 })]}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {isLoading
            ? Array.from({ length: Math.max(1, kpis.length) }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="basis-full pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4"
                >
                  <Skeleton className="h-44 w-full" />
                </CarouselItem>
              ))
            : kpis.map((kpi, i) => (
                <CarouselItem
                  key={kpi.title}
                  className="basis-full pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4"
                >
                  <KpiCard {...kpi} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  )
}
