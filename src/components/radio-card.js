import React from 'react';

import '../assets/scss/components/radio-card.scss';
import { FiExternalLink } from 'react-icons/fi';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { WEBSITE_URL } from 'configs/app-global';

export function InputCard({ title, checked, imgPath, onClick }) {
  const { t } = useTranslation();
  return (
    <div className={checked ? 'radio-card radio-checked' : 'radio-card'}>
      <div className='view'>
        <a href={WEBSITE_URL} target='_blank' rel='noreferrer'>
          <FiExternalLink size={40} />
        </a>
      </div>
      {!checked && (
        <Button className='change-button' onClick={onClick}>
          {t('change')}
        </Button>
      )}
      <div className='header'>{title}</div>
      <img src={imgPath} alt='regular focus'></img>
    </div>
  );
}
