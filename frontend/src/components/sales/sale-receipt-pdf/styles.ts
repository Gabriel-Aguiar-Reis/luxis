import { StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1e293b'
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    gap: 15
  },
  infoCard: {
    width: '47%',
    marginBottom: 10
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 4
  },
  infoValue: {
    fontSize: 11,
    color: '#1e293b'
  },
  infoSubValue: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 15
  },
  installmentsInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4
  },
  installmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  productsSection: {
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e293b'
  },
  productsList: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  productItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3
  },
  productSerial: {
    fontSize: 9,
    color: '#64748b'
  },
  productPrice: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    textAlign: 'center'
  },
  footerText: {
    fontSize: 9,
    color: '#94a3b8',
    marginBottom: 3
  }
})

export default styles
