import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(amount);
};

export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (fromCurrency === "CLP" && toCurrency === "USD") {
    return amount / 952;
  } else if (fromCurrency === "USD" && toCurrency === "CLP") {
    return amount * 952;
  }

  throw new Error(
    `No se ha implementado conversión de ${fromCurrency} a ${toCurrency}`
  );
}
