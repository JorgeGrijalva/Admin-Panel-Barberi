import axios from 'axios';
import { MAP_API_KEY } from 'configs/app-global';

export default async function getAddressFromLocation(
  location,
  key = MAP_API_KEY
) {
  let params = {
    latlng: `${location?.lat},${location?.lng}`,
    key,
  };
  return axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json`, { params })
    .then(({ data }) => data.results[0]?.formatted_address)
    .catch((error) => {
      return 'not found';
    });
}
