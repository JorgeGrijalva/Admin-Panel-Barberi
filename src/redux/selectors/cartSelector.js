export function getCartItems(cart) {
  return cart.cartItems.filter((item) => item.bag_id === cart.currentBag);
}
export function calculateTotalCoupon(cart) {
  return cart.coupons.reduce((total, item) => (total += item.price), 0);
}
export function getCartData(cart) {
  return cart.data.find((item) => item.bag_id === cart.currentBag);
}
