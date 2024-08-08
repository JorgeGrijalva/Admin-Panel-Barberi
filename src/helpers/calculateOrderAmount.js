export default function calculateOrderAmount(data) {
  if (!data) return 0;
  let price = data.price;
  let totalDeliveryFee = data.details.reduce(
    (total, item) => (total += item.delivery_fee),
    0
  );
  let totalPrice = price + totalDeliveryFee;
  return totalPrice;
}
