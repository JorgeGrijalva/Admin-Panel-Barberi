import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Card,
  Button,
  Row,
  Col,
  Switch,
  Select,
  InputNumber,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import currencyService from '../../services/currency';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../redux/slices/menu';
import { fetchCurrencies } from '../../redux/slices/currency';
import { useTranslation } from 'react-i18next';
import currency from '../../helpers/currnecy.json';

export default function CurrencyAdd() {
  const { t } = useTranslation();
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      title: values.title,
      symbol: values.symbol,
      rate: values.rate,
      active: Number(values.active),
      position: values.position,
    };
    const nextUrl = 'currencies';
    currencyService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchCurrencies({}));
      })
      .finally(() => setLoadingBtn(false));
  };

  const options = currency.map((item) => ({
    label: item?.name.toUpperCase() + ' ' + `( ${item.symbol_native} )`,
    value: item.code,
    symbol: item.symbol_native,
  }));

  return (
    <Card title={t('add.currency')}>
      <Form
        name='currency-add'
        onFinish={onFinish}
        form={form}
        layout='vertical'
        initialValues={{
          ...activeMenu.data,
          active: true,
          position: 'before',
        }}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('title')}
              name='title'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select
                onChange={(e, i) => form.setFieldsValue({ symbol: i.symbol })}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                showSearch
                allowClear
                options={options}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('symbol')}
              name='symbol'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('rate')}
              name='rate'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
                {
                  type: 'number',
                  min: 0,
                  message: t('must.be.positive'),
                },
              ]}
            >
              <InputNumber className='w-100' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('symbol_position')}
              name='position'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select
                onChange={(value) => form.setFieldsValue({ position: value })}
                options={[
                  { label: t('after'), value: 'after' },
                  { label: t('before'), value: 'before' },
                ]}
                defaultValue='before'
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('active')}
              name='active'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Form>
    </Card>
  );
}
