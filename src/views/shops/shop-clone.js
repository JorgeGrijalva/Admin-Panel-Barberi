import React, { useState, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import LanguageList from 'components/language-list';
import { useTranslation } from 'react-i18next';
import { Card, Steps } from 'antd';
import { useQueryParams } from 'helpers/useQueryParams';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import shopService from 'services/shop';
import { useParams } from 'react-router-dom';
import Loading from 'components/loading';
import Map from 'components/shop/map';
import { steps } from './steps';
import ShopMain from './main';
import UserEdit from './user';
import ShopDelivery from './shopDelivery';
import ShopLocations from '../../components/shop/shop-locations';
import ShopSocial from './social';
import ShopGallery from './gallery';
const { Step } = Steps;

const ShopClone = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const queryParams = useQueryParams();
  const current = Number(queryParams.values?.step || 0);
  const [loading, setLoading] = useState(activeMenu.refetch);
  const dispatch = useDispatch();
  const { uuid } = useParams();

  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  const next = () => {
    const step = current + 1;
    queryParams.set('step', step);
  };
  const prev = () => {
    const step = current - 1;
    queryParams.set('step', step);
  };

  const onChange = (step) => {
    dispatch(setMenuData({ activeMenu, data: { ...activeMenu.data, step } }));
    queryParams.set('step', step);
  };

  const fetchShop = (uuid) => {
    setLoading(true);
    shopService
      .getById(uuid)
      .then((res) => {
        const data = {
          ...res.data,
          ...getLanguageFields(res?.data),
          logo_img: createImages(res.data?.logo_img),
          background_img: createImages(res.data?.background_img),
          // user: {
          //   label:
          //     res.data?.seller?.firstname + ' ' + res.data?.seller?.lastname,
          //   value: res.data?.seller?.id,
          // },
          delivery_time_from: res.data?.delivery_time?.from || 0,
          delivery_time_to: res.data?.delivery_time?.to || 0,
          delivery_time_type: res.data?.delivery_time?.type,
          recommended: res.data?.mark === 'recommended',
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
          price: res.data?.price || 0,
          price_per_km: res.data?.price_per_km || 0,
          min_amount: res.data?.min_amount || 0,
          tax: res.data?.tax || 0,
          percentage: res.data?.percentage || 0,
        };
        dispatch(setMenuData({ activeMenu, data }));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const createImages = (items) => {
    return {
      items,
      uid: items,
      url: items,
      name: items,
    };
  };

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

  useEffect(() => {
    if (activeMenu.refetch && uuid) {
      fetchShop(uuid);
    }
  }, [activeMenu.refetch, current]);

  return (
    <Card title={t('shop.clone')} extra={<LanguageList />}>
      <Steps current={current} onChange={onChange}>
        {steps.map((item) => (
          <Step title={t(item.title)} key={item.title} />
        ))}
      </Steps>
      {!loading ? (
        <div className='steps-content'>
          {steps[current].content === 'First-content' && (
            <ShopMain
              next={next}
              loading={loading}
              action_type='clone'
              user={false}
            />
          )}

          {steps[current].content === 'Product-location-content' && (
            <ShopLocations
              next={next}
              prev={prev}
              locationType={{ label: 'product', value: 1, key: 1 }}
            />
          )}

          {steps[current].content === 'Service-location-content' && (
            <ShopLocations
              next={next}
              prev={prev}
              locationType={{ label: 'service', value: 2, key: 2 }}
            />
          )}

          {steps[current].content === 'Third-content' && (
            <ShopSocial next={next} prev={prev} />
          )}

          {steps[current].content === 'Fourth-content' && (
            <ShopDelivery next={next} prev={prev} />
          )}

          {steps[current].content === 'Shop-gallery-content' && (
            <ShopGallery next={next} prev={prev} />
          )}

          {steps[current].content === 'Fifth-content' && (
            <UserEdit next={next} prev={prev} />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </Card>
  );
};
export default ShopClone;
