import React from 'react';
import { Tabs } from 'antd';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CategoryList from './category-list';
import CategoryRequestList from './category-request-list';

export default function SellerCategories() {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <Tabs
      defaultActiveKey={location.state?.tab || 'list'}
      destroyInactiveTabPane
    >
      <Tabs.TabPane key='list' tab={t('category.list')}>
        <CategoryList />
      </Tabs.TabPane>
      <Tabs.TabPane key='request' tab={t('requests')}>
        <CategoryRequestList />
      </Tabs.TabPane>
    </Tabs>
  );
}
