import React from 'react';
import { Button, Col, Form, Input, Row, Select, Tag, Typography } from 'antd';
import { t } from 'i18next';
import { AsyncSelect } from 'components/async-select';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Map from 'components/map';
import { fetchService } from '../helpers';
import AddressForm from 'components/forms/address-form';
const { Title } = Typography;

const ServiceFormItems = ({
  shop,
  setOpen,
  getServiceByID,
  selectedService,
  form,
  location,
  setLocation,
  value,
  setValue,
  defaultLang,
}) => {
  return (
    <Row>
      <Col span={24}>
        <Tag
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            setOpen('addService');
            form.resetFields();
          }}
        />
        <Title className='my-4' level={2}>
          {t('select.service')}
        </Title>
      </Col>
      <Col span={24}>
        <Form.Item
          name='service'
          label={t('select.service')}
          placeholder={t('select.service')}
          rules={[{ required: true, message: t('required') }]}
        >
          <AsyncSelect
            refetch
            disabled={!shop}
            className='w-100'
            onChange={(value) => getServiceByID(value)}
            fetchOptions={() => fetchService({ shop_id: shop.value })}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name='extras' label={t('select.service.extras')}>
          <Select
            disabled={!selectedService?.service_extras?.length}
            options={selectedService?.service_extras?.map((extra) => ({
              label: extra?.translation?.title || t('N/A'),
              value: extra?.id,
              key: extra?.id,
            }))}
            labelInValue
            placeholder={t('select.extra')}
            mode='multiple'
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          name='note'
          label={t('note')}
          rules={[{ required: false, message: t('required') }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Col>
      {Boolean(selectedService?.type === 'offline_out') && (
        <Col span={24}>
          <AddressForm
            value={value}
            setValue={setValue}
            setLocation={setLocation}
          />
          <Map
            location={location}
            setLocation={setLocation}
            setAddress={(value) => {
              form.setFieldsValue({
                [`address[${defaultLang}]`]: value,
              });
            }}
          />
        </Col>
      )}
      <Col span={24} className='mt-4'>
        <Button type='primary' htmlType='submit' className='w-100'>
          {t('submit')}
        </Button>
      </Col>
    </Row>
  );
};

export default ServiceFormItems;
