import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import serviceExtraService from 'services/service-extra';
import { useParams } from 'react-router-dom';
import LanguageList from 'components/language-list';
import getLanguageFields from 'helpers/getLanguageFields';
import createImage from 'helpers/createImage';
import useDidUpdate from 'helpers/useDidUpdate';
import ServiceExtraForm from './form';

function EditServiceExtra() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  const [loading, setLoading] = useState(true);

  const getServiceExtraById = (id) => {
    setLoading(true);
    serviceExtraService
      .getById(id)
      .then(({ data }) => {
        const body = {
          ...getLanguageFields(languages, data, ['title']),
          active: !!data.active,
          service: {
            label: data?.service?.translation?.title,
            value: data?.service?.id,
            key: data?.service?.id,
          },
          price: data?.price || 0,
          img: !!data?.img?.length ? [createImage(data?.img)] : [],
        };
        dispatch(
          setMenuData({ activeMenu, data: { serviceExtrasForm: body } }),
        );
        form.setFieldsValue(body);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getServiceExtraById(id);
    dispatch(disableRefetch(activeMenu));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDidUpdate(() => {
    if (activeMenu.refetch) {
      getServiceExtraById(id);
      dispatch(disableRefetch(activeMenu));
    }
  });

  const handleSubmit = (body) => {
    return serviceExtraService.update(id, body);
  };

  return (
    <Card
      title={t('edit.service.extra')}
      loading={loading}
      extra={<LanguageList />}
    >
      <ServiceExtraForm form={form} onSubmit={handleSubmit} />
    </Card>
  );
}

export default EditServiceExtra;
