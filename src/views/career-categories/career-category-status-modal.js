import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { disableRefetch } from '../../redux/slices/menu';
import categoryService from 'services/category';
import { fetchCareerCategories } from '../../redux/slices/career-category';

const allStatuses = ['published', 'pending', 'unpublished'];

export default function CategoryStatusModal({
  categoryDetails: data,
  handleCancel,
  paramsData,
}) {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values };
    categoryService
      .statusUpdate(data.uuid, params)
      .then(() => {
        handleCancel();
        dispatch(fetchCareerCategories(paramsData));
        dispatch(disableRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
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
                {allStatuses.map((item, idx) => (
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
