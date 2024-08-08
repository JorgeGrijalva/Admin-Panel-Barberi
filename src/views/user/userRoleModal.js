import React, { useState } from 'react';
import { Button, Form, Modal, Select } from 'antd';
import userService from '../../services/user';
import { shallowEqual, useDispatch } from 'react-redux';
import { fetchUsers } from '../../redux/slices/user';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { fetchClients } from '../../redux/slices/client';
import { DebounceSelect } from '../../components/search';
import shopService from '../../services/restaurant';
import { useSelector } from 'react-redux';

export default function UserRoleModal({ data, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(data.role);
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const roleList = [
    { label: t('user'), value: 'user', key: 1 },
    { label: t('manager'), value: 'manager', key: 2 },
    { label: t('moderator'), value: 'moderator', key: 3 },
  ];
  const menegerRoleList = [
    { label: t('user'), value: 'user', key: 4 },
    { label: t('moderator'), value: 'moderator', key: 5 },
  ];

  function changeRole(uuid, role) {
    setLoading(true);
    userService
      .updateRole(uuid, { role })
      .then(() => {
        toast.success(t('successfully.updated'));
        if (data.role === 'user') {
          dispatch(fetchClients());
        } else {
          dispatch(fetchUsers({ role: data.role }));
        }
        handleCancel();
      })
      .finally(() => setLoading(false));
  }

  const onFinish = (values) => {
    changeRole(data.uuid, values.role);
  };

  const ChangeRole = (e) => setRole(e);

  async function fetchUserShop(search) {
    const params = { search, status: 'approved' };
    return shopService.search(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation !== null ? item.translation.title : 'no name',
        value: item.id,
      }))
    );
  }

  return (
    <Modal
      visible={!!data}
      title={t('change.user.role')}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' onClick={() => form.submit()} loading={loading}>
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        layout='vertical'
        name='user-role'
        form={form}
        onFinish={onFinish}
        initialValues={data}
      >
        <Form.Item
          name='role'
          label={t('role')}
          rules={[{ required: true, message: t('required') }]}
        >
          <Select
            className='w-100'
            options={user.role === 'manager' ? menegerRoleList : roleList}
            onChange={ChangeRole}
          />
        </Form.Item>

        {role !== 'manager' && role !== 'user' ? (
          <Form.Item
            label={t('shop')}
            name='shop_id'
            rules={[{ required: true, message: t('required') }]}
          >
            <DebounceSelect
              className='w-100'
              placeholder={t('select.shop')}
              fetchOptions={fetchUserShop}
              allowClear={false}
            />
          </Form.Item>
        ) : undefined}
      </Form>
    </Modal>
  );
}
