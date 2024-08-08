export function calculateTotalWithDeliveryPrice(deliveries, total) {

  let totalPrice = total;


  return totalPrice;
}
export function getCurrentShop(shop, allShops) {
  if (!allShops.length || !shop) {
    return {};
  }
  return allShops.find((item) => item.id === shop.value);
}
