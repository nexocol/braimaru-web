export function parseCopInput(value: string) {
  const normalized = value.trim();
  if (!normalized) return null;

  const digits = normalized.replace(/\D/g, '');
  if (!digits) return null;

  const parsed = Number(digits);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

export function priceToInput(value: number | null) {
  return value === null ? '' : new Intl.NumberFormat('es-CO').format(value);
}
