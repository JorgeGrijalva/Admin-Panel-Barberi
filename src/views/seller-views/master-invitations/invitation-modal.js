import { Button, Col, Form, Modal, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { disableRefetch, setRefetch } from 'redux/slices/menu';
import invitations from 'services/seller/invitations';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

function InvitationModal({ invitationDetails, handleCancel }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(false);

  const statuses = ['new', 'accepted'];

  if (invitationDetails.status === 'canceled') statuses.push('canceled');
  else if (invitationDetails.status === 'rejected') statuses.push('rejected');
  else statuses.push('canceled', 'rejected');

  const onFinish = (values) => {
    setLoading(true);

    invitations
      .statusChange(invitationDetails.id, { status: values.status })
      .then(() => {
        dispatch(setRefetch(activeMenu));
        dispatch(disableRefetch(activeMenu));
        handleCancel();
        toast.success(t('successfully.updated'));
      })
      .finally(() => setLoading(false));
  };
  return (
    <Modal
      onCancel={handleCancel}
      visible={invitationDetails}
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
        layout='vertical'
        initialValues={{ status: invitationDetails.status }}
        form={form}
        onFinish={onFinish}
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

export default InvitationModal;
