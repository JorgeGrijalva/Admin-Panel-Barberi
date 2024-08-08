import React, { useState } from 'react';
import { Button, Form, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { DebounceSelect } from '../../../components/search';
import { addMenu, setRefetch } from '../../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import brandService from '../../../services/seller/brands';
import { PlusCircleOutlined } from '@ant-design/icons';

export default function CreateBrand({ isModalOpen, handleCancel }) {
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
          [`brands[${index}]`]: item.value,
        }))
      ),
    };
    setLoading(true);
    brandService
      .create(body)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  async function fetchBrand(search) {
    const params = {
      search: search.length !== 0 ? search : null,
      perPage: 10,
    };
    return brandService.search(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }))
    );
  }

  const goToAdd = () => {
    dispatch(
      addMenu({
        url: `seller/brand/add`,
        id: 'seller/brand/add',
        name: t('add.brand'),
      })
    );
    navigate(`/seller/brand/add`);
  };

  return (
    <Modal
      visible={isModalOpen}
      title={t('add.brands')}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          key={'save-form'}
          onClick={() => goToAdd()}
          loading={loading}
          icon={<PlusCircleOutlined />}
        >
          {t('add.new.brands')}
        </Button>,
        <Button
          type='primary'
          key={'save'}
          onClick={() => form.submit()}
          loading={loading}
        >
          {t('save')}
        </Button>,
        <Button type='default' key={'cancel'} onClick={handleCancel}>
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
            placeholder='Select brand'
            fetchOptions={fetchBrand}
            style={{ minWidth: 150 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
