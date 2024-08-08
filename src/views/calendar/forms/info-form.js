import React, { useContext, useState } from 'react';
import { DebounceSelect } from 'components/search';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, Typography } from 'antd';
import { fetchShops, fetchUsers } from '../helpers';
import ServiceCard from '../components/service-card';
import { BookingContext } from '../provider';
import CreateUserModal from '../components/create-user-modal';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const InfoFormItems = ({
  isDisabled,
  title = 'new.booking',
  isAdd = false,
}) => {
  const { t } = useTranslation();
  const { calculatedData, setViewContent, setInfoData, infoForm } =
    useContext(BookingContext);
  const [createUserModal, setCreateUserModal] = useState(false);

  return (
    <>
      <Row gutter={12}>
        <Col span={24} className='mb-4'>
          <Title level={2}>{t(title)}</Title>
        </Col>
        <Col span={24}>
          <Form.Item
            name='shop'
            label={t('select.shop')}
            placeholder={t('select.shop')}
            rules={[{ required: true, message: t('required') }]}
          >
            <DebounceSelect
              disabled={!isAdd}
              className='w-100'
              fetchOptions={fetchShops}
            />
          </Form.Item>
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
              refetchOptions={true}
              disabled={!isAdd}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name='payment_id'
            rules={[{ required: true, message: t('required') }]}
            label={t('payment')}
          >
            <Select disabled={!isAdd} placeholder={t('select.payment.type')}>
              <Select.Option value={1}>{t('cash')}</Select.Option>
            </Select>
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
      <CreateUserModal
        isOpen={createUserModal}
        handleCancel={() => setCreateUserModal(false)}
      />
    </>
  );
};

export default InfoFormItems;
