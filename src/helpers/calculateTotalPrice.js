export default function calculateTotalPrice(shop, deliveries = []) {
  let deliveryFee = 0;
  const delivery = deliveries.find((item) => item.shop_id === shop.id);
  if (delivery?.delivery_fee) deliveryFee = delivery.delivery_fee;

  const totalPrice = shop.products.reduce(
    (total, item) => (total += item.total_price),
    0
  );
  const productTax = shop.products.reduce(
    (total, item) => (total += item.tax),
    0
  );
  const shopTax = shop.products.reduce(
    (total, item) => (total += item.shop_tax),
    0
  );
  const total = totalPrice + shopTax + deliveryFee;
  const orderTax = shopTax + productTax;

  return {
    productTax,
    shopTax,
    total,
    deliveryFee,
    orderTax,
  };
}
