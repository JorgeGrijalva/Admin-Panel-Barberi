import React from 'react';
import { Button, Card } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dragger from 'antd/lib/upload/Dragger';
import { InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { setMenuData } from '../../redux/slices/menu';
import { fetchProducts } from '../../redux/slices/product';
import { example } from '../../configs/app-global';
import productService from 'services/product';

export default function AddonsImport() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const createFile = (file) => {
    return {
      uid: file.name,
      name: file.name,
      status: 'done',
      url: file.name,
      created: true,
    };
  };

  const handleUpload = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('shop_id', activeMenu?.shop_id);
    productService
      .import(formData)
      .then((data) => {
        toast.success(t('successfully.import'));
        dispatch(setMenuData({ activeMenu, data: createFile(file) }));
        onSuccess('ok');
        dispatch(fetchProducts());
      })
      .catch((err) => {
        onError(err.message);
      });
  };

  const downloadFile = () => {
    const body = example + 'import-example/addons.xls';
    window.location.href = body;
  };
  return (
    <Card title={t('import')}>
      <div className='alert' role='alert'>
        <div className='alert-header'>
          <InfoCircleOutlined className='alert-icon' />
          <p>{t('info')}</p>
        </div>
        <ol className='ml-4'>
          <li>{t('import.text_1')}</li>
          <li>{t('import.text_2')}</li>
          <li>{t('import.text_3')}</li>
          <li>{t('import.text_4')}</li>
        </ol>
      </div>
      <Button type='primary' className='mb-4' onClick={downloadFile}>
        {t('download.csv')}
      </Button>
      <Dragger
        name='file'
        multiple={false}
        maxCount={1}
        customRequest={handleUpload}
        defaultFileList={activeMenu?.data ? [activeMenu?.data] : null}
        accept='.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>{t('upload-drag')}</p>
        <p className='ant-upload-hint'>{t('upload-text')}</p>
      </Dragger>
    </Card>
  );
}
