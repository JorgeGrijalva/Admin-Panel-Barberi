export default function getImageFromStock(stock) {
  const stockImage = stock?.extras?.find((item) => item.group.type === 'image');
  if (!!stockImage) {
    return stockImage.value;
  }
  return '';
}
