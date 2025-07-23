import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'
import { getMessages } from '@/lib/i18n/getMessages'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  const { locale } = resolvedParams
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages(locale)

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
