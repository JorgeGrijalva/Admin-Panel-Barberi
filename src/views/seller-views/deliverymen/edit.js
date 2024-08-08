import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { disableRefetch, setMenuData, setRefetch } from 'redux/slices/menu';
import { useParams } from 'react-router-dom';
import sellerUserServices from 'services/seller/user';
import moment from 'moment/moment';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import DeliverymanForm from './form';
import useDidUpdate from 'helpers/useDidUpdate';

export default function DeliverymenInvitationEdit() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { uuid } = useParams();
  const dispatch = useDispatch();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(false);

  const getDeliveryman = () => {
    setLoading(true);
    sellerUserServices
      .getById(uuid)
      .then((res) => {
        const body = {
          ...res?.data,
          birthday: res?.data?.birthday ? moment(res?.data?.birthday) : null,
        };
        form.setFieldsValue(body);
        dispatch(
          setMenuData({
            activeMenu,
            data: {
              ...res?.data,
              deliveryman_settings_id: res?.data?.delivery_man_setting?.id,
              deliveryman_id: res?.data?.id,
            },
          }),
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      getDeliveryman();
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    getDeliveryman();
  }, []);

  useEffect(() => {
    if (!form.getFieldValue('') && !activeMenu.refetch) {
      dispatch(setRefetch(activeMenu));
    }
  }, []);

  const handleSubmit = (body) => {
    return sellerUserServices.update(uuid, body);
  };

  return (
    <Card title={t('edit.deliveryman')} loading={loading}>
      <DeliverymanForm form={form} handleSubmit={handleSubmit} />
    </Card>
  );
}
