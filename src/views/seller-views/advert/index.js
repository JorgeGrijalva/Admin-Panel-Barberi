import React, { useEffect, useState } from 'react';
import { Button, Table, Card, Space, Form } from 'antd';
import { fetchSellerAdverts, fetchShopAdverts } from 'redux/slices/advert';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SearchInput from 'components/search-input';
import FilterColumns from 'components/filter-column';
import { addMenu, disableRefetch } from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';
import numberToPrice from 'helpers/numberToPrice';
import advertService from 'services/seller/advert';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { EyeFilled } from '@ant-design/icons';
import AdDetail from './ad-detail';
import AssignProduct from './assign-product';
export default function Advert() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [isAddProduct, setIsAddProduct] = useState(null);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const {
    advertList,
    loading: listLoading,
    meta,
  } = useSelector((state) => state.advert, shallowEqual);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurchase = ({ product_ids, ads_package_id }) => {
    setLoading(true);
    advertService
      .create({ ads_package_id, product_ids })
      .then(() => {
        toast.success(t('assigned.successfully'));
        form.resetFields();
        // dispatch(
        //   addMenu({
        //     id: 'shop_ads',
        //     url: 'seller/shop-ads',
        //     name: t('ads'),
        //   })
        // );
        // dispatch(fetchShopAdverts());
        // navigate('/seller/shop-ads');
      })
      .finally(() => {
        setLoading(false);
        setIsAddProduct(null);
      });
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('title'),
      dataIndex: 'title',
      is_show: true,
      render: (_, row) => {
        return <span>{row?.translation?.title}</span>;
      },
    },
    {
      title: t('price'),
      dataIndex: 'price',
      is_show: true,
      render: (price) => numberToPrice(price),
    },

    {
      title: t('time'),
      dataIndex: 'time',
      is_show: true,
      render: (time, row) => (
        <span>
          {time} {row.time_type}
        </span>
      ),
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button icon={<EyeFilled />} onClick={() => setId(row.id)} />
            <Button
              onClick={() => setIsAddProduct(row.id)}
              // onClick={() => handlePurchase(row.id)}
              loading={loading}
            >
              {t('assign')}
            </Button>
          </Space>
        );
      },
    },
  ]);

  const paramsData = {
    perPage: 10,
    page: 1,
    active: 1,
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerAdverts(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      search,
    };
    dispatch(fetchSellerAdverts(paramsData));
  }, [activeMenu.data, search]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchSellerAdverts({ perPage: pageSize, page: current }));
  };

  return (
    <>
      <Card className='p-o'>
        <div className='flex justify-content-between'>
          <SearchInput
            style={{ maxWidth: '200px' }}
            handleChange={(value) => setSearch(value)}
            placeholder={t('search')}
          />
          <div className='flex gap-3'>
            <FilterColumns columns={columns} setColumns={setColumns} />
          </div>
        </div>
      </Card>
      <Card>
        <Table
          scroll={{ x: true }}
          dataSource={advertList}
          columns={columns?.filter((item) => item.is_show)}
          rowKey={(record) => record.id}
          loading={listLoading || loading}
          pagination={{
            pageSize: meta.per_page,
            page: meta.current_page,
            total: meta.total,
          }}
          onChange={onChangePagination}
        />
      </Card>
      <AdDetail id={id} onClose={() => setId(null)} />
      <AssignProduct
        id={isAddProduct}
        onClose={() => setIsAddProduct(null)}
        handlePurchase={handlePurchase}
        loading={loading}
        form={form}
      />
    </>
  );
}
