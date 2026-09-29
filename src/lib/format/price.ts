const COP_FORMATTER = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function formatCopPrice(priceCop: number | null) {
  return priceCop === null ? null : COP_FORMATTER.format(priceCop);
}
