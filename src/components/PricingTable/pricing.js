// Pure pricing math, shared by the component and its tests.
export function annualMonthlyEquivalent(monthly, discountPct) {
  const d = Math.min(90, Math.max(0, Number(discountPct) || 0));
  return Math.round(Number(monthly) * (1 - d / 100) * 100) / 100;
}

export function yearlySavings(monthly, discountPct) {
  return Math.round((Number(monthly) - annualMonthlyEquivalent(monthly, discountPct)) * 12 * 100) / 100;
}

export function formatPrice(amount, currency = 'USD', locale = 'en-US') {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '—';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
}
