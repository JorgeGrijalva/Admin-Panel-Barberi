import { Card, Steps } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setMenuData } from 'redux/slices/menu';
import LanguageList from 'components/language-list';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from 'helpers/useQueryParams';
import ShopMain from './main';
import Delivery from './shopDelivery';
import ShopLocations from 'components/shop/seller-shop-locations';
import ShopSocial from './social';
import ShopGallery from './gallery';

const steps = [
  {
    title: 'shop',
    content: 'First-content',
  },
  {
    title: 'product.locations',
    content: 'Product-location-content',
  },
  {
    title: 'service.locations',
    content: 'Service-location-content',
  },
  {
    title: 'shop.social',
    content: 'Third-content',
  },
  {
    title: 'gallery',
    content: 'Shop-gallery-content',
  },
  {
    title: 'delivery',
    content: 'Fourth-content',
  },
];

const { Step } = Steps;

export default function MyShopEdit() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryParams = useQueryParams();
  const current = Number(queryParams.values?.step || 0);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

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

  return (
    <Card title={t('shop.edit')} extra={<LanguageList />}>
      <Steps current={current} onChange={onChange}>
        {steps.map((item) => (
          <Step title={t(item.title)} key={item.title} />
        ))}
      </Steps>
      <div className='steps-content'>
        {steps[current].content === 'First-content' && <ShopMain next={next} />}

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
          <ShopSocial prev={prev} next={next} />
        )}

        {steps[current].content === 'Shop-gallery-content' && (
          <ShopGallery next={next} prev={prev} />
        )}

        {steps[current].content === 'Fourth-content' && (
          <Delivery prev={prev} />
        )}
      </div>
    </Card>
  );
}
