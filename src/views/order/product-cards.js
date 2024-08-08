import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Space, Spin } from 'antd';
import RiveResult from 'components/rive-result';
import getImage from 'helpers/getImage';
import Meta from 'antd/es/card/Meta';
import { PlusOutlined } from '@ant-design/icons';
import { fetchRestProducts } from 'redux/slices/product';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DebounceSelect } from 'components/search';
import shopService from 'services/shop';
import categoryService from 'services/category';
import brandService from 'services/brand';
import SearchInput from 'components/search-input';
import ProductModal from './product-modal';

export default function ProductCards() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { products, loading } = useSelector(
    (state) => state.product,
    shallowEqual,
  );

  const [search, setSearch] = useState(null);
  const [shop, setShop] = useState(null);
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [productModal, setProductModal] = useState(null);

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

  async function fetchBrands(search) {
    return brandService.search(search).then(({ data }) =>
      data.map((item) => ({
        label: item?.title ?? '--',
        value: item?.id,
        key: item?.id,
      })),
    );
  }

  useEffect(() => {
    const params = {
      perPage: 10,
      page: 1,
      brand_id: brand?.value,
      category_id: category?.value,
      search,
      shop_id: shop?.value,
      active: 1,
    };
    dispatch(fetchRestProducts(params));
  }, [brand, category, search, shop]);

  return (
    <>
      <Card title={t('products')} className={'order-add'}>
        <Space wrap className={'mb-4'}>
          <SearchInput
            placeholder={t('search')}
            handleChange={(value) => setSearch(value)}
            defaultValue={search}
          />
          <DebounceSelect
            placeholder={t('select.shop')}
            fetchOptions={fetchShops}
            style={{ minWidth: 150 }}
            onChange={(value) => setShop(value)}
            value={shop}
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
        {products.length === 0 ? (
          <Col span={24}>
            <RiveResult id='nosell' />
          </Col>
        ) : (
          <div className='products-row order-items'>
            {products.length ? (
              products.map((item) => (
                <Card
                  className='products-col'
                  key={item.id}
                  cover={
                    <img
                      alt={item?.translation?.title}
                      src={getImage(item?.img)}
                    />
                  }
                  onClick={() => setProductModal(item)}
                >
                  <Meta title={item?.translation?.title} />
                  <div className='preview'>
                    <PlusOutlined />
                  </div>
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
        )}
      </Card>
      {productModal && (
        <ProductModal
          productData={productModal}
          setProductData={setProductModal}
        />
      )}
    </>
  );
}
