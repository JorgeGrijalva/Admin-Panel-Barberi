import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import productService from '../../services/product';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { setRefetch } from '../../redux/slices/menu';

const ProductStock = ({ prev, next, current }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { uuid } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loadingBtn, setLoadingBtn] = useState(null);
  const dispatch = useDispatch();
  const onFinish = (values) => {
    setLoadingBtn(true);
    let extras;

    extras = [
      {
        price: values.price,
        quantity: values.quantity,
        sku: values.sku,
      },
    ];

    productService
      .stocks(uuid, { extras })
      .then(() => next())
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    dispatch(setRefetch(activeMenu));
    form.setFieldsValue({
      price: activeMenu.data?.stocks?.length
        ? activeMenu.data.stocks[0].price
        : [],
      quantity: activeMenu.data?.stocks?.length
        ? activeMenu.data.stocks[0].quantity
        : [],
      sku: activeMenu.data?.stocks?.length ? activeMenu.data.stocks[0].sku : [],
    });
  }, []);

  return (
    <Form layout='vertical' form={form} onFinish={onFinish}>
      <Row
        gutter={12}
        align='middle'
        style={{ flexWrap: 'nowrap', overflowX: 'auto' }}
      >
        <Col>
          <Form.Item
            label={t('price')}
            name={'price'}
            rules={[{ required: true, message: t('required') }]}
          >
            <InputNumber min={0} className='w-100' style={{ minWidth: 200 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label={t('quantity')}
            name={'quantity'}
            rules={[{ required: true, message: t('required') }]}
          >
            <InputNumber min={1} className='w-100' style={{ minWidth: 200 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label={t('sku')}
            name={'sku'}
          >
            <Input style={{ minWidth: 200 }} />
          </Form.Item>
        </Col>
      </Row>
      <Space className='mt-4'>
        <Button onClick={prev}>{t('prev')}</Button>
        <Button type='primary' htmlType='submit' loading={!!loadingBtn}>
          {t('next')}
        </Button>
      </Space>
    </Form>
  );
};

export default ProductStock;
