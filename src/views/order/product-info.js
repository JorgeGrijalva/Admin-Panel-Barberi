import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Space, Spin } from 'antd';
import brandService from 'services/brand';
import categoryService from 'services/category';
import Meta from 'antd/lib/card/Meta';
import getImage from 'helpers/getImage';
import { PlusOutlined } from '@ant-design/icons';
import OrderItems from './orderItems';
import { DebounceSelect } from 'components/search';
import SearchInput from 'components/search-input';
import ExtrasModal from './extrasModal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchRestProducts } from '../../redux/slices/product';
import { useTranslation } from 'react-i18next';
import shopService from 'services/shop';
import { clearOrderItems, setCurrentShop } from 'redux/slices/order';
import { useParams } from 'react-router-dom';
import { BsFillGiftFill } from 'react-icons/bs';
import RiveResult from 'components/rive-result';

const ProductInfo = ({ form }) => {
  const { t } = useTranslation();
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState(null);
  const [extrasModal, setExtrasModal] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.order, shallowEqual);
  const { products, loading } = useSelector(
    (state) => state.product,
    shallowEqual,
  );

  useEffect(() => {
    const params = {
      perPage: 10,
      page: 1,
      brand_id: brand?.value,
      category_id: category?.value,
      search,
      shop_id: data.shop?.value,
      active: 1,
    };
    dispatch(fetchRestProducts(params));
  }, [brand, category, search, data.shop]);

  async function fetchBrands(search) {
    return brandService.search(search).then(({ data }) =>
      data.map((item) => ({
        label: item?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  }

  async function fetchCategories(search) {
    const params = { search, type: 'main' };
    return categoryService.search(params).then(({ data }) =>
      data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  }

  const addProductToCart = (item) => {
    if (!data.currency) {
      toast.warning(t('please.select.currency'));
      return;
    }
    if (!data.address) {
      toast.warning(t('please.select.address'));
      return;
    }
    if (!data.deliveries) {
      toast.warning(t('please.select.delivery'));
      return;
    }
    setExtrasModal(item);
  };

  async function fetchShops(search) {
    const params = { search, status: 'approved' };
    return shopService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  }

  const selectShop = (value) => {
    dispatch(setCurrentShop(value));
    dispatch(clearOrderItems());
    form.setFieldsValue({
      delivery: null,
      delivery_date: null,
      delivery_time: null,
    });
  };

  return (
    <Card
      title={t('order.details')}
      extra={
        <Space wrap>
          <DebounceSelect
            placeholder={t('select.shop')}
            fetchOptions={fetchShops}
            style={{ minWidth: 150 }}
            onChange={selectShop}
            allowClear={false}
            value={data?.shop}
            disabled={id}
          />
          <DebounceSelect
            placeholder={t('select.category')}
            fetchOptions={fetchCategories}
            style={{ minWidth: 150 }}
            onChange={(value) => setCategory(value)}
            value={category}
          />
          <DebounceSelect
            placeholder={t('select.brand')}
            fetchOptions={fetchBrands}
            style={{ minWidth: 150 }}
            onChange={(value) => setBrand(value)}
            value={brand}
          />
        </Space>
      }
    >
      <div className='d-flex justify-content-end mb-4'>
        <SearchInput
          placeholder={t('search')}
          handleChange={setSearch}
          defaultValue={search?.search}
        />
      </div>
      <div className='products-row order-items'>
        {products.length ? (
          products.map((item) => (
            <Card
              className='products-col'
              key={item.id}
              cover={
                <img
                  alt={item.product?.translation?.title}
                  src={getImage(item?.img)}
                />
              }
              onClick={() => addProductToCart(item)}
            >
              <Meta title={item?.product?.translation?.title} />
              <div className='preview'>
                <PlusOutlined />
              </div>
              {item.stocks.map((it) => (
                <span className={it.bonus ? 'show-bonus' : 'd-none'}>
                  <BsFillGiftFill /> {it.bonus?.value}
                  {'+'}
                  {it.bonus?.bonus_quantity}
                </span>
              ))}
            </Card>
          ))
        ) : (
          <Row>
            <Col span={24}>
              <RiveResult id='nosell' />
            </Col>
          </Row>
        )}
        {loading && (
          <div className='loader'>
            <Spin />
          </div>
        )}
      </div>
      {extrasModal && (
        <ExtrasModal
          extrasModal={extrasModal}
          setExtrasModal={setExtrasModal}
        />
      )}

      <OrderItems form={form} />
    </Card>
  );
};

export default ProductInfo;
