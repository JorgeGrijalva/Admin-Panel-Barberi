import React, { useEffect, useState } from 'react';
import { Card, Space, Table, Tag } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import FilterColumns from 'components/filter-column';
import { fetchBonusList } from 'redux/slices/bonus-list';
import formatSortType from 'helpers/formatSortType';
import moment from 'moment';
import useDidUpdate from 'helpers/useDidUpdate';

const BonusList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { bonus, meta, loading, params } = useSelector(
    (state) => state.bonusList,
    shallowEqual,
  );
  const data = activeMenu?.data;
  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('bonus.stock'),
      dataIndex: 'bonusStock',
      key: 'bonusStock',
      is_show: true,
      render: (bonusStock, row) => bonusStock?.product?.translation?.title,
    },
    {
      title: t('shop'),
      dataIndex: 'shop',
      key: 'shop',
      is_show: true,
      render: (_, row) => row.shop?.translation?.title,
    },
    {
      title: t('expired.at'),
      dataIndex: 'expired_at',
      key: 'expired_at',
      is_show: true,
      render: (expired_at) => (
        <div>
          {moment(new Date()).isBefore(expired_at) ? (
            <Tag color='blue'>{expired_at}</Tag>
          ) : (
            <Tag color='error'>{expired_at}</Tag>
          )}
        </div>
      ),
    },
  ]);

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchBonusList(paramsData));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchBonusList(paramsData));
  }, [activeMenu.data]);

  function onChangePagination(pagination, filter, sorter) {
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

  return (
    <Card
      title={t('bonuses.list')}
      extra={
        <Space>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={bonus}
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

export default BonusList;
