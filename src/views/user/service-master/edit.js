import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Form, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import ServiceMasterForm from './form';
import serviceMasterService from '../../../services/service-master';
import { disableRefetch } from '../../../redux/slices/menu';

function ServiceMasterEdit({ setVisibleComponent, editId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu);
  const [loading, setLoading] = useState(true);

  const handleSubmit = (payload) => {
    return serviceMasterService.update(editId, payload);
  };

  const getMasterServiceById = (id) => {
    setLoading(true);
    serviceMasterService
      .getById(id)
      .then(({ data }) => {
        form.setFieldsValue({
          master: {
            value: data.master?.id,
            label: `${data.master.firstname} ${data.master.lastname}`,
          },
          shop: {
            value: data.shop_id,
            label: data.shop?.translation?.title,
            key: data.shop_id,
          },
          service: {
            value: data?.service_id,
            label: data?.service?.translation?.title,
            key: data?.service_id,
          },
          price: data.price,
          interval: data.interval,
          pause: data.pause,
          commission_fee: data.commission_fee,
          active: data.active,
          discount: data.discount,
          type: data.type,
          gender: data.gender,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getMasterServiceById(editId);
  }, []);

  return (
    <Card
      title={t('add.service.master')}
      loading={loading}
      extra={
        <Space>
          <Button onClick={() => setVisibleComponent('table')}>
            {t('back')}
          </Button>
        </Space>
      }
    >
      {!loading && (
        <ServiceMasterForm
          form={form}
          onSubmit={handleSubmit}
          setVisibleComponent={setVisibleComponent}
        />
      )}
    </Card>
  );
}

export default ServiceMasterEdit;
