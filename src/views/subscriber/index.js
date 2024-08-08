import React, { useEffect, useState } from 'react';
import { Card, Space, Table, Tag } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { fetchSubscriber } from '../../redux/slices/subscriber';
import FilterColumns from '../../components/filter-column';
import hideEmail from '../../components/hideEmail';
import useDemo from '../../helpers/useDemo';

const Subciribed = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isDemo } = useDemo();

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
      render: (_, row) => {
        return (
          <div>
            {row?.user?.firstname} {row?.user?.lastname || ''}
          </div>
        );
      },
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
      is_show: true,
      render: (_, row) => {
        return (
          <div>{isDemo ? hideEmail(row.user?.email) : row.user?.email}</div>
        );
      },
    },
    {
      title: t('status'),
      dataIndex: 'active',
      key: 'active',
      is_show: true,
      render: (active) => {
        return (
          <Tag color={active === true ? 'blue' : 'red'}>
            {active === true ? t('subscriber') : t('not.subscriber')}
          </Tag>
        );
      },
    },
  ]);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { subscriber, meta, loading, params } = useSelector(
    (state) => state.subscriber,
    shallowEqual
  );

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSubscriber());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchSubscriber({ perPage: pageSize, page: current }));
  };

  return (
    <Card
      title={t('subscriber')}
      extra={
        <Space>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={subscriber}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
    </Card>
  );
};

export default Subciribed;
