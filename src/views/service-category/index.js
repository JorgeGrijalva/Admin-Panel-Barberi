import React from 'react';
import { Tabs } from 'antd';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceCategoryList from './service-category-list';

export default function ServiceCategories() {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <Tabs
      defaultActiveKey={location.state?.tab || 'list'}
      destroyInactiveTabPane
    >
      <Tabs.TabPane key='list' tab={t('category.list')}>
        <ServiceCategoryList />
      </Tabs.TabPane>
      {/*<Tabs.TabPane key='request' tab={t('requests')}>*/}
      {/*  /!*<CategoryRequestList />*!/*/}
      {/*  <h1>CategoryRequestList</h1>*/}
      {/*</Tabs.TabPane>*/}
    </Tabs>
  );
}
