import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function Footer() {
  const { settings } = useSelector((state) => state.globalSettings);
  const { t } = useTranslation();

  return (
    <footer className='footer'>
      <span>
        <span className='font-weight-semibold'>{settings.title}</span>
        <span>
          {' '}
          {t('support.team')}{' '}
          <a href={`tel:${settings.phone}`}>{settings.phone}</a>
        </span>
      </span>
    </footer>
  );
}
