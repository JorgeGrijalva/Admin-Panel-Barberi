import React, { useState } from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Space, Spin } from 'antd';
import Meta from 'antd/lib/card/Meta';
import getImage from 'helpers/getImage';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addOrderCoupon,
  changeOrderedProductQuantity,
  clearOrderProducts,
  removeFromOrder,
  setOrderData,
  setOrderTotal,
  verifyOrderCoupon,
} from 'redux/slices/order';
import orderService from 'services/seller/order';
import ExtrasModal from './extrasModal';
import numberToPrice from 'helpers/numberToPrice';
import useDidUpdate from 'helpers/useDidUpdate';
import { useNavigate } from 'react-router-dom';
import { addMenu } from 'redux/slices/menu';
import { fetchSellerProducts } from 'redux/slices/product';
import { useTranslation } from 'react-i18next';
import invokableService from 'services/rest/invokable';
import { BsFillGiftFill } from 'react-icons/bs';
import { batch } from 'react-redux';
import QueryString from 'qs';

export default function OrderItems() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderItems, data, total, coupon } = useSelector(
    (state) => state.order,
    shallowEqual,
  );
  const [loading, setLoading] = useState(false);
  const [extrasModal, setExtrasModal] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponName, setCouponName] = useState('');
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  function formatProducts(list) {
    const result = list.map((item, index) => ({
      [`products[${index}][stock_id]`]: item?.stock?.id || item.id,
      [`products[${index}][quantity]`]: item.quantity,
    }));
    return Object.assign({}, ...result);
  }

  useDidUpdate(() => {
    dispatch(
      fetchSellerProducts({
        perPage: 12,
        currency_id: data.currency.id,
        status: 'published',
      }),
    );
  }, [data.currency]);

  useDidUpdate(() => {
    if (orderItems.length) {
      productCalculate();
    } else {
      dispatch(clearOrderProducts());
    }
  }, [orderItems, data.currency]);

  function productCalculate() {
    const products = formatProducts(orderItems);
    const params = QueryString.stringify(
      {
        currency_id: data.currency.id,
        ...products,
      },
      { addQueryPrefix: true },
    );
    setLoading(true);
    orderService
      .calculate(params)
      .then(({ data }) => {
        const orderData = {
          product_total: data?.price,
          order_tax: data?.total_tax,
          order_total: data?.total_price,
          service_fee: data?.service_fee,
          coupon_price: data?.coupon_price,
          total_discount: data?.total_discount,
        };
        dispatch(setOrderTotal(orderData));
      })
      .finally(() => setLoading(false));
  }

  const goToProduct = (item) => {
    dispatch(
      addMenu({
        id: `product-${item.uuid}`,
        url: `seller/product/${item.uuid}`,
        name: 'Product edit',
      }),
    );
    navigate(`/seller/product/${item.uuid}`);
  };

  function handleCheckCoupon(shopId) {
    if (!couponName) return;

    setLoadingCoupon(true);
    invokableService
      .checkCoupon({ coupon: couponName })
      .then((res) => {
        const coupon = res.data;
        batch(() => {
          dispatch(setOrderData({ coupon }));
          dispatch(
            verifyOrderCoupon({
              price: res.data.price,
              verified: true,
            }),
          );
        });
      })
      .catch(() =>
        dispatch(
          verifyOrderCoupon({
            price: 0,
            verified: false,
          }),
        ),
      )
      .finally(() => setLoadingCoupon(false));
  }

  const handleChangeProductQuantity = (quantity, id) => {
    dispatch(changeOrderedProductQuantity({ quantity, id }));
  };

  return (
    <div className='order-items'>
      {loading && (
        <div className='loader'>
          <Spin />
        </div>
      )}
      <Row gutter={24} className='mt-4'>
        <Col span={24}>
          <Card className='shop-card'>
            {orderItems?.map((item, index) =>
              item?.bonus === undefined || item?.bonus === false ? (
                <div>
                  <Card className='position-relative'>
                    <CloseOutlined
                      className='close-order'
                      onClick={() => dispatch(removeFromOrder(item))}
                    />
                    <Space className='mr-3'>
                      <div
                        className='order-item-img'
                        style={{ marginRight: '20px' }}
                      >
                        <img
                          src={getImage(item?.stock?.product?.img || item?.img)}
                          alt={item?.stock?.product?.translation?.title}
                        />
                      </div>
                      <Meta
                        title={
                          <div>
                            <Space>
                              <div
                                className='cursor-pointer white-space-wrap'
                                onClick={() => goToProduct(item)}
                              >
                                {item?.stock?.product?.translation?.title ||
                                  item?.translation?.title}
                              </div>
                              <Button
                                icon={<EditOutlined />}
                                type='text'
                                size='small'
                                onClick={() => setExtrasModal(item)}
                              />
                            </Space>
                            <div className='product-price'>
                              {numberToPrice(
                                item?.price * item?.quantity,
                                data?.currency?.symbol,
                              )}
                            </div>
                          </div>
                        }
                        description={
                          <>
                            <Space>
                              <Button
                                disabled={
                                  item?.quantity <
                                    item?.stock?.product?.min_qty + 1 ||
                                  item?.quantity === 1
                                }
                                onClick={() =>
                                  handleChangeProductQuantity(
                                    item.quantity - 1,
                                    item.id,
                                  )
                                }
                                type='primary'
                                icon={<MinusOutlined />}
                              />{' '}
                              <span>
                                {item?.quantity * (item?.interval || 1)}
                                {item?.unit?.translation?.title}
                              </span>
                              <Button
                                onClick={() =>
                                  handleChangeProductQuantity(
                                    item.quantity + 1,
                                    item.id,
                                  )
                                }
                                type='primary'
                                disabled={item?.quantity === item?.max_qty}
                                icon={<PlusOutlined />}
                              />
                            </Space>
                            <div className='mt-2'>
                              <Space wrap>
                                {item?.addons?.map((addon) => (
                                  <span
                                    key={addon.id}
                                    className='extras-text rounded'
                                  >
                                    {addon?.stock?.product?.translation
                                      ?.title ||
                                      addon?.product.translation?.title}{' '}
                                    x {addon?.quantity}
                                  </span>
                                ))}
                              </Space>
                            </div>
                          </>
                        }
                      />
                    </Space>
                  </Card>
                </div>
              ) : (
                <div key={index}>
                  <div>
                    <Card className='position-relative'>
                      <Space className='mr-3 w-100 justify-content-between align-items-start'>
                        <Space>
                          <div className='order-item-img'>
                            <img
                              src={getImage(item?.img)}
                              alt={item.translation?.title}
                            />
                          </div>
                          <Meta
                            title={
                              <div>
                                <div
                                  className='cursor-pointer white-space-wrap'
                                  onClick={() => goToProduct(item)}
                                >
                                  {item.translation?.title}
                                </div>
                                <div className='product-price'>
                                  {numberToPrice(
                                    item.price,
                                    data.currency?.symbol,
                                  )}
                                </div>
                              </div>
                            }
                          />
                        </Space>
                        <div className='bonus'>
                          <BsFillGiftFill /> Bonus
                        </div>
                      </Space>
                    </Card>
                  </div>
                </div>
              ),
            )}

            <div className='d-flex align-items-center justify-content-between'>
              <Space>
                <img
                  src={getImage(activeMenu.data?.shop?.logo_img)}
                  alt='logo'
                  width={40}
                  height={40}
                  className='rounded-circle'
                />
                <div>{activeMenu.data?.shop?.translation?.title}</div>
              </Space>
              <Space>
                <Input
                  placeholder={t('coupon')}
                  addonAfter={
                    coupon.verified ? (
                      <CheckOutlined style={{ color: '#18a695' }} />
                    ) : null
                  }
                  defaultValue={coupon.coupon}
                  onBlur={(event) =>
                    dispatch(
                      addOrderCoupon({
                        coupon: event.target.value,
                        user_id: data.user?.value,
                        shop_id: data.shop?.value,
                        verified: false,
                      }),
                    )
                  }
                  onChange={(event) => setCouponName(event.target.value)}
                />
                <Button
                  onClick={() => handleCheckCoupon()}
                  loading={loadingCoupon}
                  disabled={!couponName.length}
                >
                  {t('check.coupon')}
                </Button>
              </Space>

              <div className='mt-2 text-right shop-total'>
                <Space>
                  <p className='font-weight-bold'>{t('products')}:</p>
                  <p>
                    {numberToPrice(total.product_total, data.currency?.symbol)}
                  </p>
                </Space>
                <div />
                <Space>
                  <p className='font-weight-bold'>{t('shop.tax')}:</p>
                  <p>{numberToPrice(total.shop_tax, data.currency?.symbol)}</p>
                </Space>
                <div />
                <Space>
                  <p className='font-weight-bold'>{t('delivery.fee')}:</p>
                  <p>
                    {numberToPrice(
                      total.delivery_fee?.reduce((acc, curr) => acc + curr, 0),
                      data.currency?.symbol,
                    )}
                  </p>
                </Space>
                <div />
                <Space>
                  <p className='font-weight-bold'>{t('discount')}:</p>
                  <p>-{numberToPrice(total.discount, data.currency?.symbol)}</p>
                </Space>
                <div />
                <Space>
                  <p className='font-weight-bold'>{t('coupon')}:</p>
                  <p>
                    -
                    {numberToPrice(
                      total.coupon?.reduce((acc, curr) => acc + curr, 0),
                      data.currency?.symbol,
                    )}
                  </p>
                </Space>
                <div />
                <Space>
                  <p className='font-weight-bold'>{t('service.fee')}:</p>
                  <p>
                    {numberToPrice(total?.service_fee, data.currency?.symbol)}
                  </p>
                </Space>
                <div />
                <Space>
                  <p className='font-weight-bold'>{t('total')}:</p>
                  <p>
                    {numberToPrice(total.order_total, data.currency?.symbol)}
                  </p>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      {extrasModal && (
        <ExtrasModal
          extrasModal={extrasModal}
          setExtrasModal={setExtrasModal}
        />
      )}
    </div>
  );
}
