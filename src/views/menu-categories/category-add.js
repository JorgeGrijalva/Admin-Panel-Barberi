import React from 'react';
import { Button, Card, Form, Input, Modal } from 'antd';
import { toast } from 'react-toastify';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import categoryService from '../../services/category';
import { useTranslation } from 'react-i18next';
import { setRefetch } from 'redux/slices/menu';
import LanguageList from 'components/language-list';

const MenuCategoryAdd = ({ isModalOpen, handleCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  const onFinish = (values) => {
    const body = {
      type: 'menu',
      ...values,
    };
    categoryService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Modal
      visible={isModalOpen}
      title={t('add.menu.category')}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' key={'saveBtn'} onClick={() => form.submit()}>
          {t('save')}
        </Button>,
        <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Card extra={<LanguageList />}>
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
                  validator(_, value) {
                    if (!value && item?.locale === defaultLang) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
                    }
                    return Promise.resolve();
                  },
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
export default MenuCategoryAdd;
