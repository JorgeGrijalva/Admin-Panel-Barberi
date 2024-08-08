import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Image, Card } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchSellerPropertyValue } from 'redux/slices/propertyValue';
import propertyService from 'services/seller/property';
import PropertyValueModal from './property-value-modal';
import PropertyDeleteModal from './property-delete-modal';
import DeleteButton from 'components/delete-button';
import { IMG_URL } from 'configs/app-global';
import { disableRefetch } from 'redux/slices/menu';
import FilterColumns from 'components/filter-column';

export default function SellerPropertyValue() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { propertyValues, loading } = useSelector(
    (state) => state.propertyValue,
    shallowEqual
  );

  const [id, setId] = useState(null);
  const [modal, setModal] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'extra_group_id',
      key: 'extra_group_id',
      is_show: true,
      render: (_, row) => row.group?.translation?.title,
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      is_show: true,
      render: (_, row) => (
        <Space className='extras'>
          {row.group.type === 'color' ? (
            <div
              className='extra-color-wrapper-contain'
              style={{ backgroundColor: row.value }}
            />
          ) : null}
          {row.group.type === 'image' ? (
            <Image
              width={100}
              src={IMG_URL + row.value}
              className='borderRadius'
            />
          ) : null}
          {row.group.type === 'image' ? null : <span>{row.value}</span>}
        </Space>
      ),
    },
    {
      title: t('options'),
      is_show: true,
      render: (record) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => setModal(record)}
            disabled={!record?.group?.shop_id}
          />
          <DeleteButton
            type='primary'
            danger
            icon={<DeleteOutlined />}
            onClick={() => setId([record.id])}
            disabled={!record?.group?.shop_id}
          />
        </Space>
      ),
    },
  ]);

  const handleCancel = () => setModal(null);

  const deleteProperty = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    propertyService
      .deleteValue(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        dispatch(fetchSellerPropertyValue());
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerPropertyValue());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('property.value')}
      extra={
        <Space wrap>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => setModal({})}
          >
            {t('add.property')}
          </Button>

          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        loading={loading}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={propertyValues}
        rowKey={(record) => record.id}
        pagination={false}
      />
      {modal && (
        <PropertyValueModal modal={modal} handleCancel={handleCancel} />
      )}
      {id && (
        <PropertyDeleteModal
          id={id}
          click={deleteProperty}
          text={t('delete.property')}
          loading={loadingBtn}
          handleClose={() => setId(null)}
        />
      )}
    </Card>
  );
}
