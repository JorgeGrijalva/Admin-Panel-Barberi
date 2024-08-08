import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Space } from 'antd';
import React from 'react';
import { setMenuData } from 'redux/slices/menu';
import { DebounceSelect } from 'components/search';
import servicesService from 'services/seller/services';
import userService from 'services/seller/user';

const Filter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

  const fetchServices = (search) => {
    const params = {
      perPage: 10,
      page: 1,
      search,
    };

    return servicesService.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const fetchUsers = (search) => {
    const params = {
      parPage: 10,
      page: 1,
      search,
      my_clients: 1,
    };

    return userService.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: `${item?.firstname} ${item?.lastname}`,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  return (
    <Space wrap>
      <DebounceSelect
        fetchOptions={fetchServices}
        className={'w-200px'}
        placeholder={t('select.service')}
        onChange={(value) => handleFilter({ service_id: value?.value })}
      />
      <DebounceSelect
        fetchOptions={fetchUsers}
        className={'w-200px'}
        placeholder={t('select.user')}
        onChange={(value) => handleFilter({ user_id: value?.value })}
      />
    </Space>
  );
};

export default Filter;
