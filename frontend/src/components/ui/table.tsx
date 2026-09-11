'use client'

import * as React from 'react'

import { cn } from 'cn'

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateScrollState = React.useCallback(() => {
    const el = containerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  React.useEffect(() => {
    updateScrollState()
    const container = containerRef.current
    const table = tableRef.current
    if (!container || !table) return

    // Table width can change after mount (e.g. data loading in), so watch
    // both the scroll container and the table itself for size changes.
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(container)
    resizeObserver.observe(table)

    return () => resizeObserver.disconnect()
  }, [updateScrollState])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        data-slot="table-container"
        className="relative w-full overflow-x-auto"
        onScroll={updateScrollState}
      >
        <table
          ref={tableRef}
          data-slot="table"
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
      {canScrollLeft && (
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r to-transparent"
        />
      )}
      {canScrollRight && (
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l to-transparent"
        />
      )}
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
}
