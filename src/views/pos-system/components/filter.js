import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import shopService from 'services/shop';
import brandService from 'services/brand';
import categoryService from 'services/category';
import useDidUpdate from 'helpers/useDidUpdate';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchRestProducts } from 'redux/slices/product';
import SearchInput from 'components/search-input';
import { useTranslation } from 'react-i18next';
import { setCartData, setProductsParams } from 'redux/slices/cart';
import { fetchRestPayments } from 'redux/slices/payment';
import { disableRefetch } from 'redux/slices/menu';
import { InfiniteSelect } from 'components/infinite-select';

const Filter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { currentBag, productsParams } = useSelector(
    (state) => state.cart,
    shallowEqual,
  );

  const [search, setSearch] = useState(productsParams?.search);
  const [shop, setShop] = useState(productsParams?.shop);
  const [category, setCategory] = useState(productsParams?.category);
  const [brand, setBrand] = useState(productsParams?.brand);
  const [links, setLinks] = useState(null);

  useEffect(() => {
    setSearch(productsParams?.search);
    setShop(productsParams?.shop);
    setCategory(productsParams?.category);
    setBrand(productsParams?.brand);
    setLinks(null);
  }, [productsParams]);

  const params = {
    ...productsParams,
    search,
    active: 1,
    status: 'published',
    page: 1,
    perPage: 12,
  };

  async function fetchUserShop({ search, page }) {
    const params = { search, page, status: 'approved' };
    return shopService.search(params).then((res) => {
      setLinks(res?.links);
      return res.data.map((item) => ({
        label: item?.translation?.title ?? 'no name',
        value: item?.id,
        key: item?.id,
      }));
    });
  }

  async function fetchUserBrand({ search, page = 1 }) {
    const params = { search, page };
    return brandService.search(params).then((res) => {
      setLinks(res?.links);
      return res.data.map((item) => ({
        label: item?.title ?? 'no name',
        value: item?.id,
        key: item?.id,
      }));
    });
  }

  async function fetchUserCategory({ search, page }) {
    const params = { search, page, type: 'main' };
    return categoryService.search(params).then((res) => {
      setLinks(res?.links);
      return res.data.map((item) => ({
        label: item?.translation?.title ?? 'no name',
        value: item?.id,
        key: item?.id,
      }));
    });
  }

  useDidUpdate(() => {
    batch(() => {
      dispatch(setProductsParams({ search }));
      dispatch(fetchRestProducts(params));
    });
  }, [brand, category, search, shop]);

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchRestPayments(params));
        dispatch(setCartData({ bag_id: currentBag }));
        dispatch(fetchRestProducts(params));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  return (
    <Card>
      <Row gutter={12}>
        <Col span={6}>
          <SearchInput
            className='w-100'
            placeholder={t('search')}
            handleChange={setSearch}
          />
        </Col>
        <Col span={6}>
          <InfiniteSelect
            className='w-100'
            hasMore={links?.next}
            debounceTimeout={500}
            placeholder={t('select.shop')}
            fetchOptions={fetchUserShop}
            onChange={(value) => {
              setShop(value);
              dispatch(
                setProductsParams({ shop_id: value?.value, shop: value }),
              );
            }}
            value={shop}
          />
        </Col>
        <Col span={6}>
          <InfiniteSelect
            className='w-100'
            hasMore={links?.next}
            allowClear
            placeholder={t('select.category')}
            fetchOptions={fetchUserCategory}
            onChange={(value) => {
              setCategory(value);
              dispatch(
                setProductsParams({
                  category_id: value?.value,
                  category: value,
                }),
              );
            }}
            value={category}
          />
        </Col>
        <Col span={6}>
          <InfiniteSelect
            hasMore={links?.next}
            className='w-100'
            placeholder={t('select.brand')}
            fetchOptions={fetchUserBrand}
            onChange={(value) => {
              setBrand(value);
              dispatch(
                setProductsParams({ brand_id: value?.value, brand: value }),
              );
            }}
            value={brand}
            allowClear
          />
        </Col>
      </Row>
    </Card>
  );
};
export default Filter;
