import { IMG_URL } from '../configs/app-global';
import avatar from '../assets/images/1.png';

export default function getAvatar(url) {
  if (!url) {
    return avatar;
  }
  return IMG_URL + url;
}
