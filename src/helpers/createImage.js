import { IMG_URL } from '../configs/app-global';

export default function createImage(name) {
  const findHTTPS = name?.includes('https');

  return {
    name,
    url: findHTTPS ? name : name,
  };
}
