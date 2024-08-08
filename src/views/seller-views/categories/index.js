import React from 'react';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import SellerCategoryList from './category-list';
import SellerCategoryRequests from './category-request';
import { useLocation } from 'react-router-dom';

export default function SellerCategories({parentId, type}) {
  const { t } = useTranslation();
  const location = useLocation()
  return (
    <Tabs
      defaultActiveKey={location.state?.tab || 'list'}
      destroyInactiveTabPane
    >
      <Tabs.TabPane key='list' tab={t('category.list')}>
        <SellerCategoryList parentId={parentId} type={type} />
      </Tabs.TabPane>
      <Tabs.TabPane key='request' tab={t('requests')}>
        <SellerCategoryRequests parentId={parentId} type={type} />
      </Tabs.TabPane>
    </Tabs>
  );
}
