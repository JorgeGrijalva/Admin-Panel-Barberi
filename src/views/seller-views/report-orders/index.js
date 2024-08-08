import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Table,
  Tag,
  DatePicker,
  Spin,
  Menu,
  Dropdown,
  Button,
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { disableRefetch, setMenu } from '../../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ReportChart from '../../../components/report/chart';
import moment from 'moment';
import { ReportContext } from '../../../context/report';
import FilterColumns from '../../../components/filter-column';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  fetchSellerOrderProduct,
  fetchSellerOrderProductChart,
} from '../../../redux/slices/report/order';
import useDidUpdate from '../../../helpers/useDidUpdate';
import numberToPrice from '../../../helpers/numberToPrice';
import { DebounceSelect } from 'components/search';
import shopService from 'services/restaurant';
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const ReportOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { date_from, date_to, by_time, chart, handleChart, handleDateRange } =
    useContext(ReportContext);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const {
    loading,
    chartData: reportData,
    productList: reportProducts,
  } = useSelector((state) => state.orderReport, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );
  const [selectedShop, setSelectedShop] = useState();

  const [columns, setColumns] = useState([
    {
      title: 'Order #',
      dataIndex: 'id',
      key: 'id',
      is_show: true,
      render: (_, data) => (
        <Button type='primary' onClick={() => goToShow(data)}>
          #{data.id}
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'items_sold',
      key: 'items_sold',
      is_show: true,
      render: (_, row) => <Tag>{row.status}</Tag>,
    },
    {
      title: 'Customer',
      dataIndex: 'user_firstname',
      key: 'user_firstname',
      is_show: true,
      render: (_, data) => <>{`${data.firstname} ${data.lastname}`}</>,
    },
    {
      title: 'Customer type',
      key: 'user_active',
      dataIndex: 'user_active',
      is_show: true,
      render: (_, data) => {
        const status = Boolean(data.active);
        return (
          <Tag color={status ? 'green' : 'red'} key={data.id}>
            {status ? 'Active' : 'Inactive'}
          </Tag>
        );
      },
    },
    {
      title: 'Product(s)',
      key: 'category',
      dataIndex: 'category',
      is_show: true,
      render: (_, data) => {
        if (data.products?.length > 1) {
          return (
            <>
              <p>{data.products[0]}</p>

              <Dropdown
                overlay={
                  <Menu>
                    {data.products
                      ?.slice(1, data.products.length)
                      .map((item, key) => (
                        <Menu.Item key={key}>{item}</Menu.Item>
                      ))}
                  </Menu>
                }
              >
                <Tag style={{ cursor: 'pointer' }}>{`+ ${
                  data.products?.length - 1
                } more`}</Tag>
              </Dropdown>
            </>
          );
        } else {
          return <>{data.products[0]}</>;
        }
      },
    },
    {
      title: 'Item sold',
      key: 'item_sold',
      dataIndex: 'item_sold',
      sorter: (a, b) => Number(a.quantity) - Number(b.quantity),

      is_show: true,
      render: (_, data) => {
        return Number(data.quantity);
      },
    },
    {
      title: 'Net sales',
      key: 'price',
      dataIndex: 'price',
      is_show: true,
      sorter: (a, b) => a.price - b.price,
      render: (_, data) => {
        return <>{numberToPrice(data.price, defaultCurrency?.symbol)}</>;
      },
    },
  ]);

  const performance = [
    {
      label: 'Item sold',
      value: 'quantity',
      price: false,
      qty: 'quantity',
    },
    {
      label: 'Net sales',
      value: 'price',
      price: true,
      qty: 'price',
    },
    {
      label: 'Avg Order price',
      value: 'avg_price',
      price: true,
      qty: 'avg_price',
    },
    {
      label: 'Orders',
      value: 'count',
      price: false,
      qty: 'count',
    },
  ];

  const goToShow = (row) => {
    const url = `seller/order/details/${row.id}`;
    dispatch(
      setMenu({
        url,
        id: 'order_details',
        name: t('order.details'),
        refetch: true,
        data: {},
      })
    );
    navigate(`/${url}`);
  };

  const fetchOrderChart = () => {
    if (performance.find((item) => item.value === chart)) {
      const data = {
        date_from,
        date_to,
        type: by_time,
        chart,
        shop_id: selectedShop?.value,
      };
      dispatch(fetchSellerOrderProductChart(data));
    }
  };

  const fetchOrderList = (page, perPage) => {
    dispatch(
      fetchSellerOrderProduct({
        date_from,
        date_to,
        by_time,
        chart,
        page: 1,
        perPage: 10,
        shop_id: selectedShop?.value,
      })
    );
  };

  useEffect(() => {
    handleChart(performance[0].value);
  }, []);

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchOrderList();
      fetchOrderChart();
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    fetchOrderList();
  }, [date_to, by_time, chart, date_from, selectedShop?.value]);

  useDidUpdate(() => {
    fetchOrderChart();
  }, [date_to, by_time, chart, date_from, selectedShop?.value]);

  const onChangePagination = (pagination) => {
    const { pageSize: perPage, current: page } = pagination;
    fetchOrderList(page, perPage);
  };

  async function fetchUserShopList(search) {
    const params = { search, active: 1 };
    return shopService.get(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation ? item.translation.title : 'no name',
        value: item.id,
      }))
    );
  }

  return (
    <Spin size='large' spinning={loading}>
      <Row gutter={24} className='mb-3'>
        <Col span={12}>
          <Space size='large'>
            <RangePicker
              defaultValue={[moment(date_from), moment(date_to)]}
              onChange={handleDateRange}
            />
            {/* <DebounceSelect
              style={{ width: '200px' }}
              value={selectedShop}
              onClear={() => setSelectedShop(undefined)}
              onSelect={(value) => setSelectedShop(value)}
              fetchOptions={fetchUserShopList}
              placeholder={t('select.shop')}
            /> */}
          </Space>
        </Col>
      </Row>
      <Row gutter={24} className='report-products'>
        {performance?.map((item, key) => (
          <Col
            span={6}
            key={item.label}
            onClick={() => handleChart(item.value)}
          >
            <Card className={chart === item.value && 'active'}>
              <Row className='mb-5'>
                <Col>
                  <Text>{item.label}</Text>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={18}>
                  <Title level={2}>
                    {!item.price
                      ? reportData[item.qty]
                      : numberToPrice(
                          reportData[item.qty],
                          defaultCurrency?.symbol
                        )}
                  </Title>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
      <ReportChart reportData={reportData} chart_data='price_avg' />
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <Space className='d-flex justify-content-between'>
              <Text level={3}>Orders</Text>
              <Space className='d-flex justify-content-end'>
                {/* <Tag color='geekblue'>{t('compare')}</Tag> */}
                <FilterColumns columns={columns} setColumns={setColumns} />
              </Space>
            </Space>

            <Table
              columns={columns?.filter((item) => item.is_show)}
              dataSource={reportProducts?.data}
              rowKey={(row) => row.id}
              loading={loading}
              pagination={{
                pageSize: reportProducts?.per_page,
                page: reportProducts?.current_page || 1,
                total: reportProducts?.total,
                defaultCurrent: 1,
              }}
              onChange={onChangePagination}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default ReportOrder;
