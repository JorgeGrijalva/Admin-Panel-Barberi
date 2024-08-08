import React, { useEffect, useState } from 'react';
import { Card, Form, Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import userService from 'services/user';
import Loading from 'components/loading';
import UserEditForm from './userEditForm';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import UserOrders from './userOrders';
import WalletHistory from './walletHistory';
import createImage from 'helpers/createImage';
import UserPassword from './userPassword';
import DeliverySettingCreate from './add-deliveryman-settings';
import useDemo from 'helpers/useDemo';
import hideEmail from 'components/hideEmail';
import DisabledTimes from './disabled-times';
import MasterWorkingAndClosedDays from './master-working-and-closed-days';
import ServiceMaster from './service-master';

const { TabPane } = Tabs;

const UserEdit = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('edit');
  const [image, setImage] = useState([]);
  const [id, setId] = useState(null);
  const role = activeMenu?.data?.role;
  const { isDemo } = useDemo();

  function getLanguageFields(data) {
    if (!data?.translations) {
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
      [`address[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.address,
    }));
    return Object.assign({}, ...result);
  }

  const showUserData = (uuid) => {
    setLoading(true);
    userService
      .getById(uuid)
      .then((res) => {
        const data = res.data;
        const payload = {
          ...data,
          image: data.img ? createImage(data.img) : [],
        };
        dispatch(setMenuData({ activeMenu, data: payload }));
        form.setFieldsValue({
          firstname: data.firstname,
          lastname: data.lastname,
          ...getLanguageFields(res.data),
          email: isDemo ? hideEmail(data.email) : data.email,
          phone: data.phone,
          birthday: moment(data?.birthday).format('YYYY-MM-DD'),
          gender: data.gender,
          password_confirmation: data.password_confirmation,
          password: data.password,
          shop_id:
            data?.invitations?.length !== 0
              ? data?.invitations?.map((i) => ({
                  label: i.shop?.translation?.title,
                  value: i.shop?.id,
                  key: i.shop?.id,
                }))
              : undefined,
        });
        setImage(data.img ? [createImage(data.img)] : []);
        setId(res.data?.delivery_man_setting?.id);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  useEffect(() => {
    if (activeMenu?.refetch) showUserData(uuid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu?.refetch]);

  const onChange = (key) => setTab(key);

  return (
    <Card title={t('user.settings')}>
      {!loading ? (
        <Tabs
          activeKey={tab}
          onChange={onChange}
          tabPosition='left'
          size='small'
        >
          <TabPane key='edit' tab={t('edit.user')}>
            <UserEditForm
              data={activeMenu?.data}
              form={form}
              image={image}
              setImage={setImage}
              action_type={'edit'}
            />
          </TabPane>
          {role === 'cook' && (
            <TabPane key='order' tab={t('orders')}>
              <UserOrders data={activeMenu?.data} />
            </TabPane>
          )}
          {role === 'deliveryman' && (
            <TabPane key='delivery' tab={t('deliveryman')}>
              <DeliverySettingCreate id={id} data={activeMenu.data} />
            </TabPane>
          )}
          <TabPane key='wallet' tab={t('wallet')}>
            <WalletHistory data={activeMenu?.data} />
          </TabPane>
          <TabPane key='password' tab={t('password')}>
            <UserPassword data={activeMenu?.data} />
          </TabPane>
          {role === 'master' && (
            <TabPane key='masterClosedDays' tab={t('working.and.closed.days')}>
              <MasterWorkingAndClosedDays />
            </TabPane>
          )}
          {role === 'master' && (
            <TabPane key='masterDisabledTimes' tab={t('disabled.times')}>
              <DisabledTimes />
            </TabPane>
          )}
          {role === 'master' && (
            <TabPane key='serviceMaster' tab={t('service.master')}>
              <ServiceMaster />
            </TabPane>
          )}
        </Tabs>
      ) : (
        <Loading />
      )}
    </Card>
  );
};

export default UserEdit;
