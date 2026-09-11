'use client'

import { useEffect, useState } from 'react'

const isMockApiEnabled =
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PUBLIC_LUXIS_MOCK_API === 'true'

let workerStartPromise: Promise<unknown> | undefined

function startMockWorker() {
  workerStartPromise ??= import('@/mocks/browser').then(({ worker }) =>
    worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' }
    })
  )

  return workerStartPromise
}

export function MockApiProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(!isMockApiEnabled)

  useEffect(() => {
    if (!isMockApiEnabled) {
      return
    }

    let isMounted = true

    startMockWorker().finally(() => {
      if (isMounted) {
        setIsReady(true)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
