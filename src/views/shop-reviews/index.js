import React, { useEffect, useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Card, Rate, Space, Table } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';
import { useTranslation } from 'react-i18next';
import { fetchShopReviews } from 'redux/slices/shop-reviews';
import ShopReviewShowModal from './shopReviewShow';
import moment from 'moment';
import FilterColumns from 'components/filter-column';
import shopService from 'services/restaurant';
import { InfiniteSelect } from 'components/infinite-select';

export default function SellerOrderReviews() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [links, setLinks] = useState(null);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'order',
      sorter: true,
      is_show: true,
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
      is_show: true,
      render: (user) => <div>{user?.lastname + user?.firstname}</div>,
    },
    {
      title: t('comment'),
      dataIndex: 'comment',
      key: 'comment',
      is_show: true,
      render: (_, row) => {
        const comment = row?.comment?.split(',');
        const name = comment?.at(0);

        return <div>{name}</div>;
      },
    },
    {
      title: t('rating'),
      dataIndex: 'rating',
      key: 'rating',
      is_show: true,
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (createdAt) => moment(createdAt).format('DD.MM.YYYY HH:mm'),
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
              type='primary'
              icon={<EyeOutlined />}
              onClick={() => setShow(row.id)}
            />
          </Space>
        );
      },
    },
  ]);

  const [id, setId] = useState(null);
  const [show, setShow] = useState(null);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { reviews, meta, loading, params } = useSelector(
    (state) => state.shopReviews,
    shallowEqual,
  );

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchShopReviews());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      sort: data?.sort,
      column: data?.column,
      perPage: data?.perPage,
      page: data?.page,
      type: 'shop',
      type_id: data?.selectedShop?.value,
    };
    dispatch(fetchShopReviews(paramsData));
  }, [activeMenu.data]);

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({ activeMenu, data: { perPage, page, column, sort } }),
    );
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setId(newSelectedRowKeys);
  };

  const rowSelection = {
    id,
    onChange: onSelectChange,
  };

  async function fetchUserShop({ search, page }) {
    const params = {
      search: search?.length === 0 ? undefined : search,
      status: 'approved',
      page: page,
    };
    return shopService.search(params).then((res) => {
      setLinks(res.links);
      return res.data.map((item) => ({
        label: item.translation !== null ? item.translation.title : 'no name',
        value: item.id,
      }));
    });
  }

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

  return (
    <Card
      title={t('shop.reviews')}
      extra={
        <Space wrap>
          <InfiniteSelect
            placeholder={t('select.shop')}
            hasMore={links?.next}
            loading={loading}
            fetchOptions={fetchUserShop}
            style={{ minWidth: 180 }}
            onChange={(e) => handleFilter({ selectedShop: e })}
            value={activeMenu.data?.selectedShop}
          />
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={reviews}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
        loading={loading}
      />
      {show && (
        <ShopReviewShowModal id={show} handleCancel={() => setShow(null)} />
      )}
    </Card>
  );
}
