import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { Button, Col, DatePicker, Form, InputNumber, Row, Switch } from 'antd';
import { DebounceSelect } from 'components/search';
import productService from 'services/seller/product';
import { setMenuData } from 'redux/slices/menu';
import moment from 'moment/moment';

export default function ProductBonusForm({ form, handleSubmit }) {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();

  const [loadingBtn, setLoadingBtn] = useState(false);

  const fetchProductsStock = (search) => {
    const params = {
      search,
      page: 1,
      perPage: 20,
    };

    return productService.getStock(params).then(({ data }) =>
      data?.map((item) => ({
        label:
          item?.product?.translation?.title +
          `${
            item?.extras?.length > 0
              ? `: ${item?.extras?.map((ext) => ext?.value?.value).join(', ')}`
              : ''
          }`,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const getInitialTimes = () => {
    if (!activeMenu.data?.expired_at) {
      return {};
    }
    const data = JSON.parse(activeMenu.data?.expired_at);
    return {
      expired_at: moment(data, 'YYYY-MM-DD'),
    };
  };

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      const dataString = {
        ...data,
        expired_at: data?.expired_at,
      };

      dispatch(setMenuData({ activeMenu, data: dataString }));
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);

    const body = {
      stock_id: values.stock?.value,
      value: values.stock_quantity,
      bonus_stock_id: values.bonus_stock?.value,
      bonus_quantity: values.bonus_stock_quantity,
      expired_at: moment(values.expired_at).format('YYYY-MM-DD'),
      status: values.status,
      type: 'count',
    };

    handleSubmit(body).finally(() => setLoadingBtn(false));
  };

  return (
    <Form
      form={form}
      name={'product_bonus_form'}
      layout={'vertical'}
      onFinish={onFinish}
      initialValues={{
        status: true,
        ...activeMenu.data,
        // ...getInitialTimes(),
      }}
    >
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label={t('products.stock')}
            name={'stock'}
            rules={[{ required: true, message: t('required') }]}
          >
            <DebounceSelect
              fetchOptions={fetchProductsStock}
              placeholder={t('select.product.stock')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('product.stock.quantity')}
            name={'stock_quantity'}
            rules={[
              {
                required: true,
                message: t('required'),
              },
              {
                type: 'number',
                min: 0,
                message: t('must.be.greater.than.0'),
              },
            ]}
          >
            <InputNumber
              className='w-100'
              placeholder={t('input.product.stock.quantity')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('bonus.product.stock')}
            name={'bonus_stock'}
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <DebounceSelect
              fetchOptions={fetchProductsStock}
              placeholder={t('select.product.stock')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('bonus.product.stock.quantity')}
            name={'bonus_stock_quantity'}
            rules={[
              {
                required: true,
                message: t('required'),
              },
              {
                type: 'number',
                min: 0,
                message: t('must.be.greater.than.0'),
              },
            ]}
          >
            <InputNumber
              className='w-100'
              placeholder={t('input.bonus.product.stock.quantity')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('expired.at')}
            name='expired_at'
            rules={[{ required: true, message: t('required') }]}
          >
            <DatePicker
              className='w-100'
              placeholder={t('select.expired.at')}
              disabledDate={(current) => moment().add(-1, 'days') >= current}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('active')} name='status' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <div className='flex-grow-1 d-flex flex-column justify-content-end'>
        <div className='pb-5'>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('submit')}
          </Button>
        </div>
      </div>
    </Form>
  );
}
