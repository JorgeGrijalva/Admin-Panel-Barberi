import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { clearMenu } from '../../redux/slices/menu';

const NotFound = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch(clearMenu());
    window.history.back();
  };

  return (
    <div>
      <div className='container'>
        <div className='header'>
          <h1 className='display-4 font-weight-bold first-four'>4</h1>
          <h1 className='display-4 font-weight-bold first-zero'>0</h1>
          <h1 className='display-4 font-weight-bold second-four'>4</h1>
        </div>
        <div>
          <h1 className='font-weight-bold mb-4 display-4'>
            {t('page.not.found')}
          </h1>
          <Button
            type='primary'
            icon={<ArrowLeftOutlined />}
            onClick={() => handleOk()}
          >
            {t('go.back')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
