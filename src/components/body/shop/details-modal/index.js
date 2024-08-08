import { useTranslation } from 'react-i18next';
import { Descriptions, Image } from 'antd';
import { ShopTypes } from 'constants/shop-types';

const ShopDetailsBody = ({ data }) => {
  const { t } = useTranslation();

  return (
    <Descriptions bordered>
      <Descriptions.Item
        label={t('logo')}
        children={
          <Image
            src={data?.logo_img}
            width={100}
            height={100}
            className='rounded'
            placeholder={!data?.logo_img}
            style={{ objectFit: 'cover' }}
          />
        }
        span={3}
      />
      <Descriptions.Item
        label={t('background.image')}
        children={
          <Image
            src={data?.background_img}
            width={150}
            height={100}
            className='rounded'
            placeholder={!data?.logo_img}
            style={{ objectFit: 'cover' }}
          />
        }
        span={3}
      />
      <Descriptions.Item
        label={t('title')}
        children={data?.translation?.title || t('N/A')}
        span={3}
      />
      <Descriptions.Item
        label={t('description')}
        children={data?.translation?.description || t('N/A')}
        span={3}
      />
      <Descriptions.Item
        label={t('address')}
        children={data?.translation?.address || t('N/A')}
        span={3}
      />
      <Descriptions.Item
        label={t('phone')}
        children={data?.phone || t('N/A')}
        span={3}
      />
      <Descriptions.Item
        label={t('open')}
        children={Boolean(data?.open) ? t('yes') : t('no')}
        span={3}
      />
      <Descriptions.Item
        label={t('shop.type')}
        children={t(
          ShopTypes.find((item) => item.value === data?.delivery_type)?.label,
        )}
        span={3}
      />
    </Descriptions>
  );
};

export default ShopDetailsBody;
