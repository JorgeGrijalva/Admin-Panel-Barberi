import { useTranslation } from 'react-i18next';
import { Descriptions } from 'antd';

const ShopDescription = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Descriptions bordered title={t('shop')}>
      <Descriptions.Item label={t('id')} span={3}>
        {data?.id}
      </Descriptions.Item>
      <Descriptions.Item label={t('title')} span={3}>
        {data?.translation?.title}
      </Descriptions.Item>
      <Descriptions.Item label={t('address')} span={3}>
        {data?.translation?.address}
      </Descriptions.Item>
      <Descriptions.Item label={t('open')} span={3}>
        {Boolean(data?.open) ? t('yes') : t('no')}
      </Descriptions.Item>
    </Descriptions>
  );
};
export default ShopDescription;
