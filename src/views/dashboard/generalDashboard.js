import React, { useMemo } from 'react';
import { Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OrderChart from './orderChart';
import SalesChart from './salesChart';
import StatisticNumberWidget from './statisticNumberWidget';
import StatisticPriceWidget from './statisticPriceWidget';
import TopBar from './topBar';
import TopCustomers from './topCustomers';
import TopProducts from './topProducts';
import { setMenu } from 'redux/slices/menu';
import { Todo } from 'components/todo';
import OrderPieChart from './orderPieChart';
import BookingsPercentStatistics from './bookings-percent';
import BookingsCountStatistics from './bookings-count';
import BookingsTotalStatistics from './bookings-total';

export default function GeneralDashboard({ isSeller }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const { counts } = useSelector(
    (state) => state.statisticsCount,
    shallowEqual,
  );
  const { theme } = useSelector((state) => state.theme, shallowEqual);
  const parcelMode = useMemo(
    () => !!theme.parcelMode && user?.role === 'admin',
    [theme, user],
  );

  const goToOrder = (url, name) => {
    const params =
      url === 'report/stock'
        ? {
            id: url,
            url,
            name,
            refetch: true,
            data: { value: 'out_of_stock', label: 'Out of stock' },
          }
        : { id: url, url, name, refetch: true };
    dispatch(setMenu(params));
    navigate(`/${url}`);
  };

  return (
    <div>
      <TopBar />
      {!parcelMode ? (
        <>
          <Row gutter={16} className='mt-3'>
            <Col span={24}>
              <Card>
                <span style={{ fontSize: '1rem' }}>
                  {t('last.30.days.statistics')}
                </span>
              </Card>
            </Col>
            <Col span={24}>
              <Card>
                <span style={{ fontSize: '1rem' }}>
                  {t('orders.statistics')}
                </span>
              </Card>
            </Col>
            <Col flex='0 0 16.6%'>
              <StatisticNumberWidget
                title={t('in.progress.orders')}
                value={counts?.progress_orders_count}
                color='purple'
                onClick={() =>
                  goToOrder(
                    user?.role === 'seller'
                      ? 'seller/orders?status=new'
                      : 'orders?status=new',
                    t('in.progress.orders'),
                  )
                }
              />
            </Col>
            <Col flex='0 0 16.6%'>
              <StatisticNumberWidget
                title={t('cancelled.orders')}
                value={counts?.cancel_orders_count}
                color='red'
                onClick={() =>
                  goToOrder(
                    user?.role === 'seller'
                      ? 'seller/orders?status=canceled'
                      : 'orders?status=canceled',
                    t('cancelled.orders'),
                  )
                }
              />
            </Col>
            <Col flex='0 0 16.6%'>
              <StatisticNumberWidget
                title={t('delivered.orders')}
                value={counts?.delivered_orders_count}
                color='green'
                onClick={() =>
                  goToOrder(
                    user?.role === 'seller'
                      ? 'seller/orders?status=delivered'
                      : 'orders?status=delivered',
                    t('delivered.orders'),
                  )
                }
              />
            </Col>
            <Col flex='0 0 16.6%'>
              <StatisticNumberWidget
                title={t('out.of.stock.products')}
                value={counts?.products_out_of_count}
                color='red'
                onClick={() => {
                  if (user?.role === 'admin') {
                    goToOrder('report/stock', t('stock'));
                  }
                }}
              />
            </Col>
            <Col flex='0 0 16.6%'>
              <StatisticNumberWidget
                title={t('total.products')}
                value={counts?.products_count}
                color='grey'
                onClick={() =>
                  goToOrder(
                    user?.role === 'seller'
                      ? 'seller/products'
                      : 'catalog/products',
                    t('products'),
                  )
                }
              />
            </Col>
            <Col flex='0 0 16.6%'>
              <StatisticNumberWidget
                title={t('shop.reviews')}
                value={counts?.reviews_count}
                color='purple'
              />
            </Col>
          </Row>
          <Col span={24}>
            <Card>
              <span style={{ fontSize: '1rem' }}>
                {t('order.total.statistics')}
              </span>
            </Card>
          </Col>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <StatisticPriceWidget
                title={t('total.earned')}
                value={counts?.total_earned}
                subtitle={t('last.30.days')}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <StatisticPriceWidget
                title={t('delivery.earning')}
                value={counts?.delivery_earned}
                subtitle={t('last.30.days')}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <StatisticPriceWidget
                title={t('total.order.tax')}
                value={counts?.tax_earned}
                subtitle={t('last.30.days')}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={6}>
              <StatisticPriceWidget
                title={t('total.comission')}
                value={counts?.commission_earned}
                subtitle={t('last.30.days')}
              />
            </Col>
          </Row>
          <Col span={24}>
            <Card>
              <span style={{ fontSize: '1rem' }}>
                {t('bookings.count.statistics')}
              </span>
            </Card>
          </Col>
          <Row gutter={16}>
            <Col span={24}>
              <BookingsCountStatistics isSeller={isSeller} />
            </Col>
          </Row>
          <Col span={24}>
            <Card>
              <span style={{ fontSize: '1rem' }}>
                {t('bookings.percent.statistics')}
              </span>
            </Card>
          </Col>
          <Row gutter={16}>
            <Col span={24}>
              <BookingsPercentStatistics isSeller={isSeller} />
            </Col>
          </Row>
          <Col span={24}>
            <Card>
              <span style={{ fontSize: '1rem' }}>
                {t('bookings.total.statistics')}
              </span>
            </Card>
          </Col>
          <Row gutter={16}>
            <Col span={24}>
              <BookingsTotalStatistics isSeller={isSeller} />
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <OrderChart />
            </Col>
            <Col span={12}>
              <Todo />
            </Col>
            <Col span={12}>
              <TopProducts />
            </Col>
            <Col span={12}>
              <SalesChart />
            </Col>
            {!isSeller && (
              <Col span={12}>
                <TopCustomers />
              </Col>
            )}
            <Col span={12}>
              <OrderPieChart counts={counts} />
            </Col>
          </Row>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
