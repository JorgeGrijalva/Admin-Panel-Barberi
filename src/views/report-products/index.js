import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Table,
  Button,
  DatePicker,
  Spin,
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import SearchInput from 'components/search-input';
import { CloudDownloadOutlined } from '@ant-design/icons';
import ReportService from 'services/reports';
import { disableRefetch } from 'redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ReportChart from 'components/report/chart';
import moment from 'moment';
import { ReportContext } from 'context/report';
import FilterColumns from 'components/filter-column';
import { export_url } from 'configs/app-global';
import {
  clearCompare,
  fetchReportProduct,
  fetchReportProductChart,
  ReportProductCompare,
} from 'redux/slices/report/products';
import useDidUpdate from 'helpers/useDidUpdate';
import { useLocation, useNavigate } from 'react-router-dom';
import QueryString from 'qs';
import { t } from 'i18next';
import numberToPrice from 'helpers/numberToPrice';
import { useMemo } from 'react';
import shopService from 'services/shop';
import { DebounceSelect } from 'components/search';
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const ReportProducts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const category_id = QueryString.parse(location.search, [])['?category_id'];
  const product_id = QueryString.parse(location.search, [])['?product_id'];
  const [shopId, setShopId] = useState();
  const { date_from, date_to, by_time, chart, handleChart, handleDateRange } =
    useContext(ReportContext);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const {
    loading,
    chartData: reportData,
    productList,
  } = useSelector((state) => state.productReport, shallowEqual);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [search, setSearch] = useState('');
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const [columns, setColumns] = useState([
    {
      title: t('product.title'),
      dataIndex: 'title',
      key: 'title',
      is_show: true,
      render: (title) => {
        return title;
      },
      sorter: (a, b) =>
        a?.translation?.title.localeCompare(b?.translation?.title),
    },
    {
      title: t('orders'),
      dataIndex: 'count',
      key: 'count',
      is_show: true,
    },
    {
      title: t('item.sold'),
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      is_show: true,
    },
    {
      title: t('total.price'),
      dataIndex: 'total_price',
      key: 'total_price',
      is_show: true,
      render: (total_price) =>
        numberToPrice(
          total_price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
      sorter: (a, b) => a.total_price - b.total_price,
    },
  ]);

  const chart_type = useMemo(
    () => [
      {
        label: 'item.sold',
        value: 'quantity',
        qty: 'quantity',
        price: false,
      },
      { label: 'net.sales', value: 'price', qty: 'price', price: true },
      { label: 'orders', value: 'count', qty: 'count', price: false },
    ],
    [],
  );

  const fetchReport = () => {
    const params = {
      date_from,
      date_to,
      type: by_time,
      chart,
    };
    if (category_id) params.categories = [category_id];
    if (product_id) params.products = [product_id];
    if (chart_type.find((item) => item.value === chart)) {
      dispatch(fetchReportProductChart(params));
    }
  };

  const fetchShops = (search) => {
    const params = {
      perPage: 10,
      search,
    };
    return shopService
      .selectPaginate(params)
      .then((res) =>
        res?.map((shop) => ({
          label: shop?.translation?.title,
          value: shop?.id,
        })),
      )
      .catch((err) => console.log('report product ERROR => ', err));
  };

  const fetchProduct = (page, perPage) => {
    const params = {
      date_from,
      date_to,
      type: by_time,
      page,
      perPage,
      search: search || null,
    };
    if (category_id) params.categories = [category_id];
    if (product_id) params.products = [product_id];
    if (shopId) params.shop_id = shopId;
    dispatch(fetchReportProduct(params));
  };

  useEffect(() => {
    handleChart(chart_type[0].value);
  }, []);

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchProduct();
      fetchReport();
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    fetchProduct();
  }, [date_to, search, category_id, product_id, by_time, date_from, shopId]);

  useDidUpdate(() => {
    fetchReport();
  }, [date_to, by_time, chart, category_id, product_id, date_from]);

  const onChangePagination = (pagination) => {
    const { pageSize: perPage, current: page } = pagination;
    fetchProduct(page, perPage);
  };

  const excelExport = () => {
    setDownloading(true);
    ReportService.getReportProductList({
      date_from,
      date_to,
      type: by_time,
      export: 'excel',
      shop_id: shopId,
      products: rowSelection?.selectedRowKeys[0]
        ? rowSelection?.selectedRowKeys
        : product_id
        ? [product_id]
        : undefined,
    })
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownloading(false));
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const Compare = () => {
    const params = {
      date_from,
      date_to,
      type: by_time,
      chart,
      ids: selectedRowKeys,
      shop_id: shopId,
    };

    dispatch(ReportProductCompare(params));
  };

  const clear = () => {
    dispatch(clearCompare());
    setShopId(undefined);
    setSelectedRowKeys([]);
    fetchProduct();
    fetchReport();
    navigate(`/report/products`);
  };

  const onShopSelectClear = () => {
    setShopId(undefined);
    fetchReportProduct();
    fetchReportProductChart({});
  };
  return (
    <Spin size='large' spinning={loading}>
      <Row gutter={24} className='mb-3'>
        <Col span={12}>
          <Space>
            <RangePicker
              defaultValue={[moment(date_from), moment(date_to)]}
              onChange={handleDateRange}
            />
          </Space>
        </Col>
      </Row>
      <Row gutter={24} className='report-products'>
        {chart_type?.map((item) => (
          <Col
            span={8}
            key={item.label}
            onClick={() => handleChart(item.value)}
          >
            <Card className={chart === item.value && 'active'}>
              <Row className='mb-5'>
                <Col>
                  <Text>{t(item.label)}</Text>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Title level={2}>
                    {!item?.price
                      ? reportData[item.qty]
                      : numberToPrice(
                          reportData[item.qty],
                          defaultCurrency?.symbol,
                          defaultCurrency?.position,
                        )}
                  </Title>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
      <ReportChart reportData={reportData} chart_data='quantities_sum' />
      <Card>
        <Space className='d-flex justify-content-between align-center'>
          <Typography.Text strong level={3}>
            {t('products')}
          </Typography.Text>
          <Space className='d-flex justify-content-between'>
            <SearchInput
              style={{ minWidth: '300px' }}
              handleChange={(e) => setSearch(e)}
            />
            <DebounceSelect
              fetchOptions={fetchShops}
              placeholder={t('select.shop')}
              onSelect={(value) => setShopId(value.value)}
              onClear={() => onShopSelectClear()}
            />
            <Button
              type={
                Boolean(selectedRowKeys.length) ||
                !!category_id ||
                !!product_id ||
                !!shopId
                  ? 'primary'
                  : 'default'
              }
              danger={
                Boolean(selectedRowKeys.length) ||
                !!category_id ||
                !!product_id ||
                !!shopId
              }
              onClick={clear}
            >
              {t('clear')}
            </Button>
            <Button
              icon={<CloudDownloadOutlined />}
              loading={downloading}
              onClick={excelExport}
            >
              {t('download')}
            </Button>
            <FilterColumns columns={columns} setColumns={setColumns} />
          </Space>
        </Space>

        <Table
          // rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={Array.isArray(productList?.data) ? productList?.data : []}
          rowKey={(row) => row.id}
          loading={loading}
          pagination={{
            pageSize: 10,
            page: productList?.page || 1,
            total: productList?.total,
            defaultCurrent: 1,
          }}
          onChange={onChangePagination}
          scroll={{
            x: 1500,
          }}
        />
      </Card>
    </Spin>
  );
};

export default ReportProducts;
