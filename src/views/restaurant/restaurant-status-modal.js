import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setRefetch } from '../../redux/slices/menu';
import restaurantService from '../../services/restaurant';
import useDemo from '../../helpers/useDemo';
import { fetchRestourant } from '../../redux/slices/restourant';

const statuses = ['new', 'approved', 'rejected'];

export default function RestaurantStatusModal({
  data,
  handleCancel,
  paramsData,
}) {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { isDemo, demoShop } = useDemo();

  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values };
    restaurantService
      .statusChange(data.uuid, params)
      .then(() => {
        handleCancel();
        dispatch(fetchRestourant(paramsData));
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={!!data}
      title={t(data.name)}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          onClick={() => form.submit()}
          loading={loading}
          disabled={isDemo && data.id == demoShop} // do not touch
        >
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ status: data.status }}
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
                {statuses.map((item, idx) => (
                  <Select.Option key={item + idx} value={item}>
                    {t(item)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
