import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Select, Input } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import productService from '../../services/product';
import requestAdminModelsService from 'services/request-models';
import { disableRefetch } from '../../redux/slices/menu';
import { fetchProducts } from '../../redux/slices/product';
import { toast } from 'react-toastify';
import { fetchRequestModels } from 'redux/slices/request-models';

const productStatuses = ['published', 'pending', 'unpublished'];
const requestStatuses = ['accept', 'decline'];
const body = {
  type: 'product',
};

export default function ProductStatusModal({
  orderDetails: data,
  handleCancel,
  paramsData,
  listType = 'product',
}) {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(data?.status);
  const statuses = listType === 'request' ? requestStatuses : productStatuses;

  const productStatusUpdate = (id, params) => {
    productService
      .updateStatus(id, params)
      .then(() => {
        handleCancel();
        toast.success(t('successfully.updated'));
        dispatch(fetchProducts(paramsData));
        dispatch(disableRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
  };

  const requestStatusChange = (id, data) => {
    const params = {
      status_note: data.status_note,
      status: data.status === 'accept' ? 'approved' : 'canceled',
    };

    requestAdminModelsService
      .changeStatus(id, params)
      .then(() => {
        handleCancel();
        toast.success(t('successfully.updated'));
        dispatch(fetchRequestModels(body));
        dispatch(disableRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
  };

  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values };
    if (listType === 'product') {
      productStatusUpdate(data.uuid, params);
    } else if (listType) {
      requestStatusChange(data.id, params);
    }
  };

  return (
    <Modal
      visible={!!data}
      title={data.title}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' onClick={() => form.submit()} loading={loading}>
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
        initialValues={
          listType === 'product'
            ? { status: data.status, status_note: data.status_note }
            : { status: 'accept', status_note: data.status_note }
        }
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
              <Select onChange={(status) => setStatus(status)}>
                {statuses.map((item, idx) => (
                  <Select.Option key={item + idx} value={item}>
                    {t(item)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {(status === 'unpublished' || status === 'decline') && (
              <Form.Item
                name='status_note'
                label={t('note')}
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2')),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.TextArea maxLength={250} showCount />
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
