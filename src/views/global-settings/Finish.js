import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

export default function Finish() {
  const { t } = useTranslation();
  return (
    <Card className='w-100'>
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: '50vh' }}
      >
        <h1>{t('Welcome.to.Dashboard!')}</h1>
      </div>
    </Card>
  );
}
