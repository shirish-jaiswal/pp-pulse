export const formatDate = (date?: string | null) => {
  if (!date) return "—";
  return new Date(date).toUTCString();
};

export const formatCurrency = (currency: string, amount?: number | null) => {
  return currency.trim() + " " + Number(amount || 0).toLocaleString();
};