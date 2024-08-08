import { useTranslation } from 'react-i18next';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import shopService from '../../../services/shop';
import userService from '../../../services/user';
import servicesService from '../../../services/services';
import { toast } from 'react-toastify';
import { fetchAdminServiceMaster } from '../../../redux/slices/serviceMaster';
import { Button, Col, Form, InputNumber, Row, Select, Switch } from 'antd';
import { DebounceSelect } from '../../../components/search';
import { RefetchSearch } from '../../../components/refetch-search';

const serviceTypes = ['online', 'offline_in', 'offline_out'];
const genderTypes = [
  { value: 1, label: 'male' },
  { value: 2, label: 'female' },
  { value: 3, label: 'all' },
];

function ServiceMasterForm({ form, onSubmit, setVisibleComponent }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const tempServiceValues = useRef([]);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const fetchShops = (search) => {
    const paramsData = {
      page: 1,
      perPage: 20,
      status: 'approved',
      search,
    };
    if (!search?.trim()?.length) delete paramsData.search;

    return shopService.getAll(paramsData).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const fetchMasters = (search) => {
    const paramsData = {
      page: 1,
      perPage: 20,
      search,
      role: 'master',
    };
    if (!search?.trim()?.length) delete paramsData.search;

    return userService.getAll(paramsData).then((res) =>
      res.data.map((item) => ({
        label: `${item.firstname} ${item.lastname}`,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const fetchServiceList = (search) => {
    const params = { search, active: 1 };
    return servicesService.getAll(params).then((res) => {
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

    const params = {
      ...values,
      shop_id: values.shop.value,
      service_id: values.service.value,
      active: values.active ? 1 : 0,
      master_id: activeMenu.data?.id,
      shop: undefined,
      service: undefined,
    };

    return onSubmit(params)
      .then(() => {
        toast.success('successfully.added');
        setVisibleComponent('table');
        dispatch(fetchAdminServiceMaster({ master_id: activeMenu.data?.id }));
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  return (
    <Form
      onFinish={onFinish}
      form={form}
      layout='vertical'
      initialValues={{
        active: true,
        shop: {
          label: !!activeMenu.data?.invitations?.[0]
            ? activeMenu.data?.invitations[0]?.shop?.translation?.title
            : t('shop.not.found'),
          value: activeMenu.data?.invitations[0]?.shop?.id,
        },
      }}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            label={t('shop')}
            name='shop'
            rules={[{ required: true, message: t('required') }]}
          >
            <Select disabled />
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
