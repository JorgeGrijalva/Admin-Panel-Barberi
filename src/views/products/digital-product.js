import React from 'react';
import { Card, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import Dragger from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import digitalProductService from 'services/digital-product';

export default function ProductImport({
  product_id,
  handleCancel,
  handleRefetch,
}) {
  const { t } = useTranslation();
  const handleUpload = ({ file, onSuccess }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('active', 1);
    formData.append('product_id', product_id);
    digitalProductService
      .create(formData)
      .then(() => {
        toast.success(t('successfully.import'));
        onSuccess('ok');
        handleCancel();
        handleRefetch();
      })
      .catch((error) => {
        onSuccess('error');
      });
  };

  return (
    <Modal visible={product_id} footer={false} onCancel={handleCancel}>
      <Card bordered={false} className='mb-0'>
        <Dragger
          name='file'
          multiple={false}
          maxCount={1}
          customRequest={handleUpload}
          accept='.zip'
        >
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>{t('upload-drag')}</p>
          <p className='ant-upload-hint'>{t('upload-text')}</p>
        </Dragger>
      </Card>
    </Modal>
  );
}
