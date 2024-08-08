import { Button, Form, Modal, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setRefetch } from '../../redux/slices/menu';
import { payoutService } from '../../services/payout';

export default function PayoutStatusChangeModal({
  data,
  handleCancel,
  statuses,
}) {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChangeStatus = (values) => {
    setLoading(true);
    payoutService
      .changeStatus(data?.id, values)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
  };
  return (
    <Modal
      visible={!!data}
      title={t('change.status')}
      onCancel={handleCancel}
      footer={[
        <Button onClick={handleCancel}>{t('cancel')}</Button>,
        <Button loading={loading} key='pay-btn' type='primary' form='status' htmlType='submit'>
          {t('change')}
        </Button>,
      ]}
    >
      <Form initialValues={{status: data?.status}} onFinish={handleChangeStatus} id='status' layout='vertical'>
        <Form.Item label={t('status')} name='status'>
          <Select
            options={statuses.slice(1).map((status) => ({
              label: t(status),
              value: status,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
