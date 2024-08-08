import React, { useState } from 'react';
import { Button, Form, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { DebounceSelect } from '../../../components/search';
import { addMenu, setRefetch } from '../../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import sellerCategory from '../../../services/seller/category';
import { useNavigate } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';

export default function CreateCategory({ isModalOpen, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const body = {
      ...Object.assign(
        {},
        ...values.title.map((item, index) => ({
          [`categories[${index}]`]: item.value,
        }))
      ),
      type: 'main',
    };
    setLoading(true);
    sellerCategory
      .create(body)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  async function fetchCategories(search) {
    const params = {
      search: search.length !== 0 ? search : null,
      perPage: 10,
      type: 'main',
    };
    return sellerCategory.search(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }))
    );
  }

  const goToAddCategory = () => {
    dispatch(
      addMenu({
        url: `seller/category/add`,
        id: 'seller/category/add',
        name: t('edit.category'),
      })
    );
    navigate(`/seller/category/add`);
  };

  return (
    <Modal
      visible={isModalOpen}
      title={t('add.category')}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          key={'add.new'}
          onClick={() => goToAddCategory()}
          loading={loading}
          icon={<PlusCircleOutlined />}
        >
          {t('add.new.category')}
        </Button>,
        <Button
          type='primary'
          key={'save.from'}
          onClick={() => form.submit()}
          loading={loading}
        >
          {t('save')}
        </Button>,
        <Button type='default' key={'cancel.form'} onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        layout='vertical'
        name='user-address'
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name='title'
          label={t('title')}
          rules={[{ required: true, message: 'required' }]}
        >
          <DebounceSelect
            mode='multiple'
            placeholder='Select category'
            fetchOptions={fetchCategories}
            style={{ minWidth: 150 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
