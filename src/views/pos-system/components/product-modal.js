import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Descriptions,
  Image,
  Modal,
  Row,
  Space,
  Spin,
} from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getImage from 'helpers/getImage';
import {
  MinusOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import numberToPrice from 'helpers/numberToPrice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { addToCart } from 'redux/slices/cart';
import numberToQuantity from 'helpers/numberToQuantity';
import getImageFromStock from 'helpers/getImageFromStock';
import { getExtras, sortExtras } from 'helpers/getExtras';
import productService from 'services/product';

export default function ProductModal({ extrasModal, setExtrasModal }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const { t } = useTranslation();
  const [currentStock, setCurrentStock] = useState({});
  const dispatch = useDispatch();
  const [extras, setExtras] = useState([]);
  const [stock, setStock] = useState([]);
  const [extrasIds, setExtrasIds] = useState([]);
  const [showExtras, setShowExtras] = useState({
    extras: [],
    stock: {
      id: 0,
      quantity: 1,
      price: 0,
    },
  });
  const [counter, setCounter] = useState(
    extrasModal.quantity || data.quantity || data.min_qty,
  );

  const { currentBag, currency } = useSelector(
    (state) => state.cart,
    shallowEqual,
  );

  const handleSubmit = () => {
    const orderItem = {
      ...data,
      stock: currentStock,
      quantity: counter,
      id: currentStock.id,
      img: getImageFromStock(currentStock) || data.img,
      bag_id: currentBag,
      stockID: currentStock,
    };
    if (orderItem.quantity > currentStock.quantity) {
      toast.warning(
        `${t('you.cannot.order.more.than')} ${currentStock.quantity}`,
      );
      return;
    }
    dispatch(addToCart(orderItem));
    setExtrasModal(null);
  };

  const handleExtrasClick = (e) => {
    const index = extrasIds.findIndex(
      (item) => item.extra_group_id === e.extra_group_id,
    );
    let array = extrasIds;
    if (index > -1) array = array.slice(0, index);
    array.push(e);
    const nextIds = array.map((item) => item.extra_value_id).join(',');
    var extrasData = getExtras(nextIds, extras, stock);
    setShowExtras(extrasData);
    extrasData.extras?.forEach((element) => {
      const index = extrasIds.findIndex((item) =>
        element[0].extra_group_id !== e.extra_group_id
          ? item.extra_group_id === element[0].extra_group_id
          : item.extra_group_id === e.extra_group_id,
      );
      if (element[0].level >= e.level) {
        var itemData =
          element[0].extra_group_id !== e.extra_group_id ? element[0] : e;
        if (index === -1) array.push(itemData);
        else {
          array[index] = itemData;
        }
      }
    });
    setExtrasIds(array);
  };

  function addCounter() {
    if (counter === data?.quantity) {
      return;
    }
    if (counter === data.max_qty) {
      return;
    }
    setCounter((prev) => prev + 1);
  }

  function reduceCounter() {
    if (counter === 1) {
      return;
    }
    if (counter <= data.min_qty) {
      return;
    }
    setCounter((prev) => prev - 1);
  }
  const handleCancel = () => setExtrasModal(false);
  function calculateTotalPrice(priceKey) {
    return showExtras?.stock?.[priceKey || 'price'] * counter || 0;
  }
  useEffect(() => {
    if (showExtras?.stock) {
      setCurrentStock({ ...showExtras.stock, extras: extrasIds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showExtras]);

  useEffect(() => {
    setLoading(true);
    productService
      .getById(extrasModal.uuid)
      .then(({ data }) => {
        setData(data);
        const myData = sortExtras(data);
        setExtras(myData.extras);
        setCounter(extrasModal.quantity || data.quantity || data.min_qty);
        setStock(myData.stock);
        setShowExtras(getExtras(extrasIds, myData.extras, myData.stock));
        getExtras('', myData.extras, myData.stock).extras?.forEach(
          (element) => {
            setExtrasIds((prev) => [...prev, element[0]]);
          },
        );
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extrasModal.uuid]);

  return (
    <Modal
      visible={!!data}
      title={data.name}
      onCancel={handleCancel}
      key={data?.id}
      footer={[
        loading ? null : (
          <Button
            icon={<PlusCircleOutlined />}
            key='add-product'
            type='primary'
            onClick={handleSubmit}
          >
            {t('add')}
          </Button>
        ),
        <Button key='cancel-product' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={8}>
            <Image
              src={getImage(getImageFromStock(currentStock) || data.img)}
              alt={data.name}
              height={200}
              style={{ objectFit: 'contain' }}
            />
          </Col>
          <Col span={16}>
            <Descriptions title={data.translation?.title}>
              <Descriptions.Item label={t('price')} span={3}>
                <div className={currentStock?.discount ? 'strike' : ''}>
                  {numberToPrice(
                    calculateTotalPrice(),
                    currency?.symbol,
                    currency?.position,
                  )}
                </div>
                {currentStock?.discount ? (
                  <div className='ml-2 font-weight-bold'>
                    {numberToPrice(
                      calculateTotalPrice('total_price'),
                      currency?.symbol,
                      currency?.position,
                    )}
                  </div>
                ) : (
                  ''
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t('in.stock')} span={3}>
                {numberToQuantity(currentStock?.quantity, data.unit)}
              </Descriptions.Item>
              <Descriptions.Item label={t('tax')} span={3}>
                {numberToPrice(
                  currentStock?.tax || 0,
                  currency?.symbol,
                  currency?.position,
                )}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        {showExtras?.extras?.map((item, idx) => (
          <div className='extra-group' key={'extra-group-container' + idx}>
            <div className='mb-3'>{item?.[0]?.group?.translation?.title}:</div>
            <Space key={'extra-group' + idx} className='extras-select' wrap>
              {item.map((el) => {
                if (el?.group?.type === 'color') {
                  return (
                    <div
                      className={`extras-color-wrapper rounded ${
                        !!extrasIds.find(
                          (extra) => extra.extra_value_id === el.extra_value_id,
                        )
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() => handleExtrasClick(el)}
                    >
                      <div
                        className='extras-color'
                        style={{ backgroundColor: el.value.value }}
                      ></div>
                    </div>
                  );
                }
                return (
                  <span
                    className={`extras-text rounded ${
                      !!extrasIds.find(
                        (extra) => extra.extra_value_id === el.extra_value_id,
                      )
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => handleExtrasClick(el)}
                  >
                    {el.value.value}
                  </span>
                );
              })}
            </Space>
          </div>
        ))}
        <Row gutter={12} className='mt-3'>
          <Col span={24}>
            <Space>
              <Button
                type='primary'
                icon={<MinusOutlined />}
                onClick={reduceCounter}
              />
              {(counter || 1) * (data?.interval || 1)}
              {data?.unit?.translation?.title}
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={addCounter}
              />
            </Space>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
}
