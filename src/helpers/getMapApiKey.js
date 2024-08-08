import { store } from 'redux/store';

const getMapApiKey = () => {
  const envMapApiKey = process.env.MAP_API_KEY;
  const { google_map_key } = store.getState()?.globalSettings?.settings;

  return google_map_key || envMapApiKey;
};

export default getMapApiKey;
