export default function numberToPrice(
  number = 0,
  symbol = '$',
  position = 'after',
) {
  const price = Number(number)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');

  return position === 'after' ? `${price} ${symbol}` : `${symbol} ${price}`;
}
