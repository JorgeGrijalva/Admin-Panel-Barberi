export default function getDefaultLocation(settings) {
  if (!settings?.location) {
    return {
      lat: 47.4143302506288,
      lng: 8.532059477976883,
    };
  }
  const location = settings?.location?.split(', ');
  return {
    lat: Number(location?.[0]),
    lng: Number(location?.[1]),
  };
}
