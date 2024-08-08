import placeholder from '../assets/images/placeholder.jpeg';

export default function getImage(url) {
  if (!url) {
    return placeholder;
  }
  return url;
}
