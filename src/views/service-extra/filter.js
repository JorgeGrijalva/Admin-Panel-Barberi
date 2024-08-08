import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import SearchInput from 'components/search-input';
import { DebounceSelect } from 'components/search';
import shopService from 'services/shop';

const Filter = ({ filters, setFilters }) => {
  const { t } = useTranslation();

  const fetchCategories = (search) => {
    const params = {
      perPage: 10,
      page: 1,
      search: !!search?.length ? search : undefined,
    };

    return shopService.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title || t('N/A'),
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  return (
    <Space wrap>
      <SearchInput
        placeholder={t('search')}
        className={'w-200px'}
        onChange={(value) =>
          setFilters({ ...filters, search: value?.target?.value })
        }
      />
      <DebounceSelect
        fetchOptions={fetchCategories}
        className={'w-200px'}
        placeholder={t('select.category')}
        onChange={(value) => setFilters({ ...filters, shop: value })}
      />
    </Space>
  );
};

export default Filter;
