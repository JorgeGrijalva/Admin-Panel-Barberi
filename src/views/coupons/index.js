import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Context } from 'context/context';
import CustomModal from 'components/modal';
import { toast } from 'react-toastify';
import couponService from 'services/coupon';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';
import useDidUpdate from 'helpers/useDidUpdate';
import { fetchCoupon } from 'redux/slices/coupon';
import formatSortType from 'helpers/formatSortType';
import numberToPrice from 'helpers/numberToPrice';

const Coupon = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `coupon/${row.id}`,
        id: 'coupon_edit',
        name: t('edit.coupon'),
      }),
    );
    navigate(`/coupon/${row.id}`);
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add.coupon',
        url: `coupon/add`,
        name: t('add.coupon'),
      }),
    );
    navigate(`/coupon/add`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'title',
      is_show: true,
      render: (_, row) => row.translation?.title,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      is_show: true,
    },
    {
      title: t('type'),
      dataIndex: 'type',
      is_show: true,
    },
    {
      title: t('price'),
      dataIndex: 'price',
      is_show: true,
      render: (price, row) =>
        numberToPrice(
          price,
          row?.type === 'percent' ? '%' : defaultCurrency?.symbol,
          row?.type === 'percent' ? 'after' : defaultCurrency?.position,
        ),
    },
    {
      title: t('quantity'),
      dataIndex: 'qty',
      is_show: true,
    },
    {
      title: t('expired.at'),
      dataIndex: 'expired_at',
      is_show: true,
      render: (expired_at) => (
        <div>
          {moment(new Date()).isBefore(expired_at) ? (
            <Tag color='blue'>{moment(expired_at).format('YYYY-MM-DD')}</Tag>
          ) : (
            <Tag color='error'>{moment(expired_at).format('YYYY-MM-DD')}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setCouponId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [couponId, setCouponId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { coupons, meta, loading, params } = useSelector(
    (state) => state.coupons,
    shallowEqual,
  );
  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    status: data?.role,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
  };

  function deleteCoupon() {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...couponId.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    couponService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setCouponId(null);
        setIsModalVisible(false);
        dispatch(fetchCoupon());
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  }

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

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchCoupon(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchCoupon(paramsData));
  }, [activeMenu.data]);

  const rowSelection = {
    selectedRowKeys: couponId,
    onChange: (key) => {
      setCouponId(key);
    },
  };

  const allDelete = () => {
    if (couponId === null || couponId.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  return (
    <Card
      title={t('coupons')}
      extra={
        <Space wrap>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.coupon')}
          </Button>

          <DeleteButton onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        dataSource={coupons}
        columns={columns?.filter((item) => item.is_show)}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal
        click={deleteCoupon}
        text={text ? t('delete') : t('all.delete')}
        setText={setCouponId}
        loading={loadingBtn}
      />
    </Card>
  );
};

export default Coupon;
