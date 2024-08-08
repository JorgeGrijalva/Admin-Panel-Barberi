import React, { useEffect, useState } from 'react';
import { Button, Form, Space, Card } from 'antd';
import ShopAddData from './shop-add-data';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import shopService from 'services/seller/shop';
import { useTranslation } from 'react-i18next';
import getDefaultLocation from 'helpers/getDefaultLocation';
import { fetchMyShop } from 'redux/slices/myShop';
import { ShopTypes } from 'constants/shop-types';
import { useQueryParams } from 'helpers/useQueryParams';

const ShopMain = ({ next }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const queryParams = useQueryParams();

  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [location, setLocation] = useState(
    activeMenu?.data?.location
      ? {
          lat: parseFloat(activeMenu?.data?.location?.latitude),
          lng: parseFloat(activeMenu?.data?.location?.longitude),
        }
      : getDefaultLocation(settings),
  );
  const [logoImage, setLogoImage] = useState([]);
  const [backImage, setBackImage] = useState([]);

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

  const createImages = (items) => {
    return {
      items,
      uid: items,
      url: items,
      name: items,
    };
  };

  const fetchShop = () => {
    setLoading(true);
    shopService
      .get()
      .then((res) => {
        setBackImage([createImages(res?.data?.background_img)]);
        setLogoImage([createImages(res?.data?.logo_img)]);
        const data = {
          ...res?.data,
          ...getLanguageFields(res?.data),
          user: {
            label:
              res?.data.seller.firstname +
              ' ' +
              (res.data.seller.lastname || ''),
            value: res.data.seller.id,
          },
          delivery_time_from: res?.data?.delivery_time?.from || 0,
          delivery_time_to: res.data?.delivery_time?.to || 0,
          delivery_time_type: res.data?.delivery_time?.type,

          categories: res.data?.categories?.map((item) => ({
            label: item?.translation?.title,
            value: item?.id,
            key: item?.id,
          })),
          tags: res.data?.tags?.map((item) => ({
            label: item?.translation?.title,
            value: item?.id,
            key: item?.id,
          })),
          price: res?.data?.price || 0,
          price_per_km: res?.data?.price_per_km || 0,
          min_amount: res?.data?.min_amount || 0,
          tax: res?.data?.tax || 0,
          percentage: res?.data?.percentage || 0,
        };
        dispatch(setMenuData({ activeMenu, data }));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  useEffect(() => {
    fetchShop();
  }, [queryParams.values?.step]);

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchShop();
    }
  }, [activeMenu.refetch]);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      data.open_time = JSON.stringify(data?.open_time);
      data.close_time = JSON.stringify(data?.close_time);
      dispatch(
        setMenuData({ activeMenu, data: { ...activeMenu.data, ...data } }),
      );
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      ...values,
      delivery_type: values?.delivery_type?.value || values?.delivery_type,
      'images[0]': logoImage?.[0]?.name,
      'images[1]': backImage?.[0]?.name,
      delivery_time_type: values?.delivery_time_type,
      delivery_time_to: values?.delivery_time_to,
      delivery_time_from: values?.delivery_time_from,
      user_id: values?.user?.value,
      'location[latitude]': location?.lat,
      'location[longitude]': location?.lng,
      user: undefined,
      delivery_time: 0,
      type: myShop?.type === 'shop' ? 'shop' : 'restaurant',
      tags: values?.tags?.map((e) => e?.value),
    };
    delete body?.background_img;
    delete body?.logo_img;
    shopUpdate(values, body);
  };

  function shopUpdate(values, params) {
    shopService
      .update(params)
      .then(() => {
        batch(() => {
          dispatch(
            setMenuData({
              activeMenu,
              data: values,
            }),
          );
          dispatch(fetchMyShop({}));
        });
        next();
      })
      .finally(() => setLoadingBtn(false));
  }

  return (
    <Card loading={loading}>
      <Form
        form={form}
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          visibility: true,
          status: 'new',
          ...activeMenu.data,
          delivery_type: activeMenu.data?.delivery_type ?? ShopTypes[0],
        }}
      >
        <ShopAddData
          logoImage={logoImage}
          setLogoImage={setLogoImage}
          backImage={backImage}
          setBackImage={setBackImage}
          form={form}
          location={location}
          setLocation={setLocation}
        />
        <Space>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('next')}
          </Button>
        </Space>
      </Form>
    </Card>
  );
};
export default ShopMain;
