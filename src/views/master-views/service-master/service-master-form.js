import { Button, Col, Form, InputNumber, Row, Select, Switch } from 'antd';
import { DebounceSelect } from '../../../components/search';
import { RefetchSearch } from '../../../components/refetch-search';
import React, { useRef, useState } from 'react';
import serviceMasterService from '../../../services/master/serviceMaster';
import { toast } from 'react-toastify';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu } from '../../../redux/slices/menu';
import { fetchMasterServiceMaster } from '../../../redux/slices/serviceMaster';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const serviceTypes = ['online', 'offline_in', 'offline_out'];
const genderTypes = [
  { value: 1, label: 'male' },
  { value: 2, label: 'female' },
  { value: 3, label: 'other' },
];

function ServiceMasterForm({ form, onSubmit, initialValues = {} }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { user } = useSelector((state) => state.auth);
  const tempServiceValues = useRef([]);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const fetchServiceList = (search) => {
    const params = { search, active: 1 };
    return serviceMasterService.searchServices(params).then((res) => {
      const serviceList = res.data.map((item) => ({
        label: item.translation ? item.translation.title : 'no name',
        value: item.id,
        key: item.id,
        price: item.price,
        interval: item.interval,
        pause: item.pause,
        commission_fee: item.commission_fee,
        type: item.type,
        gender: item.gender,
      }));
      tempServiceValues.current = serviceList;
      return serviceList;
    });
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const nextUrl = 'master/service-master';

    const params = {
      ...values,
      shop_id: values.shop.value,
      service_id: values.service.value,
      active: values.active ? 1 : 0,
      shop: undefined,
      service: undefined,
    };

    return onSubmit(params)
      .then(() => {
        toast.success('successfully.added');
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchMasterServiceMaster({}));
          navigate('/' + nextUrl);
        });
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  return (
    <Form
      initialValues={{
        active: Object.keys(initialValues).length
          ? !!initialValues.active
          : true,
        shop: {
          value: user.invite?.shop_id,
          label: user.invite?.shop?.translation?.title || 'shop not found',
        },
        ...initialValues,
      }}
      onFinish={onFinish}
      form={form}
      layout='vertical'
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            label={t('shop')}
            name='shop'
            rules={[{ required: true, message: t('required') }]}
          >
            <DebounceSelect disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('service')}
            name='service'
            rules={[{ required: true, message: t('required') }]}
          >
            <RefetchSearch
              fetchOptions={fetchServiceList}
              refetch={true}
              onChange={(value) => {
                const serviceDefaultValues = tempServiceValues.current?.find(
                  (serviceItem) => serviceItem.value === value.value,
                );
                form.setFieldsValue({
                  service: value,
                  ...serviceDefaultValues,
                });
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('price')}
            name={'price'}
            rules={[{ required: true, message: t('required') }]}
          >
            <InputNumber
              min={0}
              className='w-100'
              addonAfter={defaultCurrency?.symbol}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('interval')}
            name={'interval'}
            rules={[{ required: true, message: t('required') }]}
          >
            <InputNumber min={0} className='w-100' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('pause')}
            name={'pause'}
            rules={[{ required: true, message: t('required') }]}
          >
            <InputNumber min={0} className='w-100' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label='type'
            name='type'
            rules={[{ required: true, message: t('required') }]}
          >
            <Select>
              {serviceTypes.map((item, idx) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('commission.fee')} name={'commission_fee'}>
            <InputNumber min={1} className='w-100' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('discount')}
            name='discount'
            rules={[
              {
                validator: (_, value) => {
                  if (value !== undefined && (value < 0 || value > 100)) {
                    return Promise.reject(
                      new Error(t('must.be.between.0.and.100')),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={0} className='w-100' addonAfter='%' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('gender')}
            name='gender'
            rules={[{ required: true, message: t('required') }]}
          >
            <Select>
              {genderTypes.map((item, idx) => (
                <Select.Option key={item.value} value={item.value}>
                  {t(item.label)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('active')} name='active' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Button type='primary' htmlType='submit' loading={loadingBtn}>
        {t('submit')}
      </Button>
    </Form>
  );
}

export default ServiceMasterForm;
