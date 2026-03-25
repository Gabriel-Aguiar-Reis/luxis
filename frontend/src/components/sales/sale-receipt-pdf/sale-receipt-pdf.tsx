'use client'

import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'
import { GetOneSaleResponse } from '@/hooks/use-sales'
import { PhoneNumberUtil } from 'google-libphonenumber'
import styles from '@/components/sales/sale-receipt-pdf/styles'
import { PaymentMethod } from '@/lib/api-types'

type SaleReceiptPDFLabels = {
  title: string
  saleDate: string
  customer: string
  paymentMethod: string
  totalProducts: string
  item: string
  items: string
  installments: string
  interval: string
  days: string
  products: string
  serialNumber: string
  totalSale: string
  generatedAt: string
  at: string
  renderError: string
  paymentMethods: Record<PaymentMethod, string>
}

interface SaleReceiptPDFProps {
  sale: GetOneSaleResponse
  phoneUtil: PhoneNumberUtil
  locale: string
  labels: SaleReceiptPDFLabels
}

export function SaleReceiptPDF({
  sale,
  phoneUtil,
  locale,
  labels
}: SaleReceiptPDFProps) {
  const totalAmount =
    typeof sale.totalAmount.value === 'string'
      ? parseFloat(sale.totalAmount.value)
      : sale.totalAmount.value

  const numberInstallments = sale.numberInstallments?.value || 1
  const installmentsInterval = sale.installmentsInterval?.value || 0
  const currentDateLocale = locale === 'en' ? enUS : ptBR
  const currencyFormatter = new Intl.NumberFormat(
    locale === 'en' ? 'en-US' : 'pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  )

  try {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>{labels.title}</Text>
            <Text style={styles.subtitle}>Luxis</Text>
            <Text style={styles.subtitle}>ID: {sale.id}</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>{labels.saleDate}</Text>
              <Text style={styles.infoValue}>
                {format(new Date(sale.saleDate), 'PPP', {
                  locale: currentDateLocale
                })}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>{labels.customer}</Text>
              <Text style={styles.infoValue}>{sale.customerName.value}</Text>
              {sale.customerPhone && sale.customerPhone.value && (
                <Text style={styles.infoSubValue}>
                  {phoneUtil.formatInOriginalFormat(
                    phoneUtil.parseAndKeepRawInput(
                      sale.customerPhone.value,
                      'BR'
                    )
                  )}
                </Text>
              )}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>{labels.paymentMethod}</Text>
              <Text style={styles.infoValue}>
                {labels.paymentMethods[sale.paymentMethod]}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>{labels.totalProducts}</Text>
              <Text style={styles.infoValue}>
                {sale.products.length}{' '}
                {sale.products.length === 1 ? labels.item : labels.items}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          {numberInstallments > 1 && (
            <>
              <View style={styles.installmentsInfo}>
                <View style={styles.installmentRow}>
                  <Text style={styles.infoLabel}>{labels.installments}:</Text>
                  <Text style={styles.infoValue}>{numberInstallments}x</Text>
                </View>
                {installmentsInterval > 0 && (
                  <View style={styles.installmentRow}>
                    <Text style={styles.infoLabel}>{labels.interval}:</Text>
                    <Text style={styles.infoValue}>
                      {installmentsInterval} {labels.days}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.separator} />
            </>
          )}

          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>{labels.products}</Text>
            <View style={styles.productsList}>
              {sale.products.map((product, index) => {
                const salePrice =
                  typeof product.salePrice.value === 'string'
                    ? parseFloat(product.salePrice.value)
                    : product.salePrice.value

                const isLastItem = index === sale.products.length - 1

                return (
                  <View
                    key={index}
                    style={
                      isLastItem
                        ? styles.productItem
                        : [styles.productItem, styles.productItemBorder]
                    }
                  >
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>
                        {product.modelName.value}
                      </Text>
                      <Text style={styles.productSerial}>
                        {labels.serialNumber}: {product.serialNumber.value}
                      </Text>
                    </View>
                    <Text style={styles.productPrice}>
                      {currencyFormatter.format(salePrice)}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>{labels.totalSale}</Text>
            <Text style={styles.totalValue}>
              {currencyFormatter.format(totalAmount)}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {labels.generatedAt}{' '}
              {format(new Date(), 'P', { locale: currentDateLocale })}{' '}
              {labels.at}{' '}
              {format(new Date(), 'HH:mm', { locale: currentDateLocale })}
            </Text>
            <Text style={styles.footerText}>Luxis</Text>
          </View>
        </Page>
      </Document>
    )
  } catch (error) {
    console.error('Error rendering PDF:', error)
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>{labels.renderError}</Text>
        </Page>
      </Document>
    )
  }
}
