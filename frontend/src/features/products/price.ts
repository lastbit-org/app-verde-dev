export function salePrice(price: number, discount = 0) {
  return Number((price * (1 - discount / 100)).toFixed(2))
}
