export default function hideEmail(email) {
  let skipFirstChars = 1;
  let firstThreeChar = email?.slice(0, skipFirstChars);

  let domainIndexStart = email?.lastIndexOf('@');
  let maskedEmail = email?.slice(skipFirstChars, domainIndexStart - 1);
  maskedEmail = maskedEmail?.replace(/./g, '*');
  let domainPlusPreviousChar = email?.slice(domainIndexStart - 1, email.length);

  return firstThreeChar?.concat(maskedEmail)?.concat(domainPlusPreviousChar);
}
