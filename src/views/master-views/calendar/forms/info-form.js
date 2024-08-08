import React, { useContext } from 'react';
import { DebounceSelect } from 'components/search';
import { t } from 'i18next';
import { AsyncSelect } from 'components/async-select';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Typography } from 'antd';
import { fetchPayments, fetchUsers } from '../helpers';
import ServiceCard from '../components/service-card';
import { BookingContext } from '../provider';
const { Title } = Typography;

const InfoFormItems = ({
  isDisabled,
  title = 'new.booking',
  isAdd = false,
}) => {
  const { calculatedData, setViewContent, setInfoData, infoForm } =
    useContext(BookingContext);

  return (
    <Row gutter={12}>
      <Col span={24} className='mb-4'>
        <Title level={2}>{t(title)}</Title>
      </Col>
      <Col span={24}>
        <Form.Item
          name='client'
          label={t('select.client')}
          placeholder={t('select.client')}
          rules={[{ required: true, message: t('required') }]}
        >
          <DebounceSelect
            fetchOptions={fetchUsers}
            style={{ width: '100%' }}
            disabled
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          name='payment_id'
          rules={[{ required: true, message: t('required') }]}
          label={t('payment')}
        >
          <AsyncSelect
            className='w-100'
            refetch
            placeholder={t('select.payment.type')}
            fetchOptions={fetchPayments}
            disabled
          />
        </Form.Item>
      </Col>
      {calculatedData?.items?.map((item) => (
        <Col span={24} key={item.id}>
          <ServiceCard item={item} />
        </Col>
      ))}
      {isAdd && (
        <Col span={24}>
          <Button
            block
            type='dashed'
            icon={<PlusOutlined />}
            disabled={isDisabled}
            onClick={() => {
              setInfoData(infoForm?.getFieldsValue());
              setViewContent('serviceForm');
            }}
          >
            {t('add.service')}
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default InfoFormItems;
