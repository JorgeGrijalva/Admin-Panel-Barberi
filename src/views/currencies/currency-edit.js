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
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import currencyService from '../../services/currency';
import { useDispatch, useSelector } from 'react-redux';
import {
  disableRefetch,
  removeFromMenu,
  setMenuData,
} from '../../redux/slices/menu';
import { fetchCurrencies } from '../../redux/slices/currency';
import { useTranslation } from 'react-i18next';
import currency from '../../helpers/currnecy.json';
import Loading from '../../components/loading';

export default function CurrencyEdit() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const fetchCurrency = (id) => {
    setLoading(true);
    currencyService
      .getById(id)
      .then(({ data }) => form.setFieldsValue(data))
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

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
      .update(id, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchCurrencies({}));
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchCurrency(id);
    }
  }, [activeMenu.refetch]);

  const options = currency.map((item) => ({
    label: item?.name.toUpperCase() + ' ' + `( ${item.symbol_native} )`,
    value: item.code,
    symbol: item.symbol_native,
  }));

  return (
    <Card title={t('edit.currency')}>
      {loading ? (
        <Loading />
      ) : (
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
                    (option?.label ?? '').includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toUpperCase()
                      .localeCompare((optionB?.label ?? '').toUpperCase())
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
      )}
    </Card>
  );
}
