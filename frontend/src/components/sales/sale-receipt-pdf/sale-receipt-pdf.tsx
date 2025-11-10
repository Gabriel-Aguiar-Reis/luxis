'use client'

import React from 'react'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GetOneSaleResponse } from '@/hooks/use-sales'
import { PhoneNumberUtil } from 'google-libphonenumber'
import styles from '@/components/sales/sale-receipt-pdf/styles'
import { PaymentMethod, SaleStatus } from '@/lib/api-types'

interface SaleReceiptPDFProps {
  sale: GetOneSaleResponse
  phoneUtil: PhoneNumberUtil
}

export function SaleReceiptPDF({ sale, phoneUtil }: SaleReceiptPDFProps) {
  const paymentMethodLabels: Record<PaymentMethod, string> = {
    CASH: 'Dinheiro',
    PIX: 'PIX',
    DEBIT: 'Débito',
    CREDIT: 'Crédito',
    EXCHANGE: 'Troca'
  }

  const statusLabels: Record<SaleStatus, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    INSTALLMENTS_PENDING: 'Parcelas Pendentes',
    INSTALLMENTS_PAID: 'Venda Paga',
    INSTALLMENTS_OVERDUE: 'Parcelas Atrasadas'
  }

  // Extrai valores corretamente
  const totalAmount =
    typeof sale.totalAmount.value === 'string'
      ? parseFloat(sale.totalAmount.value)
      : sale.totalAmount.value

  const numberInstallments = sale.numberInstallments?.value || 1
  const installmentsInterval = sale.installmentsInterval?.value || 0

  try {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.title}>COMPROVANTE DE VENDA</Text>
            <Text style={styles.subtitle}>Luxis</Text>
            <Text style={styles.subtitle}>ID: {sale.id}</Text>
          </View>
          {/* Grid de Informações - 2 colunas */}
          <View style={styles.infoGrid}>
            {/* Data da Venda */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Data da Venda</Text>
              <Text style={styles.infoValue}>
                {format(new Date(sale.saleDate), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR
                })}
              </Text>
            </View>

            {/* Cliente */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Cliente</Text>
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

            {/* Método de Pagamento */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Método de Pagamento</Text>
              <Text style={styles.infoValue}>
                {paymentMethodLabels[sale.paymentMethod]}
              </Text>
            </View>

            {/* Total de Produtos */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Total de Produtos</Text>
              <Text style={styles.infoValue}>
                {sale.products.length}{' '}
                {sale.products.length === 1 ? 'item' : 'itens'}
              </Text>
            </View>
          </View>

          {/* Separador */}
          <View style={styles.separator} />

          {/* Parcelas (se houver) */}
          {numberInstallments > 1 && (
            <>
              <View style={styles.installmentsInfo}>
                <View style={styles.installmentRow}>
                  <Text style={styles.infoLabel}>Parcelas:</Text>
                  <Text style={styles.infoValue}>{numberInstallments}x</Text>
                </View>
                {installmentsInterval > 0 && (
                  <View style={styles.installmentRow}>
                    <Text style={styles.infoLabel}>Intervalo:</Text>
                    <Text style={styles.infoValue}>
                      {installmentsInterval} dias
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.separator} />
            </>
          )}

          {/* Lista de Produtos */}
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Produtos</Text>
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
                        S/N: {product.serialNumber.value}
                      </Text>
                    </View>
                    <Text style={styles.productPrice}>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(salePrice)}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>

          {/* Separador */}
          <View style={styles.separator} />

          {/* Total */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total da Venda</Text>
            <Text style={styles.totalValue}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalAmount)}
            </Text>
          </View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Documento gerado em{' '}
              {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
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
          <Text>Erro ao gerar PDF</Text>
        </Page>
      </Document>
    )
  }
}
