import React, { useEffect } from 'react';
import { Card, Col, DatePicker, Form, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setOrderData } from '../../redux/slices/order';
import { getCurrentShop } from '../../redux/selectors/orderSelector';
import moment from 'moment';
import shopService from '../../services/restaurant';
import { setMenuData } from '../../redux/slices/menu';

const weeks = [
  {
    title: 'sunday',
  },
  { title: 'monday' },
  {
    title: 'tuesday',
  },
  {
    title: 'wednesday',
  },
  {
    title: 'thursday',
  },
  {
    title: 'friday',
  },
  {
    title: 'saturday',
  },
];

const DeliveryInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.order, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const date = new Date(data?.delivery_date);
  const shopTime = activeMenu.data?.CurrentShop?.shop_working_days
    ?.filter((item) => item.disabled !== true)
    .find((item) => item?.day === weeks[date.getDay()]?.title);

  const filter = activeMenu.data?.CurrentShop?.shop_closed_date?.map(
    (date) => date.day,
  );

  function disabledDate(current) {
    const a = filter?.find(
      (date) => date === moment(current).format('YYYY-MM-DD'),
    );
    const b = moment().add(-1, 'days') >= current;
    if (a) {
      return a;
    } else {
      return b;
    }
  }

  const range = (start, end) => {
    const x = parseInt(start);
    const y = parseInt(end);
    const number = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24,
    ];
    for (let i = x; i <= y; i++) {
      delete number[i];
    }
    return number;
  };

  const middle = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDateTime = () => ({
    disabledHours: () =>
      range(
        shopTime?.from.substring(0, 2) >= moment(new Date()).format('HH')
          ? shopTime?.from.substring(0, 2)
          : moment(new Date()).format('HH'),
        shopTime?.to.substring(0, 2),
      ),
    disabledMinutes: () => middle(0, 60),
    disabledSeconds: () => middle(0, 60),
  });

  const fetchShop = (uuid) => {
    shopService.getById(uuid).then((data) => {
      const currency_shop = data?.data;
      dispatch(setOrderData({ currency_shop }));
      dispatch(
        setMenuData({
          activeMenu,
          data: {
            ...activeMenu?.data,
            CurrentShop: data?.data,
          },
        }),
      );
    });
  };

  const setDeliveryPrice = (delivery) =>
    dispatch(setOrderData({ delivery_fee: delivery?.value }));

  useEffect(() => {
    if (data?.shop?.value) {
      fetchShop(data?.shop?.value);
    }
  }, [data?.shop]);

  return (
    <Card title={t('shipping.info')}>
      <Row gutter={12}>
        <Col span={24}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name='delivery_date'
                label={t('delivery.date')}
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <DatePicker
                  placeholder={t('delivery.date')}
                  className='w-100'
                  format='YYYY-MM-DD'
                  disabledDate={disabledDate}
                  onChange={(e) => {
                    const delivery_date = moment(e).format('YYYY-MM-DD');
                    dispatch(setOrderData({ delivery_date }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={`${t('delivery.time')} (${t('up.to')})`}
                name='delivery_time'
                rules={[
                  {
                    required: false,
                    message: t('required'),
                  },
                ]}
              >
                <DatePicker
                  disabled={!data?.delivery_date}
                  picker='time'
                  placeholder={t('start.time')}
                  className='w-100'
                  format={'HH:mm:ss'}
                  showNow={false}
                  disabledTime={disabledDateTime}
                  onChange={(e) => {
                    const delivery_time = moment(e).format('HH:mm:ss');
                    dispatch(setOrderData({ delivery_time }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default DeliveryInfo;
