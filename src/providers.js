import React from 'react';
import { ConfigProvider } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import useBodyClass from './helpers/useBodyClass';
import AppLocale from './configs/app-locale';
import i18n from './configs/i18next';
import useDocumentTitle from './helpers/projectTitle';
import { PROJECT_NAME } from './configs/app-global';

export default function Providers({ children }) {
  const { theme } = useSelector((state) => state.theme, shallowEqual);
  useBodyClass(`dir-${theme.direction}`);
  const { settings } = useSelector((state) => state.globalSettings);
  useDocumentTitle(settings.title || PROJECT_NAME);

  return (
    <ConfigProvider direction={theme.direction} locale={AppLocale[i18n.language]}>
      {children}
    </ConfigProvider>
  );
}
