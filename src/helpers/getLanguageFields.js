export default function getLanguageFields(languages, data, fields = ['title']) {
  if (!data?.translations) {
    return {};
  }
  const { translations } = data;
  const getTranslations = (item, field) => {
    const findItem = translations?.find((el) => el?.locale === item?.locale);
    if (findItem) {
      return findItem;
    } else {
      return {
        [field]: '',
      };
    }
  };
  const result = languages.flatMap((item) =>
    fields.flatMap((field) => ({
      [`${field}[${item?.locale}]`]: getTranslations(item, field)[field],
    })),
  );

  return Object.assign({}, ...result);
}
