import { Card, Image, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import numberToPrice from '../../helpers/numberToPrice';
import { addMenu } from '../../redux/slices/menu';
import orderService from '../../services/order';

const UserTopProducts = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const fetchTopProducts = (params) => {
    setLoading(true);
    orderService
      .getUserTopProducts(id, params)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  const goToProduct = (row) => {
    dispatch(
      addMenu({
        id: `product-edit`,
        url: `product/${row.uuid}`,
        name: t('edit.product'),
      }),
    );
    navigate(`/product/${row.uuid}`);
  };

  useEffect(() => {
    fetchTopProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title={t('top.products')}>
      <Table
        loading={loading}
        dataSource={data?.data}
        pagination={{
          total: data?.total,
          current: data?.current_page,
          pageSize: data?.per_page,
        }}
        columns={[
          {
            title: t('product'),
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
              <Space>
                <Image
                  width={100}
                  src={stock?.product?.img}
                  placeholder
                  style={{ borderRadius: 4 }}
                />
                <div
                  onClick={() => goToProduct(stock?.product)}
                  className='text-hover'
                >
                  {stock?.product?.translation?.title}
                </div>
              </Space>
            ),
          },
          {
            title: t('count'),
            dataIndex: 'count',
            key: 'count',
          },
          {
            title: t('total.price'),
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
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            render: (_, row) => (
              <Tag>
                {row.stock?.product?.active ? t('active') : t('inactive')}
              </Tag>
            ),
          },
        ]}
        onChange={(pagination) =>
          fetchTopProducts({
            page: pagination?.current,
            perPage: pagination?.pageSize,
          })
        }
      />
    </Card>
  );
};

export default UserTopProducts;
