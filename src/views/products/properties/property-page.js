import React from 'react';
import { Card, Tabs } from 'antd';
import PropertyValue from './property-value';
import PropertyGroup from './property-group';
import { useTranslation } from 'react-i18next';

export default function PropertyPage() {
  const { t } = useTranslation();

  return (
    <Card title={t('property')}>
      <Tabs defaultActiveKey='1' type='card'>
        <Tabs.TabPane tab={t('property.groups')} key='1'>
          <PropertyGroup />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('property')} key='2'>
          <PropertyValue />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
}
