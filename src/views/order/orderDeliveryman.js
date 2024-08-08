import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import orderService from '../../services/order';
import { setRefetch } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import userService from '../../services/user';
import { DebounceSelect } from '../../components/search';

export default function OrderDeliveryman({ orderDetails: data, handleCancel }) {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    const params = { deliveryman_id: values.deliveryman.value };
    setLoading(true);
    orderService
      .updateDelivery(data.id, params)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
  };
  async function fetchDelivery(search) {
    const params = {
      search: search.length ? search : undefined,
      page: 1,
      perPage: 10,
      role: 'deliveryman',
      exist_token: 1,
    };
    return userService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.firstname + ' ' + item.lastname || 'no name',
        value: item.id,
      }))
    );
  }

  return (
    <Modal
      visible={!!data}
      onCancel={handleCancel}
      footer={[
        <Button
          key='saveBtn'
          type='primary'
          onClick={() => form.submit()}
          loading={loading}
        >
          {t('save')}
        </Button>,
        <Button key='cancelBtn' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          deliveryman: {
            label: data.deliveryman
              ? data?.deliveryman?.firstname + ' ' + data?.deliveryman?.lastname
              : null,
            value: data.deliveryman ? data?.deliveryman?.id : null,
          },
        }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('deliveryman')}
              name='deliveryman'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect
                className='w-100'
                debounceTimeout={500}
                placeholder={t('select.shop')}
                fetchOptions={fetchDelivery}
                allowClear={true}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
