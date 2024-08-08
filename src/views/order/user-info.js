import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { isArray } from 'lodash';
import userService from 'services/user';
import { DebounceSelect } from 'components/search';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setOrderCurrency, setOrderData } from 'redux/slices/order';
import { useTranslation } from 'react-i18next';
import { PlusCircleOutlined } from '@ant-design/icons';
import { addMenu } from 'redux/slices/menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AsyncSelect } from 'components/async-select';
import restPaymentService from 'services/rest/payment';
import UserAddress from './user-address';

const UserInfo = ({ form }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.order, shallowEqual);
  const { currencies } = useSelector((state) => state.currency, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [addressModal, setAddressModal] = useState(null);
  const [users, setUsers] = useState([]);
  const [refetchPayment, setRefetchPayment] = useState(false);
  const { payment_type } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual,
  );

  useEffect(() => {
    setRefetchPayment(true);
  }, [data.shop]);

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
    return restPaymentService.getAll().then(({ data }) =>
      data
        .filter((el) => el.tag === 'cash' || el.tag === 'wallet')
        .map((item) => ({
          label: item.tag || 'no name',
          value: item.id,
          key: item.id,
        })),
    );
  }

  async function fetchSellerPaymentList() {
    return restPaymentService.getById(data.shop.value).then(({ data }) =>
      data
        .filter((el) => el.tag === 'cash' || el.tag === 'wallet')
        .map((item) => ({
          label: item.payment.tag || 'no name',
          value: item.payment.id,
          key: item.payment.id,
        })),
    );
  }

  function formatUser(data) {
    if (!data) return;
    if (isArray(data)) {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname || ''}`,
        value: item.id,
        key: item.id,
      }));
    } else {
      return {
        label: `${data.firstname} ${data.lastname || ''}`,
        value: data.id,
        key: data.id,
      };
    }
  }

  function selectUser(userObj) {
    const user = users.find((item) => item.id === userObj.value);
    dispatch(
      setOrderData({ user: userObj, userUuid: user.uuid, userOBJ: user }),
    );
    form.setFieldsValue({ address: null });
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
        name: t('add.user'),
      }),
    );
    navigate(`/user/add`);
  };

  const goToAddClientAddress = () => {
    if (!data.userUuid) {
      toast.warning(t('please.select.client'));
      return;
    }
    setAddressModal(data.userUuid);
  };

  return (
    <Card title={t('customer.details')}>
      <Row gutter={12}>
        <Col span={16}>
          <Form.Item
            label={t('client')}
            name='user'
            rules={[{ required: true, message: t('required') }]}
          >
            <DebounceSelect
              placeholder={t('select.client')}
              fetchOptions={getUsers}
              onSelect={selectUser}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('add')} className='label-hidden'>
            <Button icon={<PlusCircleOutlined />} onClick={goToAddClient}>
              {t('add')}
            </Button>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={t('address')}
            name='address'
            rules={[{ required: false, message: t('required') }]}
          >
            <div className='address w-100' onClick={goToAddClientAddress}>
              {activeMenu.data?.addressData?.address}
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('currency')}
            name='currency_id'
            rules={[{ required: true, message: t('required') }]}
          >
            <Select
              placeholder={t('select.currency')}
              onSelect={selectCurrency}
            >
              {currencies.map((item, index) => (
                <Select.Option key={index} value={item.id}>
                  {item.title} ({item.symbol})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('payment.type')}
            name='payment_type'
            rules={[{ required: true, message: t('required') }]}
          >
            <AsyncSelect
              refetch={refetchPayment}
              fetchOptions={
                payment_type === 'admin'
                  ? fetchPaymentList
                  : fetchSellerPaymentList
              }
              className='w-100'
              placeholder={t('select.payment.type')}
              onSelect={(paymentType) =>
                dispatch(setOrderData({ paymentType }))
              }
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label={t('note')} name='note'>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {addressModal && (
        <UserAddress
          uuid={addressModal}
          handleCancel={() => setAddressModal(null)}
        />
      )}
    </Card>
  );
};

export default UserInfo;
