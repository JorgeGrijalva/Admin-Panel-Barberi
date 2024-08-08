import React from 'react';
import { Button, Card, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className='global-settings'>
      <Card className='h-100 d-flex justify-content-center align-items-center'>
        <Result
          status='success'
          title='Thank you for choosing our product!'
          subTitle='Next you can setup project on your own.'
          extra={[
            <Button
              type='primary'
              key='installation'
              onClick={() => navigate('/installation')}
            >
              {t('Go.to.installation')}
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
}
