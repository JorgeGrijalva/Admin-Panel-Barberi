export default function hideNumber(number) {
  const phoneNumber = `${number}`;
  // Replace all characters between the first and last with '*'
  const hiddenPart = '*'.repeat(phoneNumber.length - 2);

  // Extract the first and last characters
  const firstChar = phoneNumber?.[0];
  const lastChar = phoneNumber?.[phoneNumber?.length - 1];

  return firstChar + hiddenPart + lastChar;
}
