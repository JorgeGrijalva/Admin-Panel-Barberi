import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { isArray } from 'lodash';
import userService from '../../../services/user';
import { DebounceSelect } from '../../../components/search';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setOrderCurrency, setOrderData } from '../../../redux/slices/order';
import { useTranslation } from 'react-i18next';
import { PlusCircleOutlined } from '@ant-design/icons';
import { addMenu } from '../../../redux/slices/menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AsyncSelect } from '../../../components/async-select';
import paymentService from '../../../services/payment';

const UserInfo = ({ form }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.order, shallowEqual);
  const { currencies } = useSelector((state) => state.currency, shallowEqual);

  const [users, setUsers] = useState([]);
  const [refetchAddresses, setRefetchAddresses] = useState(false);

  async function getUsers(search) {
    const params = {
      search,
      perPage: 10,
    };
    return userService.search(params).then(({ data }) => {
      setUsers(data);
      return formatUser(data);
    });
  }

  async function fetchPaymentList() {
    return paymentService.getAll({ perPage: 100 }).then(({ data }) =>
      data
        .filter((el) => el.tag === 'cash' || el.tag === 'terminal')
        .map((item) => ({
          label: item.translation?.title || 'no name',
          value: item.id,
        }))
    );
  }

  function formatUser(data) {
    if (!data) return;
    if (isArray(data)) {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname || ''}`,
        value: item.id,
      }));
    } else {
      return {
        label: `${data.firstname} ${data.lastname || ''}`,
        value: data.id,
      };
    }
  }

  async function fetchUser(uuid) {
    if (!uuid) return [];
    setRefetchAddresses(false);
    return userService.getById(uuid).then(({ data }) =>
      data.addresses.map((item) => ({
        label: item.address,
        value: item.id,
      }))
    );
  }

  function selectUser(userObj) {
    const user = users.find((item) => item.id === userObj.value);
    dispatch(setOrderData({ user: userObj, userUuid: user.uuid }));
    form.setFieldsValue({ address: null });
    setRefetchAddresses(true);
  }

  function selectCurrency(item) {
    const currency = currencies.find((el) => el.id === item);
    dispatch(setOrderCurrency(currency));
  }

  const goToAddClient = () => {
    dispatch(
      addMenu({
        url: `user/add`,
        id: 'user_add',
        name: 'User add',
      })
    );
    navigate(`/user/add`);
  };

  const goToAddClientAddress = () => {
    if (!data.userUuid) {
      toast.warning('Please, select client');
      return;
    }
    dispatch(
      addMenu({
        url: `user/${data.userUuid}`,
        id: 'user_edit',
        name: 'User edit',
      })
    );
    navigate(`/user/${data.userUuid}`);
  };

  return (
    <Card title={t('customer.details')}>
      <Row gutter={12}>
        <Col span={16}>
          <Form.Item
            label={t('client')}
            name='user'
            rules={[{ required: true, message: '' }]}
          >
            <DebounceSelect
              placeholder={t('select.client')}
              fetchOptions={getUsers}
              onSelect={selectUser}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='add' className='label-hidden'>
            <Button icon={<PlusCircleOutlined />} onClick={goToAddClient}>
              {t('add')}
            </Button>
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            label={t('address')}
            name='address'
            rules={[{ required: true, message: '' }]}
          >
            <AsyncSelect
              fetchOptions={() => fetchUser(data.userUuid)}
              onSelect={(address) => dispatch(setOrderData({ address }))}
              refetch={refetchAddresses}
              className='w-100'
              placeholder={t('select.address')}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='add' className='label-hidden'>
            <Button
              icon={<PlusCircleOutlined />}
              onClick={goToAddClientAddress}
            >
              {t('add')}
            </Button>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('currency')}
            name='currency_id'
            rules={[{ required: true, message: 'missing_currency' }]}
          >
            <Select
              placeholder={t('select.currency')}
              onSelect={selectCurrency}
            >
              {currencies.map((item, index) => (
                <Select.Option key={index} value={item.id}>
                  {item.title} ({item?.symbol})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('payment.type')}
            name='payment_type'
            rules={[{ required: true, message: t('missing.payment.type') }]}
          >
            <AsyncSelect
              fetchOptions={fetchPaymentList}
              className='w-100'
              placeholder={t('select.payment.type')}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label={t('note')} name='note'>
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default UserInfo;
