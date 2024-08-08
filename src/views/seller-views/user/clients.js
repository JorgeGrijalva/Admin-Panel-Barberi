import React, { useEffect, useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import GlobalContainer from '../../../components/global-container';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import formatSortType from '../../../helpers/formatSortType';
import useDidUpdate from '../../../helpers/useDidUpdate';
import UserShowModal from './userShowModal';
import { fetchSellerClients } from '../../../redux/slices/client';

export default function SellerClients() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { clients, loading, meta, params } = useSelector(
    (state) => state.client,
    shallowEqual
  );

  const [uuid, setUuid] = useState(null);

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('firstname'),
      dataIndex: 'firstname',
      key: 'firstname',
      is_show: true,
    },
    {
      title: t('lastname'),
      dataIndex: 'lastname',
      key: 'lastname',
      is_show: true,
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
      is_show: true,
    },
    {
      title: t('role'),
      dataIndex: 'role',
      key: 'role',
      is_show: true,
    },
    {
      title: t('options'),
      dataIndex: 'options',
      key: 'options',
      is_show: true,
      render: (data, row) => {
        return (
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => setUuid(row.uuid)} />
          </Space>
        );
      },
    },
  ];

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({ activeMenu, data: { perPage, page, column, sort } })
    );
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerClients());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      sort: data?.sort,
      column: data?.column,
      perPage: data.perPage,
      page: data.page,
    };
    dispatch(fetchSellerClients(paramsData));
  }, [activeMenu.data]);

  return (
    <GlobalContainer
      headerTitle={t('clients')}
      navLInkTo={'/seller/user/add'}
      buttonTitle={t('client.add')}
    >
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={clients}
        loading={loading}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
      />

      {uuid && <UserShowModal uuid={uuid} handleCancel={() => setUuid(null)} />}
    </GlobalContainer>
  );
}
