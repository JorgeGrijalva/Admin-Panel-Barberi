import { Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import React from 'react';

const MasterDescriptions = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Descriptions bordered title={t('master')}>
      <Descriptions.Item label={t('id')} span={3}>
        {data?.id}
      </Descriptions.Item>
      <Descriptions.Item label={t('fullname')} span={3}>
        {data?.full_name || 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label={t('phone')} span={3}>
        {data?.phone ? (
          <a
            href={`tel:${data?.phone.startsWith('+') ? '' : '+'}${data?.phone}`}
          >
            {data?.phone.startsWith('+') ? '' : '+'}
            {data?.phone}
          </a>
        ) : (
          'N/A'
        )}
      </Descriptions.Item>
      <Descriptions.Item label={t('email')} span={3}>
        {data?.email ? (
          <a href={`mailto:${data?.email}`}>{data?.email}</a>
        ) : (
          'N/A'
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default MasterDescriptions;
