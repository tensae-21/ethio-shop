export function formatPrice(amount, currency = "USD") {
  const numericAmount = Number(amount ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(numericAmount);
}

export default formatPrice;
