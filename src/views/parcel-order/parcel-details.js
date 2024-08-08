import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  TimePicker,
} from 'antd';
import { useTranslation } from 'react-i18next';
import MediaUpload from 'components/upload';
import { DebounceSelect } from 'components/search';
import parcelTypeService from 'services/parcelType';
import parcelOrderService from 'services/parcelOrder';
import numberToPrice from 'helpers/numberToPrice';
import { shallowEqual, useSelector } from 'react-redux';
import moment from 'moment';
import paymentService from 'services/payment';

export default function ParcelDetails({
  form,
  loading,
  prev,
  locationFrom,
  locationTo,
  image,
  setImage,
}) {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [type, setType] = useState(activeMenu?.data?.type);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (type && locationFrom && locationTo) {
      const payload = {
        'address_from[latitude]': locationFrom.lat,
        'address_from[longitude]': locationFrom.lng,
        'address_to[latitude]': locationTo.lat,
        'address_to[longitude]': locationTo.lng,
        type_id: type?.value,
      };
      parcelOrderService
        .calculate(payload)
        .then(({ data }) => {
          setPrice(data.price);
        })
        .catch((err) => console.error(err));
    }
  }, [type, locationFrom, locationTo]);

  async function fetchParcelTypeList(search) {
    const params = { search };
    return parcelTypeService.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item.type,
        value: item.id,
        key: item.id,
      })),
    );
  }
  async function fetchPaymentTypeList(search) {
    const params = { search };
    return paymentService.getAll(params).then((res) =>
      res.data
        ?.filter((el) => el.tag === 'cash' || el.tag === 'wallet')
        ?.map((item) => ({
          label: t(item.tag),
          value: item.id,
          key: item.id,
        })),
    );
  }

  const onChangeType = (event) => {
    setType(event);
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label={t('type')}
            name='type'
            rules={[{ required: true, message: t('required') }]}
          >
            <DebounceSelect
              fetchOptions={fetchParcelTypeList}
              onChange={onChangeType}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('image')}
            name='images'
            rules={[
              {
                validator() {
                  if (image?.length === 0) {
                    return Promise.reject(new Error(t('required')));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <MediaUpload
              type='languages'
              imageList={image}
              setImageList={setImage}
              form={form}
              multiple={false}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('payment.type')}
            name='payment_type'
            rules={[{ required: true, message: t('missing.payment.type') }]}
          >
            <DebounceSelect fetchOptions={fetchPaymentTypeList} />
          </Form.Item>
        </Col>
        <Col span={12}></Col>
        <Col span={12}>
          <Form.Item
            label={t('delivery.date')}
            name='delivery_date'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <DatePicker
              className='w-100'
              placeholder=''
              disabledDate={(current) => moment().add(-1, 'days') >= current}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('delivery.time')}
            name='delivery_time'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <TimePicker className='w-100' format='HH:mm' placeholder='' />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={t('note')}
            name='note'
            rules={[
              {
                required: true,
                message: t('required'),
              },
              {
                validator: (_, value) => {
                  if (value && value?.trim() === '') {
                    return Promise.reject(new Error(t('no.empty.space')));
                  } else if (value && value?.trim().length < 2) {
                    return Promise.reject(new Error(t('must.be.at.least.2')));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.TextArea row={1} maxLength={100} />
          </Form.Item>
        </Col>
      </Row>
      <div className='d-flex justify-content-between'>
        <Space>
          <Button type='default' htmlType='button' onClick={prev}>
            {t('prev')}
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            disabled={!price}
          >
            {t('submit')}
          </Button>
        </Space>
        <Space>
          <span>{t('total.price')}:</span>
          <span>{numberToPrice(price)}</span>
        </Space>
      </div>
    </>
  );
}
