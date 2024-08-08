import React, { useState } from 'react';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  clearCart,
  removeFromCart,
  reduceCart,
  setCartShops,
  clearCartShops,
  setCartTotal,
  addCoupon,
  verifyCoupon,
  removeBag,
  setCartOrder,
  addShopsNote,
  setLoadingCoupon,
  addProductNote,
  clearData,
  clearProductsParams,
} from 'redux/slices/cart';
import useDidUpdate from 'helpers/useDidUpdate';
import orderService from 'services/order';
import invokableService from 'services/rest/invokable';
import { useTranslation } from 'react-i18next';
import numberToPrice from 'helpers/numberToPrice';
import { getCartData, getCartItems } from 'redux/selectors/cartSelector';
import PreviewInfo from '../../order/preview-info';
import { toast } from 'react-toastify';
import { fetchRestProducts } from 'redux/slices/product';
import useDebounce from 'helpers/useDebounce';
import moment from 'moment';
import QueryString from 'qs';
import RiveResult from 'components/rive-result';
import { BsFillGiftFill } from 'react-icons/bs';
import { fetchRestPayments } from 'redux/slices/payment';

const { Panel } = Collapse;

export default function OrderCart() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    cartItems,
    cartShops,
    currentBag,
    total,
    coupons,
    currency,
    notes,
    productNotes,
    productsParams,
  } = useSelector((state) => state.cart, shallowEqual);
  const filteredCartItems = useSelector((state) => getCartItems(state.cart));
  const data = useSelector((state) => getCartData(state.cart));

  const [loading, setLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [couponSuccessful, setCouponSuccessful] = useState(false);
  const debouncedCartItems = useDebounce(cartItems, 300);

  const deleteFromCard = (e) => {
    dispatch(removeFromCart({ ...e, bag_id: currentBag }));
  };

  const clearAll = () => {
    dispatch(clearCart());
    dispatch(clearData());
    dispatch(clearProductsParams());
    if (currentBag !== 0) {
      dispatch(removeBag(currentBag));
    }
  };

  const increment = (item) => {
    if (
      item?.quantity === item?.max_qty ||
      item?.quantity === item?.product_in_stock
    ) {
      return;
    }
    dispatch(addToCart({ ...item, bag_id: currentBag, quantity: 1 }));
  };

  const decrement = (item) => {
    if (item.quantity === 1) {
      return;
    }
    if (item.quantity <= item.min_qty) {
      return;
    }
    dispatch(reduceCart({ ...item, bag_id: currentBag, quantity: 1 }));
  };

  function formatProducts(list) {
    const products = list.map((item) => ({
      quantity: item.quantity,
      stock_id: item.stockID ? item.stockID?.id : item.stock?.id,
    }));

    const verifiedCoupons = {};

    coupons
      ?.filter((coupon) => coupon?.verified)
      ?.forEach(
        (coupon) => (verifiedCoupons[`${coupon?.shop_id}`] = coupon?.name),
      );

    const result = {
      products,
      currency_id: currency?.id,
      coupon: verifiedCoupons,
      delivery_type: data?.deliveries?.value,
      delivery_point_id:
        data?.delivery_type === 'point'
          ? data?.delivery_point?.value
          : undefined,
      delivery_price_id:
        data?.delivery_type === 'delivery'
          ? data?.delivery_price_id
          : undefined,
    };
    return QueryString.stringify(result, { addQueryPrefix: true });
  }

  useDidUpdate(() => {
    dispatch(
      fetchRestProducts({
        perPage: 12,
        currency_id: currency?.id,
        shop_id: data?.shop?.value,
        active: 1,
      }),
    );
    dispatch(fetchRestPayments({ active: 1 }));
    if (filteredCartItems.length) {
      productCalculate();
    }
  }, [currency]);

  useDidUpdate(() => {
    if (filteredCartItems.length) {
      productCalculate();
    } else {
      dispatch(clearCartShops());
    }
  }, [
    debouncedCartItems,
    currentBag,
    data?.delivery_price_id,
    currency,
    couponSuccessful,
  ]);

  function productCalculate() {
    setLoading(true);

    const products = formatProducts(filteredCartItems);

    orderService
      .calculate(products)
      .then(({ data }) => {
        const shopList = [...data?.shops];

        const orderCartTotal = {
          product_total: data?.price || 0,
          product_tax: data?.total_tax || 0,
          shop_tax: data?.total_shop_tax || 0,
          order_total: data?.total_price || 0,
          delivery_fee: data?.delivery_fee?.reduce(
            (total, item) => (total += item?.price || 0),
            0,
          ),
          errors: data?.errors,
          service_fee: data?.service_fee || 0,
          discount: data?.total_discount || 0,
          tax: data?.total_tax || 0,
          coupon:
            data?.coupon?.reduce(
              (total, item) => (total += item?.price || 0),
              0,
            ) ?? 0,
        };
        batch(() => {
          dispatch(setCartShops(shopList));
          dispatch(setCartTotal(orderCartTotal));
        });
      })
      .finally(() => setLoading(false));
  }

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    clearAll();
    toast.success(t('successfully.closed'));
    dispatch(
      fetchRestProducts({
        perPage: 12,
        currency_id: currency?.id,
        shop_id: productsParams?.shop_id,
        category_id: productsParams?.category_id,
        brand_id: productsParams?.brand_id,
        active: 1,
      }),
    );
  };

  function handleCheckCoupon(shopId) {
    const coupon = coupons?.find((coupon) => coupon.shop_id === shopId);
    if (!coupon || !coupon?.name?.trim()) {
      return;
    }

    const body = {
      coupon: coupon?.name,
      shop_id: coupon?.shop_id,
      user_id: data?.userOBJ?.id,
    };

    dispatch(setLoadingCoupon({ shop_id: shopId, loading: true }));
    invokableService
      .checkCoupon(body)
      .then(({ data }) => {
        dispatch(verifyCoupon({ shop_id: data?.shop_id, price: data?.price }));
        setCouponSuccessful(!couponSuccessful);
      })
      .catch((error) => console.log('error of coupon => ', error))
      .finally(() =>
        dispatch(setLoadingCoupon({ shop_id: shopId, loading: false })),
      );
  }

  const handleClick = () => {
    if (!currency) {
      toast.warning(t('please.select.currency'));
      return;
    }
    if (!data.delivery_point && data?.delivery_type === 'point') {
      toast.warning(t('please.select.delivery.point'));
      return;
    }
    if (!data.delivery_time) {
      toast.warning(t('shop.closed'));
      return;
    }
    if (!data.delivery_date) {
      toast.warning(t('please.select.deliveryDate'));
      return;
    }

    setLoading(true);

    const address =
      data?.delivery_type === 'delivery' ? data?.deliveryAddress : undefined;

    const delivery_point_id =
      data?.delivery_type === 'point' ? data?.delivery_point?.value : undefined;
    const delivery_price_id =
      data?.delivery_type === 'delivery' ? data?.delivery_price_id : undefined;
    const delivery_date = `${data.delivery_date} ${moment(
      data.delivery_time,
      'HH:mm',
    ).format('HH:mm')}`;

    const verifiedCoupons = coupons?.filter((coupon) => coupon?.verified);
    const resultCoupons = verifiedCoupons.reduce((acc, coupon) => {
      acc[`${coupon.shop_id}`] = coupon.name;
      return acc;
    }, {});

    const shopData = cartShops?.flatMap((cartShop) => {
      return {
        shop_id: cartShop?.shop?.id,
        products: cartShop?.stocks?.map((stock) => ({
          bonus: stock?.bonus,
          stock_id: stock?.stock?.id,
          quantity: stock?.quantity,
          note: productNotes.find((item) => item?.stock_id === stock?.stock?.id)
            ?.note,
        })),
      };
    });

    const body = {
      tax: total.order_tax,
      user_id: data.user?.value,
      currency_id: currency?.id,
      rate: currency.rate,
      payment_id: data.paymentType?.key,
      delivery_point_id,
      delivery_price_id,
      address,
      delivery_date,
      delivery_type: data.deliveries.value,
      phone: data?.phone?.toString(),

      //changes
      notes,
      coupon: resultCoupons,
      data: shopData,
    };

    orderService
      .create(body)
      .then((response) => {
        batch(() => {
          dispatch(setCartOrder(response?.data));
          dispatch(clearCart());
        });
        setShowInvoice(true);
        form.resetFields();
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const shopChildren = (rowData) => {
    const products = rowData?.stocks?.flatMap((item) => ({
      id: item?.stock?.product?.id,
      img: item?.stock?.product?.img ?? 'https://via.placeholder.com/150',
      title:
        item?.stock?.product?.translation?.title ?? t('no.translation.or.name'),
      price: item?.product_price,
      quantity: item?.quantity,
      product_in_stock: item?.product_quantity,
      unit: item?.stock?.product?.unit,
      interval: item?.stock?.product?.interval,
      max_qty: item?.stock?.product?.max_qty,
      min_qty: item?.stock?.product?.min_qty,
      extras: item?.stock?.stock_extras,
      shop_id: item?.stock?.product?.shop_id,
      bonus: !!item?.bonus,
      stockID: item?.stock,
    }));

    const extrasHTML = (extras, key) => {
      const colorGroup = extras?.filter(
        (extra) => extra?.group?.type === 'color',
      );
      const textGroup = extras?.filter(
        (extra) => extra?.group?.type !== 'color',
      );

      return (
        <div key={key}>
          <Space wrap style={{ marginBottom: '10px' }}>
            {!!colorGroup?.length && t('color') + ':'}
            {colorGroup?.map((color) => (
              <span
                style={{
                  display: 'block',
                  width: '19px',
                  height: '19px',
                  backgroundColor: color?.value?.value,
                  border: '1px solid #080136',
                  borderRadius: '50%',
                }}
              />
            ))}
          </Space>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '10px',
            }}
          >
            {textGroup?.map((text) => (
              <div>
                {t(text?.group?.translation?.title)}:{' '}
                <span>{text?.value?.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const counterHTML = (product) => {
      return (
        <div style={{ display: 'flex' }} key={product?.id}>
          <Button
            size={'small'}
            shape={'circle'}
            icon={<MinusOutlined size={8} />}
            type={'primary'}
            disabled={
              product?.quantity <= 1 ||
              product?.quantity === product?.min_qty ||
              product?.bonus
            }
            onClick={() => decrement(product)}
          />
          <h5 style={{ margin: '8px 10px' }}>
            {product?.quantity * (product?.interval ?? 1)}{' '}
            <span style={{ fontSize: '14px', fontWeight: '300' }}>
              {product?.unit?.translation?.title}
            </span>
          </h5>
          <Button
            size={'small'}
            shape={'circle'}
            icon={<PlusOutlined size={8} />}
            type={'primary'}
            disabled={
              product?.quantity === product?.product_in_stock ||
              product?.quantity === product?.max_qty ||
              product?.bonus
            }
            onClick={() => increment(product)}
          />
        </div>
      );
    };

    return products?.map((product, index) => {
      const productNoteValue =
        productNotes?.find((item) => item?.stock_id === product?.stockID?.id)
          ?.note ?? '';

      return (
        <>
          <Row
            gutter={6}
            key={product?.stockID?.id + '_' + index}
            style={{ marginBottom: '20px' }}
          >
            <Col
              span={24}
              style={{
                display: 'flex',
                columnGap: '20px',
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#f5f5f5',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  position: 'relative',
                }}
              >
                <Image
                  alt={t('shop.logo')}
                  style={{ objectFit: 'contain' }}
                  src={product?.img || 'https://via.placeholder.com/150'}
                  width={120}
                  height={120}
                  preview={false}
                />
                {product?.bonus && (
                  <div style={{ position: 'absolute', zIndex: '5' }}>bonus</div>
                )}
              </div>
              {product?.bonus && (
                <div
                  style={{
                    position: 'absolute',
                    top: '5px',
                    left: '8px',
                    backgroundColor: '#283142',
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '5px',
                  }}
                >
                  <BsFillGiftFill color={'#fff'} />
                </div>
              )}
              <div
                style={{
                  width: `calc(100% - 120px - 20px)`,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <h5
                    style={{
                      maxWidth: !product?.bonus ? 'calc(100% - 80px)' : '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product?.title}
                  </h5>
                  {!product?.bonus && (
                    <h5
                      style={{
                        width: 'max-content',
                        marginLeft: '15px',
                        textAlign: 'right',
                      }}
                    >
                      {numberToPrice(
                        product?.price,
                        currency?.symbol,
                        currency?.position,
                      )}
                    </h5>
                  )}
                </div>
                <Space>{extrasHTML(product?.extras, product?.id)}</Space>
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Input.TextArea
              className='w-100'
              placeholder={t('product.note')}
              value={productNoteValue}
              disabled={product?.bonus}
              onChange={(e) =>
                dispatch(
                  addProductNote({
                    stock_id: product?.stockID?.id,
                    note: e.target.value,
                  }),
                )
              }
              rows={1}
              maxLength={100}
            />
          </Row>
          <Row>
            {counterHTML(product)}
            <Button
              style={{ marginLeft: '20px' }}
              icon={<DeleteOutlined />}
              size={'small'}
              onClick={() => deleteFromCard(product)}
              disabled={product?.bonus}
            />
          </Row>
          <Divider />
        </>
      );
    });
  };

  return (
    <Card title={t('cart')}>
      {loading && (
        <div className='loader'>
          <Spin />
        </div>
      )}
      <div className='card-save'>
        <Space direction='vertical'>
          {total?.errors?.map((item) => (
            <Typography.Text type='danger'>{item.message}</Typography.Text>
          ))}
        </Space>
        {!!cartShops?.length ? (
          <Collapse>
            {cartShops?.map((item) => {
              const coupon = coupons?.find(
                (coupon) => coupon?.shop_id === item?.shop?.id,
              );

              return (
                <Panel
                  key={item?.shop?.uuid}
                  header={item?.shop?.translation?.title}
                >
                  {shopChildren(item)}
                  {/*shop note*/}
                  <Input.TextArea
                    className='w-100'
                    rows={1}
                    style={{ marginBottom: '20px' }}
                    placeholder={t('shop.note')}
                    onChange={(e) =>
                      dispatch(
                        addShopsNote({
                          note: e.target.value,
                          shop_id: item?.shop?.id,
                        }),
                      )
                    }
                    maxLength={100}
                  />
                  {/*shop coupon*/}
                  <div style={{ display: 'flex', columnGap: '20px' }}>
                    <Input
                      className={'w-100'}
                      placeholder={t('enter.coupon')}
                      onChange={(e) =>
                        dispatch(
                          addCoupon({
                            name: e.target.value,
                            shop_id: item?.shop?.id,
                          }),
                        )
                      }
                    />
                    <Button
                      onClick={() => handleCheckCoupon(item?.shop?.id)}
                      disabled={coupon?.loading}
                      loading={coupon?.loading}
                    >
                      {t('check')}
                    </Button>
                  </div>
                </Panel>
              );
            })}
          </Collapse>
        ) : (
          <div>
            <RiveResult id='nosell' />
            <p style={{ textAlign: 'center' }}>{t('empty.cart')}</p>
          </div>
        )}
        <Divider />

        <Row className='all-price-row'>
          <Col span={24} className='col'>
            <div className='all-price-container'>
              <span>{t('products')}</span>
              <span>
                {numberToPrice(
                  total.product_total,
                  currency?.symbol,
                  currency?.position,
                )}
              </span>
            </div>
            <div className='all-price-container'>
              <span>{t('delivery.fee')}</span>
              <span>
                {numberToPrice(
                  total.delivery_fee,
                  currency?.symbol,
                  currency?.position,
                )}
              </span>
            </div>
            <div className='all-price-container'>
              <span>{t('service.fee')}</span>
              <span>
                {numberToPrice(
                  total.service_fee,
                  currency?.symbol,
                  currency?.position,
                )}
              </span>
            </div>
            <div className='all-price-container'>
              <span>{t('tax')}</span>
              <span>
                {numberToPrice(total.tax, currency?.symbol, currency?.position)}
              </span>
            </div>
            <div className='all-price-container'>
              <span>{t('discount')}</span>
              <span>
                -{' '}
                {numberToPrice(
                  total.discount,
                  currency?.symbol,
                  currency?.position,
                )}
              </span>
            </div>
            <div className='all-price-container'>
              <span>{t('coupon')}</span>
              <span>
                -{' '}
                {numberToPrice(
                  total.coupon,
                  currency?.symbol,
                  currency?.position,
                )}
              </span>
            </div>
          </Col>
        </Row>

        <Row className='submit-row'>
          <Col span={14} className='col'>
            <span>{t('total.amount')}</span>
            <span>
              {numberToPrice(
                total.order_total,
                currency?.symbol,
                currency?.position,
              )}
            </span>
          </Col>
          <Col className='col2'>
            <Button
              type='primary'
              onClick={() => handleClick()}
              disabled={!cartShops.length || total.errors?.length}
              loading={loading}
            >
              {t('place.order')}
            </Button>
          </Col>
        </Row>
      </div>
      {showInvoice && <PreviewInfo handleClose={handleCloseInvoice} />}
    </Card>
  );
}
