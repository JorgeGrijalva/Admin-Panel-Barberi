import React, { useState } from 'react';
import { Button, Col, Form, InputNumber, Modal, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import pointService from 'services/points';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setRefetch } from 'redux/slices/menu';
import { DebounceSelect } from 'components/search';
import shopService from 'services/restaurant';

export default function CashbackModal({ visibility, handleCancel }) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function fetchShops(search) {
    const params = { search, status: 'approved' };
    return shopService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      })),
    );
  }

  const onFinish = (values) => {
    setLoading(true);
    const payload = {
      ...values,
      type: 'percent',
      shop_id: values.shop_id.value,
    };
    pointService
      .create(payload)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={visibility}
      title={t('add.cashback')}
      onCancel={handleCancel}
      footer={[
        <Button
          key='save-cashback'
          type='primary'
          onClick={() => form.submit()}
          loading={loading}
        >
          {t('save')}
        </Button>,
        <Button key='cancel-cashback' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('shop/restaurant')}
              name='shop_id'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect
                placeholder={t('select.shop')}
                fetchOptions={fetchShops}
                style={{ minWidth: 150 }}
                allowClear={false}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={t('cashback')}
              name='price'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <InputNumber min={0} className='w-100' addonAfter='%' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('min.amount')}
              name='value'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <InputNumber min={0} className='w-100' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
