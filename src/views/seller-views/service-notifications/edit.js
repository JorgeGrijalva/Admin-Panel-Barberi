import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Card, Form } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';
import { disableRefetch } from '../../../redux/slices/menu';
import LanguageList from '../../../components/language-list';
import serviceNotificationsService from '../../../services/seller/service-notifications';
import ServiceNotificationsForm from './form';

function EditServiceNotifications() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const [loading, setLoading] = useState(false);

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;

    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
    }));
    return Object.assign({}, ...result);
  }

  const getServiceNotificationBy = (id) => {
    setLoading(true);
    serviceNotificationsService
      .getById(id)
      .then(({ data }) => {
        form.setFieldsValue({
          ...getLanguageFields(data),
          service_master: {
            label: `${data?.service_master?.master?.full_name} , ${data?.service_master?.service?.translation?.title}`,
            value: data?.service_master?.id,
            key: data?.service_master?.id,
          },
          notification_time: data.notification_time,
          notification_type: data.notification_type,
          last_sent_at: moment(data.last_sent_at),
        });
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (payload) => {
    return serviceNotificationsService.update(id, payload);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(disableRefetch(activeMenu.refetch));
      getServiceNotificationBy(id);
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('add.service.notification')}
      extra={<LanguageList />}
      loading={loading}
    >
      <ServiceNotificationsForm form={form} onSubmit={handleSubmit} />
    </Card>
  );
}

export default EditServiceNotifications;