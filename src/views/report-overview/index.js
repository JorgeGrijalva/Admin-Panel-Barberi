import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Table,
  Tag,
  Divider,
  DatePicker,
  Select,
  Spin,
} from 'antd';
import React, { useContext } from 'react';
import ChartWidget from 'components/chart-widget';
import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import QueryString from 'qs';
import { ReportContext } from 'context/report';
import { useEffect } from 'react';
import {
  fetchReportOverviewCart,
  fetchReportOverviewCategories,
  fetchReportOverviewProducts,
} from 'redux/slices/report/overview';
import { disableRefetch } from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';
import moment from 'moment';
import numberToPrice from 'helpers/numberToPrice';
import { useTranslation } from 'react-i18next';
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const ReportOverview = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const category_id = QueryString.parse(location.search, [])['?category_id'];
  const product_id = QueryString.parse(location.search, [])['?product_id'];
  const {
    date_from,
    date_to,
    by_time,
    chart,
    handleDateRange,
    options,
    handleByTime,
    chart_type,
    setChartType,
  } = useContext(ReportContext);
  const { loading, carts, products, categories } = useSelector(
    (state) => state.overviewReport,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();

  const topProductsTitle = (data) => {
    const titleArray = data?.split(', ');

    return (
      <div style={{ display: 'flex', rowGap: '10px', flexDirection: 'column' }}>
        {titleArray?.map((item, index) =>
          item?.[0] === '#' ? (
            <span
              style={{
                display: 'block',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                backgroundColor: item?.trim(),
              }}
            />
          ) : (
            item
          ),
        )}
      </div>
    );
  };

  const columns = [
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      render: (title) => topProductsTitle(title),
    },
    {
      title: t('item.sold'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('net.sales'),
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) =>
        numberToPrice(
          price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
    {
      title: t('orders'),
      dataIndex: 'count',
      key: 'count',
    },
  ];
  const performance = [
    {
      title: 'Total sales',
      qty: 'delivered_sum',
      percent: '5',
      price: true,
    },
    {
      title: 'Orders',
      qty: 'count',
      percent: '5',
      price: false,
    },
    {
      title: 'Canceled orders price',
      qty: 'canceled_sum',
      percent: '5',
      price: true,
    },
    {
      title: 'Total tax',
      qty: 'tax',
      percent: '5',
      price: true,
    },
    {
      title: 'Delivered avg',
      qty: 'delivered_avg',
      percent: '5',
      price: true,
    },
    {
      title: 'Delivery fee',
      qty: 'delivery_fee',
      percent: '5',
      price: true,
    },
  ];

  const fetchProducts = (page, perPage) => {
    const params = {
      date_from,
      date_to,
      type: by_time,
      page,
      perPage,
    };
    dispatch(fetchReportOverviewProducts(params));
  };

  const fetchCategories = (page, perPage) => {
    const params = {
      date_from,
      date_to,
      type: by_time,
      page,
      perPage,
    };
    dispatch(fetchReportOverviewCategories(params));
  };

  const fetchOverview = (page, perPage) => {
    const params = {
      date_from,
      date_to,
      type: by_time,
      page,
      perPage,
    };
    if (category_id) params.categories = [category_id];
    if (product_id) params.products = [product_id];
    dispatch(fetchReportOverviewCart(params));
  };

  const onProductPaginationChange = (pagination) => {
    const { pageSize: perPage, current: page } = pagination;
    fetchProducts(page, perPage);
  };

  const onCategoryPaginationChange = (pagination) => {
    const { pageSize: perPage, current: page } = pagination;
    fetchProducts(page, perPage);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchOverview();
      fetchProducts();
      fetchCategories();
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    fetchOverview();
  }, [date_to, by_time, chart, category_id, product_id, date_from]);

  useDidUpdate(() => {
    fetchProducts();
  }, [date_to, by_time, date_from]);

  useDidUpdate(() => {
    fetchCategories();
  }, [date_to, by_time, date_from]);

  return (
    <Spin size='large' spinning={loading}>
      <Row gutter={24} className='mb-4'>
        <Col span={12}>
          <Space size='large'>
            <RangePicker
              defaultValue={[moment(date_from), moment(date_to)]}
              onChange={handleDateRange}
            />
          </Space>
        </Col>
      </Row>
      <Divider orientation='left'>Performance</Divider>
      <Row gutter={24}>
        {performance?.map((item, key) => {
          return (
            <Col span={6}>
              <Link key={item.title} to='/report/revenue'>
                <Card>
                  <Row className='mb-5'>
                    <Col>
                      <Text>{item.title}</Text>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Title level={2}>
                        {item.price
                          ? numberToPrice(
                              carts[item.qty],
                              defaultCurrency?.symbol,
                              defaultCurrency?.position,
                            )
                          : carts[item.qty]}
                      </Title>
                    </Col>
                  </Row>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
      <Row gutter={24} className='mb-2'>
        <Col span={20}>
          <Divider orientation='left'>Charts</Divider>
        </Col>
        <Col span={4}>
          <div className='d-flex'>
            <Select
              style={{ width: 100 }}
              onChange={handleByTime}
              options={options}
              defaultValue={by_time}
            />

            <Divider type='vertical' style={{ height: '100%' }} />
            <Space>
              <LineChartOutlined
                style={{
                  fontSize: '22px',
                  cursor: 'pointer',
                  color: chart_type === 'line' ? 'green' : '',
                }}
                onClick={() => setChartType('line')}
              />
              <BarChartOutlined
                style={{
                  fontSize: '22px',
                  cursor: 'pointer',
                  color: chart_type === 'bar' ? 'green' : '',
                }}
                onClick={() => setChartType('bar')}
              />
            </Space>
          </div>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Card title='Net Sales'>
            <ChartWidget
              type={chart_type}
              series={[
                {
                  name: 'Orders',
                  data: carts?.chart_price?.map((item) => item.delivered_sum),
                },
              ]}
              xAxis={carts?.chart_price?.map((item) => item.time)}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='Orders'>
            <ChartWidget
              type={chart_type}
              series={[
                {
                  name: 'Orders',
                  data: carts?.chart_count?.map((item) => item.count),
                },
              ]}
              xAxis={carts?.chart_price?.map((item) => item.time)}
            />
          </Card>
        </Col>
      </Row>
      <Divider orientation='left'>Leaderboards</Divider>
      <Row gutter={24}>
        <Col span={12}>
          <Card title='Top categories'>
            <Table
              scroll={{ x: true }}
              onChange={onCategoryPaginationChange}
              pagination={{
                pageSize: categories?.meta?.per_page,
                page: categories?.meta?.current_page || 1,
                total: categories?.meta?.total,
                defaultCurrent: 1,
              }}
              columns={columns}
              dataSource={categories?.data}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='Top products'>
            <Table
              scroll={{ x: true }}
              onChange={onProductPaginationChange}
              pagination={{
                pageSize: products?.meta?.per_page,
                page: products?.meta?.current_page || 1,
                total: products?.meta?.total,
                defaultCurrent: 1,
              }}
              columns={columns}
              dataSource={products?.data}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default ReportOverview;
