import React, { useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import getImage from 'helpers/getImage';
import getImageFromStock from 'helpers/getImageFromStock';
import numberToPrice from 'helpers/numberToPrice';
import numberToQuantity from 'helpers/numberToQuantity';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { getExtras, sortExtras } from 'helpers/getExtras';
import productService from 'services/product';
import { setMenuData } from 'redux/slices/menu';

export default function ProductModal({ productData, setProductData }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currency } = useSelector((state) => state.order.data, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStock, setCurrentStock] = useState({});
  const [extrasIds, setExtrasIds] = useState([]);
  const [extras, setExtras] = useState([]);
  const [stock, setStock] = useState([]);
  const [counter, setCounter] = useState(
    data?.quantity || productData.quantity || productData.min_qty,
  );
  const [showExtras, setShowExtras] = useState({
    extras: [],
    stock: {
      id: 0,
      quantity: 1,
      price: 0,
    },
  });

  const handleCancel = () => {
    setProductData(null);
  };

  const handleSubmit = () => {
    const body = {
      stock: { ...currentStock, extras: extrasIds },
      quantity: counter,
      id: currentStock.id,
      img: getImageFromStock(currentStock) || data?.img,
      price: currentStock.price,
      translation: data?.translation,
    };

    dispatch(setMenuData({ activeMenu, data: { newProduct: { ...body } } }));
    setProductData(null);
  };

  const calculateTotalPrice = (priceKey) => {
    return showExtras?.stock?.[priceKey || 'price'] * counter;
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

  const addCounter = () => {
    if (counter === data.max_qty) {
      return;
    }
    setCounter((prev) => prev + 1);
  };

  const reduceCounter = () => {
    if (counter === 1) {
      return;
    }
    if (counter <= data?.min_qty) {
      return;
    }
    setCounter((prev) => prev - 1);
  };

  useEffect(() => {
    setLoading(true);
    productService
      .getById(productData.uuid)
      .then(({ data }) => {
        setData(data);
        const myData = sortExtras(data, {});
        setExtras(myData.extras);
        setCounter(data.quantity || data.min_qty);
        setStock(myData.stock);
        setShowExtras(getExtras(extrasIds, myData.extras, myData.stock));
        getExtras('', myData.extras, myData.stock).extras?.forEach(
          (element) => {
            setExtrasIds((prev) => [...prev, element[0]]);
          },
        );
      })
      .finally(() => setLoading(false));
  }, [productData.uuid]);

  useEffect(() => {
    if (showExtras?.stock) {
      setCurrentStock({ ...showExtras.stock, extras: extrasIds });
    }
  }, [showExtras]);

  return (
    <Modal
      visible={!!productData}
      onCancel={handleCancel}
      footer={[
        loading ? (
          ''
        ) : (
          <Button key={'add-product'} type='primary' onClick={handleSubmit}>
            {t('add')}
          </Button>
        ),
        <Button key={'cancel-modal'} type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={8}>
            <Image
              src={getImage(
                getImageFromStock(currentStock) || productData?.img,
              )}
              alt={productData.name}
              height={200}
              style={{ objectFit: 'contain' }}
            />
          </Col>
          <Col span={16}>
            <Descriptions title={productData.translation?.title}>
              <Descriptions.Item label={t('price')} span={3}>
                <div className={currentStock?.discount ? 'strike' : ''}>
                  {numberToPrice(calculateTotalPrice(), currency.symbol)}
                </div>
                {currentStock?.discount ? (
                  <div className='ml-2 font-weight-bold'>
                    {numberToPrice(
                      calculateTotalPrice('total_price'),
                      currency.symbol,
                    )}
                  </div>
                ) : (
                  ''
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t('in.stock')} span={3}>
                {numberToQuantity(currentStock?.quantity, data?.unit)}
              </Descriptions.Item>
              <Descriptions.Item label={t('tax')} span={3}>
                {numberToPrice(currentStock?.tax, currency.symbol)}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        {showExtras?.extras
          ? showExtras?.extras?.map((extra, idx) => {
              return (
                <div className='extra-group' key={'extra-group' + idx}>
                  <Space className='extras-select' wrap>
                    {extra?.map((item, itemIdx) => {
                      if (item?.group?.type === 'color') {
                        return (
                          <span
                            className={`extras-color-wrapper ${
                              !!extrasIds.find((extra) => extra.id === item.id)
                                ? 'selected'
                                : ''
                            }`}
                            key={'color' + itemIdx}
                            onClick={() => handleExtrasClick(item)}
                          >
                            <i
                              className='extras-color'
                              style={{ backgroundColor: item?.value?.value }}
                            />
                          </span>
                        );
                      } else if (item?.group?.type === 'text') {
                        return (
                          <span
                            className={`extras-text rounded ${
                              !!extrasIds.find((extra) => extra.id === item.id)
                                ? 'selected'
                                : ''
                            }`}
                            key={'text' + itemIdx}
                            onClick={() => handleExtrasClick(item)}
                          >
                            {item?.value?.value}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </Space>
                </div>
              );
            })
          : null}
        <Space direction='vertical' size='middle'></Space>
        <Row gutter={12} className='mt-3'>
          <Col span={24}>
            <Space>
              <Button
                key={'plus'}
                type='primary'
                icon={<MinusOutlined />}
                onClick={reduceCounter}
              />
              {(counter || 1) * (productData?.interval || 1)}
              {productData?.unit?.translation?.title}
              <Button
                key={'minus'}
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
