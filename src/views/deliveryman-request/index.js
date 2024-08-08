import React, { useEffect, useState } from 'react';
import { Card, Table, Image, Space, Button, Tag } from 'antd';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';

import { fetchDeliverymanRequest } from 'redux/slices/deliveryman-request';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import DeliverymanRequestModal from './details-modal';
import StatusChangeModal from './status-change-modal';
import requestAdminModelsService from 'services/request-models';
import { toast } from 'react-toastify';

export default function DeliverymanRequest() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { deliverymanRequestData, meta, loading } = useSelector(
    (state) => state.deliverymanRequest,
    shallowEqual,
  );

  const [id, setId] = useState(null);
  const [details, setDetails] = useState(null);
  const [changeStatus, setChangeStatus] = useState(null);

  const data = activeMenu.data;

  const paramsData = {
    perPage: data?.perPage,
    page: data?.page,
    search: data?.search,
    columns: data?.columns,
  };

  useDidUpdate(() => {
    dispatch(fetchDeliverymanRequest(paramsData));
  }, [activeMenu?.data]);

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(fetchDeliverymanRequest(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu?.data, perPage, page, column, sort },
      }),
    );
  }

  const handleChangeStatus = (id, data) => {
    const params = {
      status_note: data?.status_note,
      status: data?.status,
    };
    return requestAdminModelsService.changeStatus(id, params).then(() => {
      setChangeStatus(null);
      toast.success(t('successfully.updated'));
      dispatch(fetchDeliverymanRequest(paramsData));
      dispatch(disableRefetch(activeMenu));
    });
  };

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      is_show: true,
      render: (_, row) => row?.model?.firstname + ' ' + row?.model?.lastname,
    },
    {
      title: t('delivery.man.setting'),
      dataIndex: 'setting',
      key: 'setting',
      is_show: true,
      render: (_, data) => (
        <Space>
          <span>
            {t('brand')}: {data?.data?.brand}
            <br />
            {t('model')}: {data?.data?.model}
            <br />
            {t('number')}: {data?.data?.number}
            <br />
            {t('color')}: {data?.data?.color}
          </span>
        </Space>
      ),
    },
    {
      title: t('image'),
      dataIndex: 'image',
      key: 'image',
      is_show: true,
      render: (_, row) => (
        <Image
          src={row?.data?.['images[0]'] || 'https://via.placeholder.com/100'}
          alt={'img'}
          width={100}
          className={'rounded'}
          preview
          placeholder
        />
      ),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status, row) => (
        <div>
          {status === 'pending' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'canceled' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          {!row.deleted_at ? (
            <EditOutlined onClick={() => setChangeStatus(row)} />
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setDetails(row);
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <Card title={t('deliveryman.request')}>
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item?.is_show)}
        dataSource={deliverymanRequestData}
        pagination={{
          pageSize: meta?.perPage,
          total: meta?.total,
          current: data?.page,
          page: data?.page || 1,
          defaultCurrent: data?.page,
        }}
        onChange={onChangePagination}
        rowKey={(record) => record?.id}
        loading={loading}
      />
      {details ? (
        <DeliverymanRequestModal
          data={details}
          handleClose={() => setDetails(null)}
        />
      ) : null}
      {changeStatus ? (
        <StatusChangeModal
          data={changeStatus}
          handleChange={handleChangeStatus}
          handleClose={() => setChangeStatus(null)}
        />
      ) : null}
    </Card>
  );
}
