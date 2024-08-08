import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import userService from '../../services/user';
import { toast } from 'react-toastify';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setRefetch } from '../../redux/slices/menu';

export default function UserWalletModal({ modal, uuid, handleCancel }) {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const onFinish = (values) => {
    setLoadingBtn(true);
    userService
      .topupWallet(uuid, values)
      .then(() => {
        toast.success(t('successfully.added'));
        dispatch(setRefetch(activeMenu));
        handleCancel();
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      visible={modal}
      title={t('topup.wallet')}
      onCancel={handleCancel}
      footer={[
        <Button key={'cancel-btn'} type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
        <Button
          key={'submit-btn'}
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>,
      ]}
    >
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Form.Item
          label={t('price')}
          name='price'
          rules={[
            {
              required: true,
              message: t('required'),
            },
          ]}
        >
          <InputNumber min={0} className='w-100' />
        </Form.Item>
        <Form.Item label={t('note')} name='note'>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
