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

export const formatToUnit = (num: number): string => {
  const absNum = Math.abs(num);
  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(1).replace(/\.0$/, "") + " m";
  } else if (absNum >= 1e6) {
    return (num / 1e6).toFixed(1).replace(/\.0$/, "") + " jt";
  } else if (absNum >= 1e3) {
    return (num / 1e3).toFixed(1).replace(/\.0$/, "") + " rb";
  } else {
    return num.toString();
  }
};

export const terbilang = (angka: number): string => {
  const bilne: string[] = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  if (angka < 12) {
    return bilne[angka];
  } else if (angka < 20) {
    return terbilang(angka - 10) + " Belas";
  } else if (angka < 100) {
    return (
      terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10)
    );
  } else if (angka < 200) {
    return "Seratus " + terbilang(angka - 100);
  } else if (angka < 1000) {
    return (
      terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100)
    );
  } else if (angka < 2000) {
    return "Seribu " + terbilang(angka - 1000);
  } else if (angka < 1000000) {
    return (
      terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000)
    );
  } else if (angka < 1000000000) {
    return (
      terbilang(Math.floor(angka / 1000000)) +
      " Juta " +
      terbilang(angka % 1000000)
    );
  } else if (angka < 1000000000000) {
    return (
      terbilang(Math.floor(angka / 1000000000)) +
      " Milyar " +
      terbilang(angka % 1000000000)
    );
  } else if (angka < 1000000000000000) {
    return (
      terbilang(Math.floor(angka / 1000000000000)) +
      " Trilyun " +
      terbilang(angka % 1000000000000)
    );
  }

  return "";
};
