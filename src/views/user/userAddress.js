import React, { useState } from 'react';
import { Button, Table } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import UserAddressModal from './userAddressModal';
import FilterColumns from '../../components/filter-column';

export default function UserAddress({ data }) {
  const { t } = useTranslation();
  const [uuid, setUuid] = useState(null);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      is_show: true,
    },
    {
      title: t('address'),
      dataIndex: 'address',
      key: 'address',
      is_show: true,
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
    },
  ]);

  return (
    <div className='px-2'>
      <div className='d-flex justify-content-end'>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={() => setUuid(data.uuid)}
        >
          {t('add.address')}
        </Button>
        <FilterColumns columns={columns} setColumns={setColumns} />
      </div>
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={data.addresses}
        pagination={false}
        rowKey={(record) => record.id}
      />
      {uuid ? (
        <UserAddressModal uuid={uuid} handleCancel={() => setUuid(false)} />
      ) : (
        ''
      )}
    </div>
  );
}
