export default function getTranslationFields(
  languages,
  values,
  field = 'title',
) {
  const list = languages.map((item) => ({
    [item.locale]:
      values[`${field}[${item.locale}]`] === ''
        ? undefined
        : values[`${field}[${item.locale}]`],
  }));
  return Object.assign({}, ...list);
}
