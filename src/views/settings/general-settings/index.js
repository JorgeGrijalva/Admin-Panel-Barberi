import React, { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';

import settingService from 'services/settings';
import { shallowEqual, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import createImage from 'helpers/createImage';
import Loading from 'components/loading';
import Setting from './setting';
import Locations from './locations';
import Footer from './footer';
import Permission from './permission';
import Auth from './auth';
import UiType from './ui-type';
import GeneralSettingsDefaultCountry from './default-country';

const { TabPane } = Tabs;
const defaultLocation = {
  lat: 47.4143302506288,
  lng: 8.532059477976883,
};

export default function GeneralSettings() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const onChange = (key) => setTab(key);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [logo, setLogo] = useState(activeMenu.data?.logo || null);
  const [favicon, setFavicon] = useState(activeMenu.data?.favicon || null);
  const [location, setLocation] = useState(
    activeMenu.data?.location || defaultLocation,
  );

  const createSettings = (list) => {
    const result = list.map((item) => ({
      [item.key]: item.value,
    }));
    return Object.assign({}, ...result);
  };

  function fetchSettings() {
    setLoading(true);
    settingService
      .get()
      .then((res) => {
        const data = createSettings(res?.data);
        const locationArray = data?.location?.split(',');
        data.order_auto_delivery_man = data.order_auto_delivery_man === '1';
        data.order_auto_approved = data.order_auto_approved === '1';
        data.parcel_order_auto_approved =
          data.parcel_order_auto_approved === '1';
        data.can_move_the_reservation_time =
          data.can_move_the_reservation_time === '1';
        data.system_refund = data.system_refund === '1';
        data.refund_delete = data.refund_delete === '1';
        data.prompt_email_modal = data.prompt_email_modal === '1';
        data.blog_active = data.blog_active === '1';
        data.referral_active = data.referral_active === '1';
        data.aws = data.aws === '1';
        data.group_order = data.group_order === '1';
        data.by_subscription = data.by_subscription === '1';
        data.reservation_enable_for_user =
          data.reservation_enable_for_user === '1';
        data.is_demo = data.is_demo === '1';
        data.product_auto_approve = data?.product_auto_approve === '1';
        data.category_auto_approve = data?.category_auto_approve === '1';
        data.before_order_phone_required =
          data?.before_order_phone_required === '1';
        data.location = {
          lat: Number(locationArray?.[0]),
          lng: Number(locationArray?.[1]),
        };
        setLocation(data.location);
        data.logo = createImage(data.logo);
        data.favicon = createImage(data.favicon);
        data.country = {
          label: data?.default_country_title,
          value: data?.default_country_id,
          key: `${data?.default_country_id},${data?.default_region_id}`,
        };
        data.city = {
          label: data?.default_city_title,
          value: data?.default_city_id,
          key: data?.default_city_id,
        };
        setLogo(data.logo);
        setFavicon(data.favicon);
        dispatch(setMenuData({ activeMenu, data }));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchSettings();
    }
  }, [activeMenu.refetch]);

  return (
    <Card title={t('project.settings')}>
      {loading ? (
        <Loading />
      ) : (
        <Tabs
          activeKey={tab}
          onChange={onChange}
          tabPosition='left'
          size='small'
        >
          <TabPane key='settings' tab={t('settings')}>
            <Setting
              logo={logo}
              setLogo={setLogo}
              favicon={favicon}
              setFavicon={setFavicon}
            />
          </TabPane>
          <TabPane key='location' tab={t('location')}>
            <Locations location={location} setLocation={setLocation} />
          </TabPane>
          <TabPane key='default-country' tab={t('default.country')}>
            <GeneralSettingsDefaultCountry />
          </TabPane>
          <TabPane key='permission' tab={t('permission')}>
            <Permission />
          </TabPane>
          <TabPane key='ui_type' tab={t('ui.type')}>
            <UiType />
          </TabPane>
          <TabPane key='auth' tab={t('auth.settings')}>
            <Auth />
          </TabPane>
          <TabPane key='footer' tab={t('footer')}>
            <Footer />
          </TabPane>
        </Tabs>
      )}
    </Card>
  );
}
