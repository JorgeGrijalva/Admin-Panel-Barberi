import React, { useEffect, useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Tabs } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchSellerUsers } from 'redux/slices/user';
import formatSortType from 'helpers/formatSortType';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';
import UserShowModal from './userShowModal';
import { useTranslation } from 'react-i18next';
import FilterColumns from 'components/filter-column';
const { TabPane } = Tabs;

const roles = ['user'];

export default function ShopUsers() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { users, loading, meta, params } = useSelector(
    (state) => state.user,
    shallowEqual,
  );

  const [uuid, setUuid] = useState(null);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('firstname'),
      dataIndex: 'firstname',
      is_show: true,
    },
    {
      title: t('lastname'),
      dataIndex: 'lastname',
      is_show: true,
    },
    {
      title: t('email'),
      dataIndex: 'email',
      is_show: true,
    },
    {
      title: t('role'),
      dataIndex: 'role',
      is_show: true,
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (data, row) => {
        return (
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => setUuid(row.uuid)} />
          </Space>
        );
      },
    },
  ]);

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      }),
    );
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      const data = activeMenu.data;
      const params = {
        sort: data?.sort,
        column: data?.column,
        role: 'user',
        perPage: data?.perPage,
        page: data?.page,
      };
      dispatch(fetchSellerUsers(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      sort: data?.sort,
      column: data?.column,
      role: 'user',
      perPage: data?.perPage,
      page: data?.page,
    };
    dispatch(fetchSellerUsers(paramsData));
  }, [activeMenu.data]);

  const onChange = (key) => {
    dispatch(
      setMenuData({ activeMenu, data: { ...activeMenu.data, role: key } }),
    );
  };

  return (
    <Card
      title={t('shop.users')}
      extra={<FilterColumns columns={columns} setColumns={setColumns} />}
    >
      <Tabs activeKey='user' onChange={onChange} type='card'>
        {roles.map((item) => (
          <TabPane tab={t(item)} key={item} />
        ))}
      </Tabs>
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={users}
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
    </Card>
  );
}
