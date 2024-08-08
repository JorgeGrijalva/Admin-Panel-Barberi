import { Card, Col, Row, Space, Table, Tag, Button, Select } from 'antd';
import React from 'react';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import ReportService from 'services/reports';
import { addMenu, disableRefetch } from 'redux/slices/menu';
import FilterColumns from 'components/filter-column';
import { fetchStockProduct } from 'redux/slices/report/stock';
import useDidUpdate from 'helpers/useDidUpdate';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ReportStock = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const options = [
    { value: null, label: 'All products', key: 'all_products' },
    { value: 'in_stock', label: 'In stock', key: 'in_stock' },
    { value: 'low_stock', label: 'Low stock', key: 'low_stock' },
    { value: 'out_of_stock', label: 'Out of stock', key: 'out_of_stock' },
  ];
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const { loading, productList: reportProducts } = useSelector(
    (state) => state.stockReport,
    shallowEqual,
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState(activeMenu?.data?.value || null);
  const goToProductReport = (row) => {
    dispatch(
      addMenu({
        url: `report/products`,
        id: 'report.products',
        name: t('report.products'),
      }),
    );
    navigate(`/report/products?product_id=${row.id}`);
  };

  const [columns, setColumns] = useState([
    {
      title: 'Product title',
      dataIndex: 'product_translation_title',
      key: 'product_translation_title',
      render: (_, data) => {
        return (
          <a onClick={() => goToProductReport(data)}>
            {data?.translation?.title}
          </a>
        );
      },
      is_show: true,
      sorter: (a, b) =>
        a?.translation?.title.localeCompare(b?.translation?.title),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, data) => <Tag key={data.id}>{data.status}</Tag>,
      is_show: true,
    },
    {
      title: 'Stock',
      key: 'stock',
      dataIndex: 'quantity',
      render: (_, data) => data?.stocks_sum_quantity,
      is_show: true,
      sorter: (a, b) => a?.stocks_sum_quantity - b?.stocks_sum_quantity,
    },
  ]);

  const params = {
    page: activeMenu.page,
    perPage: activeMenu.perPage,
    actual: status,
  };

  const fetchProduct = (params) => {
    dispatch(fetchStockProduct(params));
  };

  useDidUpdate(() => {
    fetchProduct(params);
  }, [status]);

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchProduct(params);
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onSelectChange = (newSelectedRowKeys) =>
    setSelectedRowKeys(newSelectedRowKeys);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onChangePagination = (pagination) => {
    const { pageSize: perPage, current: page } = pagination;
    fetchProduct({ page, perPage, actual: status });
  };

  const excelExport = () => {
    setDownloading(true);
    ReportService.getStocks({ export: 'excel', actual: status })
      .then((res) => {
        const body = res.data.link;
        if (body) {
          window.location.href = body;
        }
      })
      .finally(() => setDownloading(false));
  };

  const handleSelector = (e) => setStatus(e);

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <Card title={t('stock')}>
            <Space className='d-flex justify-content-end'>
              <Select
                style={{ width: '200px' }}
                onChange={handleSelector}
                options={options}
                defaultValue={activeMenu?.data || null}
              />
              <Button
                icon={<CloudDownloadOutlined />}
                loading={downloading}
                onClick={excelExport}
              >
                {t('download')}
              </Button>
              <FilterColumns columns={columns} setColumns={setColumns} />
            </Space>
            <Table
              scroll={{ x: true }}
              // rowSelection={rowSelection}
              columns={columns?.filter((item) => item.is_show)}
              dataSource={reportProducts.data || []}
              rowKey={(row) => row.id}
              loading={loading}
              pagination={{
                pageSize: reportProducts?.per_page,
                page: reportProducts?.current_page || 1,
                total: reportProducts?.total,
                defaultCurrent: 1,
              }}
              onChange={onChangePagination}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportStock;
