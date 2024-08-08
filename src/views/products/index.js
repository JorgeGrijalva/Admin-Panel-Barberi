import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import ProductList from './product-list';
import ProductRequestList from './product-request-list';

export default function Products() {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <Tabs
      defaultActiveKey={location.state?.tab || 'list'}
      destroyInactiveTabPane
    >
      <Tabs.TabPane key='list' tab={t('product.list')}>
        <ProductList />
      </Tabs.TabPane>
      <Tabs.TabPane key='request' tab={t('requests')}>
        <ProductRequestList />
      </Tabs.TabPane>
    </Tabs>
  );
}
