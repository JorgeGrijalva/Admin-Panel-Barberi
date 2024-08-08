import React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import useDemo from '../helpers/useDemo';

export default function CheckIsDemo({ onClick, children }) {
  const { t } = useTranslation();
  const { isDemo } = useDemo();

  const handleClick = () => {
    if (isDemo) {
      toast.warning(t('cannot.work.demo'));
      return;
    }
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {' '}
      {children}
    </div>
  );
}
