import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import ProductList from "./product-list";
import SellerProductRequest from "./product-request";

export default function SellerProducts() {
    const { t } = useTranslation();
    const location = useLocation()
    return (
      <Tabs
        defaultActiveKey={location.state?.tab || 'list'}
        destroyInactiveTabPane
      >
        <Tabs.TabPane key='list' tab={t('product.list')}>
          <ProductList  />
        </Tabs.TabPane>
        <Tabs.TabPane key='request' tab={t('requests')}>
            <SellerProductRequest /> 
        </Tabs.TabPane>
      </Tabs>
    );
  }