import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import ServiceNotificationsForm from './form';
import LanguageList from '../../../components/language-list';
import serviceNotificationsService from '../../../services/master/serviceNotifications';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch } from '../../../redux/slices/menu';
import moment from 'moment';

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
            value: data.service_master?.id,
            label: data.service_master?.service?.translation?.title,
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
