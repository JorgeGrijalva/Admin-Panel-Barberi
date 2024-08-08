import axios from 'axios';
import { MAP_API_KEY } from 'configs/app-global';

export default async function getAddress(
  address,
  key = MAP_API_KEY
) {
  let params = {
    address,
    key,
  };
  return axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json`, { params })
    .then(({ data }) => data.results[0])
    .catch((error) => {
      return 'not found';
    });
}
