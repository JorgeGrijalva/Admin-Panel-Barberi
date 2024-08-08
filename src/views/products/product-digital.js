import React from 'react';
import { Button, Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import Dragger from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import digitalProductService from 'services/digital-product';
import { shallowEqual, useSelector } from 'react-redux';

export default function ProductDigital({ prev, next }) {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const handleUpload = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('active', 1);
    formData.append('product_id', activeMenu.data?.id);
    digitalProductService
      .create(formData)
      .then(() => {
        toast.success(t('successfully.import'));
        onSuccess('ok');
      })
      .catch((error) => {
        console.log('upload error', error);
        onError('error');
        toast.error(t('file.upload.error'));
      });
  };

  return (
    <Card bordered={false} className='mb-0'>
      <Dragger
        name='file'
        multiple={false}
        maxCount={1}
        customRequest={handleUpload}
        // accept='.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        accept='.zip'
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>{t('upload-drag')}</p>
        <p className='ant-upload-hint'>{t('upload-text')}</p>
      </Dragger>
      <Space className='mt-3'>
        <Button onClick={prev}>{t('prev')}</Button>
        <Button type='primary' onClick={next}>
          {t('next')}
        </Button>
      </Space>
    </Card>
  );
}
