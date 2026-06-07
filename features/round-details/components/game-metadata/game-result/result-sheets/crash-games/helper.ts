export const formatDate = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toUTCString();
};

export const formatCurrency = (currency: string, amount?: number | null | string) => {
  const parsedAmount = Number(amount);
  const safeAmount = isNaN(parsedAmount) ? 0 : Math.max(0, parsedAmount);
  return `${currency.trim()} ${safeAmount.toLocaleString()}`;
};