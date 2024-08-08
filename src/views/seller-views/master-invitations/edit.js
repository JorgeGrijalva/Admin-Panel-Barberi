import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import FormMaster from './form';
import sellerUserServices from 'services/seller/user';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useDidUpdate from 'helpers/useDidUpdate';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { disableRefetch, setMenuData, setRefetch } from 'redux/slices/menu';
import moment from 'moment';
import { fetchMasterDisabledTimesAsSeller } from '../../../redux/slices/disabledTimes';

export default function EditMasterInvitation() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { uuid } = useParams();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [loading, setLoading] = useState(false);

  const getMaster = () => {
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
            data: { ...res?.data, master_id: res?.data?.id },
          }),
        );

        dispatch(fetchMasterDisabledTimesAsSeller({ master_id: res.data?.id }));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      getMaster();
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    getMaster();
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
    <Card title={t('edit.master')} loading={loading}>
      <FormMaster form={form} handleSubmit={handleSubmit} />
    </Card>
  );
}
