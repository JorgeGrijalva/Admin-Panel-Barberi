import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Select,
  Spin,
} from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import shopService from '../../../services/shop';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { setMenuData } from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import RiveResult from '../../../components/rive-result';

const DeliveryInfo = ({ form }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { orderShops, data: orderData } = useSelector(
    (state) => state.order,
    shallowEqual
  );
  const activeMenu = useSelector(
    (state) => state.menu.activeMenu,
    shallowEqual
  );
  const { data } = activeMenu;
  const [loading, setLoading] = useState(false);

  function getOrderDeliveries(shops, deliveries) {
    return shops.map((item) => {
      const delivery = deliveries.find((el) => el.shop_id === item.id);
      if (delivery) {
        return {
          shop_id: item.id,
          delivery: delivery.delivery,
          delivery_date: moment(delivery.delivery_date),
          delivery_time: delivery.delivery_time,
          delivery_fee: delivery.delivery_fee,
        };
      }
      return {
        shop_id: item.id,
        delivery: '',
        delivery_date: '',
        delivery_time: '',
        delivery_fee: '',
      };
    });
  }

  useEffect(() => {
    if (data?.length) {
      if (orderData.deliveries.length) {
        form.setFieldsValue({
          deliveries: getOrderDeliveries(data, orderData.deliveries),
        });
        return;
      }
      form.setFieldsValue({
        deliveries: data.map((item) => ({
          shop_id: item.id,
          delivery: '',
          delivery_date: '',
          delivery_time: '',
          delivery_fee: '',
        })),
      });
    } else {
      form.setFieldsValue({
        deliveries: [],
      });
    }
  }, [data]);

  function getShopDeliveries(shops) {
    setLoading(true);
    const params = formatShopIds(shops);
    shopService
      .getShopDeliveries(params)
      .then((res) => dispatch(setMenuData({ activeMenu, data: res.data })))
      .finally(() => setLoading(false));
  }

  useDidUpdate(() => {
    if (orderShops.length) {
      getShopDeliveries(orderShops);
    }
  }, [orderShops]);

  function formatShopIds(list) {
    const result = list.map((item, index) => ({
      [`shops[${index}]`]: item.id,
    }));
    return Object.assign({}, ...result);
  }

  function getHours(shop) {
    if (!shop) return [];
    let hours = [];
    const timeFrom = moment(shop.open_time, 'HH:mm').hour();
    const timeTo = moment(shop.close_time, 'HH:mm').hour();
    for (let index = timeFrom + 1; index < timeTo; index++) {
      const hour = {
        label: moment(index, 'HH').format('HH:mm'),
        value: moment(index, 'HH').format('HH:mm'),
      };
      hours.push(hour);
    }
    return hours;
  }

  function formatDeliveries(list) {
    if (!list?.length) return [];
    return list.map((item) => ({
      label: item.translation?.title,
      value: item.id,
    }));
  }

  return (
    <Card title={t('stores')}>
      {loading && (
        <div className='loader'>
          <Spin />
        </div>
      )}
      <Form.List name='deliveries'>
        {(fields) => {
          return (
            <div>
              {fields.length ? (
                fields.map((field, index) => (
                  <Card
                    title={`${data[index]?.translation?.title} ${t('shop')}`}
                    type='inner'
                    size='small'
                    key={field.key}
                  >
                    <Row gutter={12}>
                      <Col span={24}>
                        <Form.Item
                          name={[index, 'delivery']}
                          label={t('delivery')}
                          rules={[
                            { required: true, message: t('required.field') },
                          ]}
                        >
                          <Select
                            placeholder={t('select.delivery')}
                            options={formatDeliveries(data[index]?.deliveries)}
                            labelInValue
                          />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Row gutter={12}>
                          <Col span={12}>
                            <Form.Item
                              name={[index, 'delivery_date']}
                              label={t('delivery.date')}
                              rules={[
                                {
                                  required: true,
                                  message: t('required.field'),
                                },
                              ]}
                            >
                              <DatePicker className='w-100' />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={`${t('delivery.time')} (${t('up.to')})`}
                              name={[index, 'delivery_time']}
                              rules={[
                                {
                                  required: true,
                                  message: t('required.field'),
                                },
                              ]}
                            >
                              <Select options={getHours(data[index])} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={t('delivery.fee')}
                              name={[index, 'delivery_fee']}
                              hidden
                            >
                              <InputNumber min={0} className='w-100' />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <Row>
                  <Col span={24}>
                    <RiveResult id='nosell' />
                  </Col>
                </Row>
              )}
            </div>
          );
        }}
      </Form.List>
    </Card>
  );
};

export default DeliveryInfo;
