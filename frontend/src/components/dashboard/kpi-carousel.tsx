'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots
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
    <div className="w-full">
      <Carousel
        className="mx-auto w-[calc(100%-4rem)] max-w-6xl md:w-[calc(100%-6rem)] md:max-w-264"
        opts={{ loop: true, align: 'center' }}
        plugins={[Autoplay({ delay: 6000 })]}
      >
        <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
          {isLoading
            ? Array.from({ length: Math.max(1, kpis.length) }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="basis-full pl-2 sm:basis-1/2 sm:pl-3 md:basis-1/3 md:pl-4 2xl:basis-1/4"
                >
                  <Skeleton className="h-36 w-full sm:h-40 md:h-44" />
                </CarouselItem>
              ))
            : kpis.map((kpi, i) => (
                <CarouselItem
                  key={kpi.title}
                  className="basis-full pl-2 sm:basis-1/2 sm:pl-3 md:basis-1/3 md:pl-4 2xl:basis-1/4"
                >
                  <KpiCard {...kpi} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="z-10 -left-8 bg-background/90 md:-left-12" />
        <CarouselNext className="z-10 -right-8 bg-background/90 md:-right-12" />
        {!isLoading && <CarouselDots />}
      </Carousel>
    </div>
  )
}
