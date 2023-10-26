export const currency = (
  amount: number,
  currency = "IDR",
  locale = "id-ID"
) => {
  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);

  return formattedCurrency;
};

export const formatCurrencyValue = (value: string) => {
  const formattedValue = parseFloat(value.replace(/[$.]/g, "")).toFixed(0);
  return isNaN(parseFloat(formattedValue)) ? "NaN" : formattedValue;
};
