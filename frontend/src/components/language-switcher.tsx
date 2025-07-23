'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { routing } from '@/lib/i18n/routing'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    const currentLocale = pathname.split('/')[1]
    if (routing.locales.includes(currentLocale as any)) {
      const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
      router.push(newPath)
    } else {
      router.push(`/${newLocale}${pathname}`)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => switchLanguage('pt')}
        className={pathname.startsWith('/pt') ? 'bg-primary/10' : ''}
      >
        PT
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => switchLanguage('en')}
        className={pathname.startsWith('/en') ? 'bg-primary/10' : ''}
      >
        EN
      </Button>
    </div>
  )
}
