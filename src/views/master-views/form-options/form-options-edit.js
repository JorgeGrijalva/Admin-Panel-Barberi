import { useTranslation } from 'react-i18next';
import { Card, Form } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { disableRefetch } from '../../../redux/slices/menu';
import LanguageList from '../../../components/language-list';
import FormOptionContextProvider, {
  FormOptionContext,
} from './form-option-context';
import masterFormOptionsService from '../../../services/master/form-options';
import { ACTION_TYPES } from './utils';
import FormOptionsForm from './form-options-form';

function Component() {
  return (
    <FormOptionContextProvider>
      <EditForm />
    </FormOptionContextProvider>
  );
}

function EditForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { formOptionsDispatch } = useContext(FormOptionContext);
  const [loading, setLoading] = useState(false);

  const fetchFormOption = (id) => {
    setLoading(true);
    masterFormOptionsService
      .getById(id)
      .then((res) => {
        form.setFieldsValue({
          ...getLanguageFields(res.data),
          required: !!res.data?.required,
          active: !!res.data?.active,
          service: {
            value: res.data?.service_master_id,
            label: res.data?.service_master?.service?.translation?.title,
          },
        });
        formOptionsDispatch({
          type: ACTION_TYPES.setFormItemsState,
          payload: res.data.data,
        });
      })
      .finally(() => setLoading(false));
  };

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.description,
    }));
    return Object.assign({}, ...result);
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(disableRefetch(activeMenu));
      fetchFormOption(id);
    }
  }, [activeMenu.refetch]);

  const handleSubmit = (body) => {
    return masterFormOptionsService.update(id, body);
  };

  return (
    <Card
      loading={loading}
      title={t('edit.form.options')}
      extra={<LanguageList />}
    >
      {!loading && <FormOptionsForm onSubmit={handleSubmit} form={form} />}
    </Card>
  );
}

export default Component;
