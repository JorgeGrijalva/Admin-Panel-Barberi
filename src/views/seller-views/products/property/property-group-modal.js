import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import propertyService from 'services/seller/property';
import { toast } from 'react-toastify';
import { fetchSellerPropertyGroups } from 'redux/slices/propertyGroup';
import getTranslationFields from 'helpers/getTranslationFields';
import Loading from 'components/loading';

export default function PropertyGroupModal({ modal, handleCancel, onSuccess }) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  function fetchGroup(id) {
    setLoading(true);
    propertyService
      .getGroupById(id)
      .then((res) => {
        const data = res.data;
        form.setFieldsValue({ ...data, ...getLanguageFields(data) });
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (modal?.id) {
      fetchGroup(modal.id);
    }
  }, [modal]);

  function createGroup(body) {
    setLoadingBtn(true);
    propertyService
      .createGroup(body)
      .then(() => {
        toast.success(t('successfully.created'));
        handleCancel();
        dispatch(fetchSellerPropertyGroups());
        !!onSuccess && onSuccess();
      })
      .finally(() => setLoadingBtn(false));
  }

  const onFinish = (values) => {
    const body = {
      title: getTranslationFields(languages, values),
      type: 'text',
    };
    if (modal?.id) {
      updateGroup(modal?.id, body);
    } else {
      createGroup(body);
    }
  };

  function updateGroup(id, body) {
    setLoadingBtn(true);
    propertyService
      .updateGroup(id, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(fetchSellerPropertyGroups());
        handleCancel();
      })
      .finally(() => setLoadingBtn(false));
  }

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
    }));
    return Object.assign({}, ...result);
  }

  return (
    <Modal
      title={modal?.id ? t('edit.property.group') : t('add.property.group')}
      visible={!!modal}
      onCancel={handleCancel}
      footer={[
        <Button
          key='save-button-group'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>,
        <Button key='cancel-button-group' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      {!loading ? (
        <>
          <div className='d-flex justify-content-end'>
            <LanguageList />
          </div>
          <Form
            layout='vertical'
            name='property-group'
            form={form}
            onFinish={onFinish}
          >
            {languages.map((item) => (
              <Form.Item
                key={'title' + item.locale}
                rules={[
                  {
                    required: item.locale === defaultLang,
                    message: t('required'),
                  },
                ]}
                name={`title[${item.locale}]`}
                label={t('title')}
                hidden={item.locale !== defaultLang}
              >
                <Input placeholder={t('title')} />
              </Form.Item>
            ))}
          </Form>
        </>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
