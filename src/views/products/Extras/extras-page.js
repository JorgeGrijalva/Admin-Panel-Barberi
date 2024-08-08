import React from 'react';
import { Card, Tabs } from 'antd';
import ExtraValue from './extra-value';
import ExtraGroup from './extra-group';
import { useTranslation } from 'react-i18next';

export default function ExtrasPage() {
  const { t } = useTranslation();

  return (
    <Card title={t('extras')}>
      <Tabs defaultActiveKey='1' type='card'>
        <Tabs.TabPane tab={t('extra.groups')} key='1'>
          <ExtraGroup />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('extras')} key='2'>
          <ExtraValue />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
}
