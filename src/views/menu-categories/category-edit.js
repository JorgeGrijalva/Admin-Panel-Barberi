import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Modal } from 'antd';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch } from '../../redux/slices/menu';
import categoryService from '../../services/category';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import { setRefetch } from 'redux/slices/menu';

const MenuCategoryEdit = ({ isModalOpen, handleCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  const uuid = isModalOpen?.uuid;

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

  const getCategory = (alias) => {
    setLoading(true);
    categoryService
      .getById(alias)
      .then((res) => {
        let category = res.data;
        const body = {
          ...getLanguageFields(category),
        };
        form.setFieldsValue(body);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      ...values,
      type: 'menu',
    };

    console.log('isModalOpen => ', isModalOpen);

    categoryService
      .update(uuid, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .catch((err) => console.error(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (isModalOpen) getCategory(isModalOpen.uuid);
  }, [isModalOpen]);

  return (
    <Modal
      visible={isModalOpen}
      title={t('edit.menu.category')}
      onCancel={handleCancel}
      footer={[
        <Button
          loading={loadingBtn}
          type='primary'
          key={'saveBtn'}
          onClick={() => form.submit()}
        >
          {t('save')}
        </Button>,
        <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Card extra={<LanguageList />} loading={loading}>
        <Form
          name='basic'
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            ...activeMenu.data,
          }}
          form={form}
        >
          {languages.map((item, index) => (
            <Form.Item
              key={item.title + index}
              label={t('name')}
              name={`title[${item.locale}]`}
              rules={[
                {
                  required: item.locale === defaultLang,
                  message: t('required'),
                },
              ]}
              hidden={item.locale !== defaultLang}
            >
              <Input placeholder={t('name')} className='w-100' />
            </Form.Item>
          ))}
        </Form>
      </Card>
    </Modal>
  );
};
export default MenuCategoryEdit;
