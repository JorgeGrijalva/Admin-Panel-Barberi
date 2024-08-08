import React from 'react';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Tag,
  Typography,
} from 'antd';
import { t } from 'i18next';
import { AsyncSelect } from 'components/async-select';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchMasterList, fetchService, fetchShops } from '../helpers';

const { Title } = Typography;

const ServiceUpdateFormItems = ({
  shop,
  setViewContent,
  getServiceByID,
  getMasterByID,
  selectedService,
  form,
}) => {
  return (
    <Row gutter={12}>
      <Col span={24}>
        <Tag
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            form.resetFields();
            setViewContent('updateForm');
          }}
        />
        <Title className='my-4' level={2}>
          {t('edit.service')}
        </Title>
      </Col>
      <Col span={12}>
        <Form.Item
          name='shop'
          label={t('select.shop')}
          placeholder={t('select.shop')}
          rules={[{ required: true, message: t('required') }]}
        >
          <AsyncSelect className='w-100' fetchOptions={fetchShops} />
        </Form.Item>
      </Col>
      <Col span={12}>
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
      <Col span={12}>
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
      <Col span={12}>
        <Form.Item
          name='master'
          label={t('select.master')}
          placeholder={t('select.master')}
          rules={[{ required: true, message: t('required') }]}
        >
          <AsyncSelect
            refetch
            className='w-100'
            disabled={!selectedService}
            onChange={(value) => getMasterByID(value)}
            fetchOptions={() =>
              fetchMasterList({
                shop_id: shop?.value,
                service_id: selectedService?.id,
              })
            }
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label={t('start.date')}
          name='start_date'
          rules={[
            {
              required: true,
              message: t('required'),
            },
          ]}
        >
          <DatePicker className='w-100' showTime />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t('end.date')}
          name='end_date'
          rules={[
            {
              required: true,
              message: t('required'),
            },
          ]}
        >
          <DatePicker className='w-100' showTime />
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
    </Row>
  );
};

export default ServiceUpdateFormItems;
