import React from 'react';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import categoryService from 'services/seller/category';
import { DebounceSelect } from 'components/search';
import SearchInput from 'components/search-input';

const Filter = ({ filters, setFilters }) => {
  const { t } = useTranslation();

  const fetchCategories = () => {
    const params = {
      type: 'service',
      perPage: 10,
      page: 1,
    };

    return categoryService.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title,
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
        onChange={(value) => setFilters({ ...filters, category: value })}
      />
    </Space>
  );
};

export default Filter;
