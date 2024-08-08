export function removeDublicate(array) {
  const ids = array?.map((o) => o.id);
  const filtered = array?.filter(
    ({ id }, index) => !ids.includes(id, index + 1)
  );
  return filtered;
}
