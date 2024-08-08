import React, { useState } from 'react';
import { Button, Form, Input, Modal, Radio } from 'antd';
import inviteService from '../../../services/seller/invites';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchInvites } from '../../../redux/slices/invite';

export default function InviteModal({ inviteId: data, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);

  const onFinish = (values) => {
    const params = {
      role: values.role,
    };
    setLoadingBtn(true);
    inviteService
      .statusUpdate(data.id, params)
      .then(() => {
        handleCancel();
        dispatch(fetchInvites());
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      title={t('accept.invite')}
      visible={!!data}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
          key='save-btn'
        >
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel} key='cancel-btn'>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item label={t('user')}>
          <Input
            value={data.user.firstname + ' ' + data.user.lastname}
            disabled
          />
        </Form.Item>
        <Form.Item
          label={t('select.role')}
          name='role'
          rules={[{ required: true, message: t('required') }]}
        >
          <Radio.Group optionType='button'>
            <Radio value={'moderator'}>{t('moderator')}</Radio>
            <Radio value={'deliveryman'}>{t('deliveryman')}</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
