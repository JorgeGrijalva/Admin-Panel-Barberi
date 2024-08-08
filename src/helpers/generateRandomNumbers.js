export default function generateRandomNumbers(length = 6) {
  const randomNumbers = [];

  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    randomNumbers.push(randomNumber);
  }

  return randomNumbers.join('');
}
