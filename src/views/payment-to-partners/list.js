import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Card, DatePicker, Row, Col, Tag } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';

import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';
import numberToPrice from 'helpers/numberToPrice';
import { DebounceSelect } from 'components/search';
import userService from 'services/user';

import { toast } from 'react-toastify';
import moment from 'moment';
import shopService from 'services/restaurant';
import { fetchPaymentToPartnersList } from 'redux/slices/paymentToPartners';
import paymentToPartnerService from 'services/payment-to-partner';
import PaymentPartnersConfirmation from './payment-type';
import StatisticNumberWidget from 'views/dashboard/statisticNumberWidget';
const { RangePicker } = DatePicker;

export default function PaymentToPartnersList() {
  const { type } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const goToShow = (id) => {
    dispatch(
      addMenu({
        url: `order/details/${id}`,
        id: 'order_details',
        name: t('order.details'),
      }),
    );
    navigate(`/order/details/${id}`);
  };

  const columns = [
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      render: (id) => (
        <span
          className='text-hover'
          onClick={() => {
            if (type === 'bookings') return;
            goToShow(id);
          }}
        >
          #{id}
        </span>
      ),
    },
    {
      title: t(type),
      is_show: true,
      dataIndex: 'user',
      key: 'user',
      render: (_, row) => {
        const user = type === 'seller' ? row?.shop?.seller : row.deliveryman;
        return (
          <div>
            {user?.firstname} {user?.lastname || ''}
          </div>
        );
      },
    },
    ...(type !== 'bookings'
      ? [
          {
            title: t('order.total_price'),
            is_show: true,
            dataIndex: 'total_price',
            key: 'total_price',
            render: (total_price, row) => {
              const status = row.transaction?.status;
              return (
                <>
                  <span>
                    {numberToPrice(
                      total_price,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    )}
                  </span>
                  <br />
                  <span
                    className={
                      status === 'progress'
                        ? 'text-primary'
                        : status === 'paid'
                          ? 'text-success'
                          : status === 'rejected'
                            ? 'text-danger'
                            : 'text-info'
                    }
                  >
                    {row.transaction?.status}
                  </span>
                </>
              );
            },
          },
        ]
      : []),
    ...(type === 'seller' || type === 'bookings'
      ? [
          {
            title: t('coupon.price'),
            is_show: true,
            dataIndex: 'coupon_price',
            key: 'coupon_price',
            render: (couponPrice) =>
              numberToPrice(
                couponPrice,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              ),
          },
        ]
      : []),
    ...(type === 'seller'
      ? [
          {
            title: t('total.cashback'),
            is_show: true,
            dataIndex: 'point_histories',
            key: 'point_histories',
            render: (cashback) =>
              numberToPrice(
                cashback?.[0]?.price,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              ),
          },
        ]
      : []),
    ...(type !== 'bookings'
      ? [
          {
            title: t('extra_price'),
            is_show: true,
            dataIndex: 'extra_price',
            key: 'extra_price',
            render: (extra_price) =>
              numberToPrice(
                extra_price,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              ),
          },
        ]
      : []),
    ...(type === 'seller' || type === 'bookings'
      ? [
          {
            title: t('service.fee'),
            is_show: true,
            dataIndex: 'service_fee',
            key: 'service_fee',
            render: (_, row) =>
              numberToPrice(
                (row.service_fee || 0) + (row.commission_fee || 0),
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              ),
          },
        ]
      : []),
    ...(type === 'seller' || type === 'bookings'
      ? [
          {
            title: t('seller.fee'),
            is_show: true,
            dataIndex: 'seller_fee',
            key: 'seller_fee',
            render: (sellerFee) =>
              numberToPrice(
                sellerFee,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              ),
          },
        ]
      : []),
    ...(type === 'bookings'
      ? [
          {
            title: t('delivery.fee'),
            is_show: true,
            dataIndex: 'delivery_fee',
            key: 'delivery_fee',
            render: (deliveryFee) =>
              numberToPrice(
                deliveryFee,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              ),
          },
        ]
      : []),
    ...(type === 'bookings'
      ? [
          {
            title: t('extra.time.price'),
            is_show: true,
            dataIndex: 'extra_time_price',
            key: 'extra_time_price',
            render: (extra_time_price) =>
              numberToPrice(
                extra_time_price,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              ),
          },
        ]
      : []),
    ...(type === 'bookings'
      ? [
          {
            title: t('gift.cart.price'),
            is_show: true,
            dataIndex: 'gift_cart_price',
            key: 'gift_cart_price',
            render: (gift_cart_price) =>
              numberToPrice(
                gift_cart_price,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              ),
          },
        ]
      : []),
    ...(type === 'bookings'
      ? [
          {
            title: t('price'),
            is_show: true,
            dataIndex: 'price',
            key: 'price',
            render: (price) =>
              numberToPrice(
                price,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              ),
          },
        ]
      : []),
    ...(type === 'bookings'
      ? [
          {
            title: t('shop'),
            is_show: true,
            dataIndex: 'shop',
            key: 'shop',
            render: (shop) => shop?.seller?.full_name || '-',
          },
        ]
      : []),
    ...(type === 'bookings'
      ? [
          {
            title: t('status'),
            is_show: true,
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag>{t(status)}</Tag>,
          },
        ]
      : []),
    ...(type === 'bookings'
      ? [
          {
            title: t('type'),
            is_show: true,
            dataIndex: 'type',
            key: 'type',
            render: (type) => <Tag>{t(type)}</Tag>,
          },
        ]
      : []),
    {
      title: t('payment.type'),
      is_show: true,
      dataIndex: 'transaction',
      key: 'transaction',
      render: (transaction) => t(transaction?.payment_system?.tag) || '-',
    },
  ];

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [dateRange, setDateRange] = useState(
    moment().subtract(1, 'month'),
    moment(),
  );
  const { list, loading, params, meta } = useSelector(
    (state) => state.paymentToPartners,
    shallowEqual,
  );
  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    user_id: data?.user_id,
    shop_id:
      activeMenu.data?.shop_id !== null ? activeMenu.data?.shop_id : null,
    date_from: Array.isArray(dateRange)
      ? dateRange[0]?.format('YYYY-MM-DD')
      : moment().subtract(1, 'month').format('YYYY-MM-DD'),
    date_to: Array.isArray(dateRange)
      ? dateRange[1]?.format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD'),
    type: type === 'bookings' ? 'seller' : type,
  };

  console.log('paramsData', paramsData);

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, perPage, page, column, sort },
      }),
    );
  }

  async function getUsers(search) {
    const params = {
      search,
      perPage: 10,
      role: type,
    };
    return userService.search(params).then(({ data }) => {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname}`,
        value: item.id,
      }));
    });
  }

  const payToUser = (paymentId) => {
    setLoadingBtn(true);
    const params = {
      data: id,
      type,
      payment_id: paymentId,
    };

    paymentToPartnerService
      .pay(params)
      .then(() => {
        toast.success(t('successfully.payed'));
        dispatch(
          fetchPaymentToPartnersList({
            params: paramsData,
            name: type === 'bookings' ? 'bookings' : 'orders',
          }),
        );
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
        setConfirmationModalOpen(false);
      });
  };

  useDidUpdate(() => {
    dispatch(
      fetchPaymentToPartnersList({
        params: paramsData,
        name: type === 'bookings' ? 'bookings' : 'orders',
      }),
    );
  }, [data, dateRange, type]);

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...{ [name]: item } },
      }),
    );
  };

  async function fetchShops(search) {
    const params = { search, status: 'approved' };
    return shopService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      })),
    );
  }

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(
        fetchPaymentToPartnersList({
          params: paramsData,
          name: type === 'bookings' ? 'bookings' : 'orders',
        }),
      );
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  useEffect(() => {
    return () => {
      dispatch(setMenuData({ activeMenu, data: {} }));
    };
  }, []);

  return (
    <>
      <Card>
        <div className='flex justify-content-space-between'>
          <Space
            wrap
            className='order-filter'
            style={{ flex: 1, width: '100%' }}
          >
            <DebounceSelect
              placeholder={t('select.shop')}
              fetchOptions={fetchShops}
              style={{ width: '100%' }}
              onSelect={(shop) => handleFilter(shop.value, 'shop_id')}
              onDeselect={() => handleFilter(null, 'shop_id')}
              allowClear={true}
              value={data?.shop_id}
            />
            <DebounceSelect
              placeholder={t('select.user')}
              fetchOptions={getUsers}
              onSelect={(user) => handleFilter(user.value, 'user_id')}
              onDeselect={() => handleFilter(null, 'user_id')}
              style={{ width: '100%' }}
              value={data?.user_id}
            />
            <RangePicker
              value={dateRange}
              onChange={(values) => {
                handleFilter((prev) => ({
                  ...prev,
                  ...{
                    date_from: values?.[0]?.format('YYYY-MM-DD'),
                    date_to: values?.[1]?.format('YYYY-MM-DD'),
                  },
                }));
                setDateRange(values);
              }}
              disabledDate={(current) => {
                return current && current > moment().endOf('day');
              }}
              style={{ width: '100%' }}
            />
          </Space>
          <Button
            type='primary'
            disabled={!id || id.length === 0}
            onClick={() => setConfirmationModalOpen(true)}
          >
            {t('pay')}
          </Button>
        </div>
      </Card>

      <div
        style={{
          width: '100%',
        }}
      >
        <Row gutter={16} className='mt-3'>
          <Col flex='0 0 25%'>
            <StatisticNumberWidget
              title={t('commission.fee')}
              value={numberToPrice(
                list?.total_commission_fee,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              )}
              color='purple'
            />
          </Col>
          <Col flex='0 0 25%'>
            <StatisticNumberWidget
              title={t('coupon')}
              value={numberToPrice(
                list?.total_coupon,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              )}
              color='red'
            />
          </Col>
          {type !== 'bookings' && (
            <Col flex='0 0 25%'>
              <StatisticNumberWidget
                title={t('delivery.fee')}
                value={numberToPrice(
                  !!list?.total_delivery_fee
                    ? Math.trunc(list?.total_delivery_fee)
                    : 0,
                  defaultCurrency?.symbol,
                  defaultCurrency?.position,
                )}
                color='green'
              />
            </Col>
          )}
          {type !== 'bookings' && (
            <Col flex='0 0 25%'>
              <StatisticNumberWidget
                title={t('point.history')}
                value={numberToPrice(
                  !!list?.total_point_history
                    ? Math.trunc(list?.total_point_history)
                    : 0,
                  defaultCurrency?.symbol,
                  defaultCurrency?.position,
                )}
                color='purple'
              />
            </Col>
          )}
          <Col flex='0 0 25%'>
            <StatisticNumberWidget
              title={t('price')}
              value={numberToPrice(
                !!list?.total_price ? Math.trunc(list?.total_price) : 0,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              )}
              color='red'
            />
          </Col>
          <Col flex='0 0 25%'>
            <StatisticNumberWidget
              title={t('seller.fee')}
              value={numberToPrice(
                !!list?.total_seller_fee
                  ? Math.trunc(list?.total_seller_fee)
                  : 0,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              )}
              color='purple'
            />
          </Col>
          <Col flex='0 0 25%'>
            <StatisticNumberWidget
              title={t('service.fee')}
              value={numberToPrice(
                !!list?.total_service_fee
                  ? Math.trunc(list?.total_service_fee)
                  : 0,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              )}
              color='red'
            />
          </Col>
          <Col flex='0 0 25%'>
            <StatisticNumberWidget
              title={t('tax')}
              value={numberToPrice(
                !!list?.total_tax ? Math.trunc(list?.total_tax) : 0,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              )}
              color='green'
            />
          </Col>
          {type === 'bookings' && (
            <Col flex='0 0 25%'>
              <StatisticNumberWidget
                title={t('extra.time.price')}
                value={numberToPrice(
                  !!list?.extra_time_price
                    ? Math.trunc(list?.extra_time_price)
                    : 0,
                  defaultCurrency?.symbol,
                  defaultCurrency?.position,
                )}
                color='green'
              />
            </Col>
          )}
        </Row>
      </div>

      <Card>
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((items) => items.is_show)}
          dataSource={list?.data}
          loading={loading}
          pagination={{
            pageSize: params.perPage,
            page: activeMenu.data?.page || 1,
            total: meta?.total,
            defaultCurrent: activeMenu.data?.page,
            current: activeMenu.data?.page,
          }}
          rowKey={(record) => record?.id}
          onChange={onChangePagination}
        />
      </Card>

      {confirmationModalOpen && (
        <PaymentPartnersConfirmation
          open={confirmationModalOpen}
          onCancel={() => {
            setConfirmationModalOpen(false);
            setId(null);
          }}
          onConfirm={(paymentId) => payToUser(paymentId)}
          isPaying={loadingBtn}
        />
      )}
    </>
  );
}
