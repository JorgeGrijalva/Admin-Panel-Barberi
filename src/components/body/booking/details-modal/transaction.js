import { useTranslation } from 'react-i18next';
import { Descriptions } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import numberToPrice from 'helpers/numberToPrice';

const TransactionDescriptions = ({ data }) => {
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  return (
    <Descriptions bordered title={t('transaction')}>
      <Descriptions.Item label={t('id')} span={12}>
        {data?.id}
      </Descriptions.Item>
      <Descriptions.Item label={t('price')} span={12}>
        {numberToPrice(
          data?.price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        )}
      </Descriptions.Item>
      <Descriptions.Item label={t('payment.type')} span={12}>
        {data?.payment_system?.tag}
      </Descriptions.Item>
      <Descriptions.Item label={t('status')} span={12}>
        {data?.status}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TransactionDescriptions;
