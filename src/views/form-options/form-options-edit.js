import FormOptionContextProvider, {
  FormOptionContext,
} from './form-option-context';
import FormOptionsForm from './form-options-form';
import formOptionService from '../../services/form-option';
import { Card, Form } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { disableRefetch } from '../../redux/slices/menu';
import LanguageList from '../../components/language-list';
import { useTranslation } from 'react-i18next';
import { ACTION_TYPES } from './utils';

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
    formOptionService
      .getById(id)
      .then((res) => {
        form.setFieldsValue({
          ...getLanguageFields(res.data),
          required: !!res.data?.required,
          active: !!res.data?.active,
          shop: {
            value: res.data?.shop_id,
            label: res.data?.shop?.translation?.title,
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
      [`short_desc[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.short_desc,
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
    return formOptionService.update(id, body);
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
