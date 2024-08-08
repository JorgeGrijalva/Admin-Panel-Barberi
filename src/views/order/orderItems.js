import React, { useState } from 'react';
import {
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Spin } from 'antd';
import Meta from 'antd/lib/card/Meta';
import getImage from 'helpers/getImage';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  clearOrderProducts,
  removeFromOrder,
  setOrderTotal,
  changeOrderedProductQuantity,
  setOrderProducts,
} from 'redux/slices/order';
import orderService from 'services/order';
import ExtrasModal from './extrasModal';
import numberToPrice from 'helpers/numberToPrice';
import useDidUpdate from 'helpers/useDidUpdate';
import { useNavigate } from 'react-router-dom';
import { addMenu } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import QueryString from 'qs';
import { BsFillGiftFill } from 'react-icons/bs';

export default function OrderItems() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderItems, data, total, orderProducts } = useSelector(
    (state) => state.order,
    shallowEqual,
  );
  const [loading, setLoading] = useState(false);
  const [extrasModal, setExtrasModal] = useState(null);

  function formatProducts(list) {
    const addons = list?.map((item) => ({
      quantity: item.quantity,
      stock_id: item.stockID ? item.stockID?.id : item.stock?.id,
    }));

    const products = list?.flatMap((item) =>
      item.addons?.map((addon) => ({
        quantity: addon.quantity,
        stock_id: addon.stock_id,
        parent_id: item.stockID ? item.stockID?.id : item.stock?.id,
      })),
    );

    const combine = addons.concat(products);

    const result = {
      products: combine,
      currency_id: data?.currency?.id,
      shop_id: data?.shop?.value,
      type: data?.deliveries?.label?.toLowerCase(),
      address: {
        latitude: data?.address?.lat,
        longitude: data?.address?.lng,
      },
    };
    return QueryString.stringify(result, { addQueryPrefix: true });
  }

  useDidUpdate(() => {
    if (orderItems.length) {
      productCalculate();
    } else {
      dispatch(clearOrderProducts());
    }
  }, [orderItems, data.currency, data.address, data?.coupon]);

  function productCalculate() {
    if (!!data?.deliveries?.label) {
      const products = formatProducts(orderItems);

      setLoading(true);
      orderService
        .calculate(products)
        .then(({ data }) => {
          const product = data;
          const orderData = {
            product_tax: product?.shops?.reduce(
              (acc, curr) => acc + curr.product_tax,
              0,
            ),
            shop_tax: product.total_tax,
            order_total: product?.total_price,
            delivery_fee: product?.delivery_fee,
            discount: product?.total_discount,
            service_fee: product?.service_fee,
          };
          dispatch(setOrderTotal(orderData));
        })
        .catch(() => dispatch(setOrderProducts(orderProducts)))
        .finally(() => setLoading(false));
    }
  }

  const goToProduct = (item) => {
    dispatch(
      addMenu({
        id: `product-${item.uuid}`,
        url: `product/${item.uuid}`,
        name: t('edit.product'),
      }),
    );
    navigate(`/product/${item.uuid}`);
  };

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

            <div className='d-flex' style={{ justifyContent: 'flex-end' }}>
              <div className='mt-2 text-right shop-total'>
                <Space>
                  <p className='font-weight-bold'>{t('product.tax')}:</p>
                  <p>
                    {numberToPrice(total.product_tax, data.currency?.symbol)}
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
