import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { batch, useDispatch, shallowEqual, useSelector } from 'react-redux';
import { statuses } from './statuses';
import sellerUserService from 'services/seller/user';
import { fetchSellerDeliverymans } from 'redux/slices/deliveryman';
import { disableRefetch } from 'redux/slices/menu';

const DeliverymanStatusModal = ({ data, handleCancel, paramsData }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    console.log(values);
    const params = { ...values };
    sellerUserService
      .statusChange(data?.invite?.id, params)
      .then(() => {
        handleCancel();
        batch(() => {
          dispatch(fetchSellerDeliverymans(paramsData));
          dispatch(disableRefetch(activeMenu));
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={!!data}
      title={t(data?.name)}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' onClick={() => form.submit()} loading={loading}>
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
      key={data?.invite?.id}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          status: statuses.filter(
            (item) => item.label === data?.invite?.status,
          )?.[0],
        }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('status')}
              name='status'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select>
                {statuses.map((item) => (
                  <Select.Option key={item?.key} value={item?.label}>
                    {t(item?.label)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeliverymanStatusModal;
