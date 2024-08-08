import React, { useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Input, Row, Space, Spin } from 'antd';
import Meta from 'antd/lib/card/Meta';
import getImage from '../../../helpers/getImage';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addOrderCoupon,
  clearOrderProducts,
  removeFromOrder,
  setOrderTotal,
  verifyOrderCoupon,
} from '../../../redux/slices/order';
import orderService from '../../../services/waiter/order';
import calculateTotalPrice from '../../../helpers/calculateTotalPrice';
import ExtrasModal from './extrasModal';
import numberToPrice from '../../../helpers/numberToPrice';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { useNavigate } from 'react-router-dom';
import { addMenu } from '../../../redux/slices/menu';
import { fetchSellerProducts } from '../../../redux/slices/product';
import { useTranslation } from 'react-i18next';
import invokableService from '../../../services/rest/invokable';
import { calculateTotalWithDeliveryPrice } from '../../../redux/selectors/orderSelector';

export default function OrderItems() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderItems, data, orderShops, total, coupons } = useSelector(
    (state) => state.order,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [extrasModal, setExtrasModal] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(null);

  function formatProducts(list) {
    const result = list.map((item, index) => ({
      [`products[${index}][id]`]: item.id,
      [`products[${index}][quantity]`]: item.quantity,
    }));
    return Object.assign({}, ...result);
  }

  useDidUpdate(() => {
    dispatch(
      fetchSellerProducts({ perPage: 12, currency_id: data.currency.id })
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
    const params = {
      currency_id: data.currency.id,
      ...products,
    };
    setLoading(true);
    orderService
      .calculate(params)
      .then(({ data }) => {
        const items = data.products.map((item) => ({
          ...orderItems.find((el) => el.id === item.id),
          ...item,
        }));
        dispatch(setOrderTotal(items));
        const orderData = {
          product_total: data.product_total,
          product_tax: data.product_tax,
          order_tax: data.order_tax,
          order_total: data.order_total,
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
      })
    );
    navigate(`/seller/product/${item.uuid}`);
  };

  function handleCheckCoupon(shopId) {
    let coupon = coupons.find((item) => item.shop_id === shopId);
    if (!coupon) {
      return;
    }
    setLoadingCoupon(shopId);
    invokableService
      .checkCoupon(coupon)
      .then((res) =>
        dispatch(
          verifyOrderCoupon({
            shop_id: shopId,
            price: res.data.price,
            verified: true,
          })
        )
      )
      .catch(() =>
        dispatch(
          verifyOrderCoupon({
            shop_id: shopId,
            price: 0,
            verified: false,
          })
        )
      )
      .finally(() => setLoadingCoupon(null));
  }

  return (
    <div className='order-items'>
      {loading && (
        <div className='loader'>
          <Spin />
        </div>
      )}
      <Row gutter={24} className='mt-4'>
        <Col span={24}>
          {orderShops.map((shop) => (
            <Card key={shop.uuid} className='shop-card'>
              {shop.products.map((item) => (
                <Card key={item.id} className='position-relative'>
                  <CloseOutlined
                    className='close-order'
                    onClick={() => dispatch(removeFromOrder(item))}
                  />
                  <Space className='mr-3'>
                    <div className='order-item-img'>
                      <img
                        src={getImage(item.img)}
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
                              item.price_without_tax,
                              data.currency.symbol
                            )}
                          </div>
                        </div>
                      }
                      description={
                        <>
                          <div>Quantity: {item.quantity}</div>
                          <Space className='mt-2'>
                            {item.stock.extras.map((el) => {
                              if (el.group.type === 'color') {
                                return (
                                  <span
                                    className='extras-color'
                                    style={{ backgroundColor: el.value }}
                                  />
                                );
                              } else if (el.group.type === 'text') {
                                return (
                                  <span className='extras-text rounded'>
                                    {el.value}
                                  </span>
                                );
                              }
                              return (
                                <img
                                  src={getImage(el.value)}
                                  alt='extra'
                                  className='extras-image rounded'
                                />
                              );
                            })}
                          </Space>
                        </>
                      }
                    />
                  </Space>
                </Card>
              ))}
              <div className='d-flex align-items-center justify-content-between'>
                <Space>
                  <img
                    src={getImage(shop.logo_img)}
                    alt='shop logo'
                    width={40}
                    className='rounded-circle'
                  />
                  <div>{shop.translation?.title}</div>
                </Space>
                <Space>
                  <Input
                    placeholder={t('coupon')}
                    addonAfter={
                      coupons.find((el) => el.shop_id === shop.id)?.verified ? (
                        <CheckOutlined style={{ color: '#18a695' }} />
                      ) : null
                    }
                    defaultValue={
                      coupons.find((el) => el.shop_id === shop.id)?.coupon
                    }
                    onBlur={(event) =>
                      dispatch(
                        addOrderCoupon({
                          coupon: event.target.value,
                          user_id: data.user?.value,
                          shop_id: shop.id,
                          verified: false,
                        })
                      )
                    }
                  />
                  <Button
                    onClick={() => handleCheckCoupon(shop.id)}
                    loading={loadingCoupon === shop.id}
                  >
                    {t('check.coupon')}
                  </Button>
                </Space>
                <div className='mt-2 text-right shop-total'>
                  <Space>
                    <p className='font-weight-bold'>Product tax:</p>
                    <p>
                      {numberToPrice(
                        calculateTotalPrice(shop).productTax,
                        data.currency?.symbol
                      )}
                    </p>
                  </Space>
                  <div />
                  <Space>
                    <p className='font-weight-bold'>Shop tax:</p>
                    <p>
                      {numberToPrice(
                        calculateTotalPrice(shop).shopTax,
                        data.currency?.symbol
                      )}
                    </p>
                  </Space>
                  <div />
                  <Space>
                    <p className='font-weight-bold'>Delivery fee:</p>
                    <p>
                      {numberToPrice(
                        calculateTotalPrice(shop, data.deliveries).deliveryFee,
                        data.currency?.symbol
                      )}
                    </p>
                  </Space>
                  <div />
                  <Space>
                    <p className='font-weight-bold'>Total:</p>
                    <p>
                      {numberToPrice(
                        calculateTotalPrice(shop, data.deliveries).total,
                        data.currency?.symbol
                      )}
                    </p>
                  </Space>
                </div>
              </div>
            </Card>
          ))}
        </Col>
        <Col span={24}>
          <div className='order-info'>
            <Descriptions bordered className='order-info-container'>
              <Descriptions.Item label='Product total'>
                {numberToPrice(total.product_total, data.currency?.symbol)}
              </Descriptions.Item>
              <Descriptions.Item label='Product tax'>
                {numberToPrice(total.product_tax, data.currency?.symbol)}
              </Descriptions.Item>
              <Descriptions.Item label='Shop tax'>
                {numberToPrice(total.order_tax, data.currency?.symbol)}
              </Descriptions.Item>
              <Descriptions.Item
                label='Order total'
                labelStyle={{ fontWeight: 700 }}
              >
                <span style={{ fontWeight: 700 }}>
                  {numberToPrice(
                    calculateTotalWithDeliveryPrice(
                      data.deliveries,
                      total.order_total
                    ),
                    data.currency?.symbol
                  )}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </div>
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
