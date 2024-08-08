import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import serviceMasterService from '../../../services/master/serviceMaster';
import { disableRefetch } from '../../../redux/slices/menu';
import { value } from 'lodash/seq';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ServiceMasterForm from './service-master-form';

function ServiceMasterAdd() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { id } = useParams();

  const { activeMenu } = useSelector((state) => state.menu);

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({});

  const handleSubmit = (payload) => {
    return serviceMasterService.update(id, payload);
  };

  const getMasterServiceById = (id) => {
    setLoading(true);
    serviceMasterService
      .getById(id)
      .then(({ data }) => {
        setInitialValues({
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
    if (activeMenu.refetch) {
      getMasterServiceById(id);
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <Card title={t('add.service.master')} loading={loading}>
      {!loading && (
        <ServiceMasterForm
          form={form}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        />
      )}
    </Card>
  );
}

export default ServiceMasterAdd;
