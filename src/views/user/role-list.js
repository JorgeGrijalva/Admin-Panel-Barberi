import React, { useEffect } from 'react';
import { Card, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchRoles } from '../../redux/slices/role';
import { disableRefetch } from '../../redux/slices/menu';

export default function RoleList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, roles } = useSelector((state) => state.role, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name) => t(name),
    },
  ];

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(fetchRoles());
      dispatch(disableRefetch(activeMenu));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu?.refetch]);

  return (
    <Card title={t('roles')}>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={roles}
        loading={loading}
        pagination={false}
        rowKey={(record) => record.id}
      />
    </Card>
  );
}
