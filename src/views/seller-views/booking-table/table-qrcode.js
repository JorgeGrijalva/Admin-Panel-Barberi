import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const baseUrl = 'https://qr-code-rho-bay.vercel.app';

const TableQrCode = ({ table }) => {
  const { settings } = useSelector((state) => state.globalSettings);
  const { t } = useTranslation();
  const qrRef = useRef();
  const params = new URLSearchParams({
    shop_id: table.shop_section.shop_id,
    table_id: table.id,
    chair_count: table.chair_count,
    name: table.name,
  });
  const qrCodeType =
    !!settings?.qrcode_type && settings.qrcode_type !== 'w1'
      ? settings.qrcode_type
      : '';
  const url = `${
    settings?.qrcode_base_url || baseUrl
  }${qrCodeType}?${params.toString()}`;
  const downloadQRCode = (e) => {
    e.preventDefault();
    let canvas = qrRef.current.querySelector('canvas');
    let image = canvas.toDataURL('image/png');
    let anchor = document.createElement('a');
    anchor.href = image;
    anchor.download = `qr-code.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };
  return (
    <form onSubmit={downloadQRCode}>
      <div className='flex flex-column'>
        <div className='w-100'>
          <div ref={qrRef}>
            <QRCodeCanvas
              size={500}
              id='qrCode'
              includeMargin
              value={url}
              style={{ width: '100%', aspectRatio: '1/1', height: '100%' }}
              bgColor={'#fff'}
              level={'H'}
            />
          </div>
        </div>
        <Button
          htmlType='submit'
          disabled={!table}
          icon={<DownloadOutlined />}
          type='primary'
        >
          {t('download')}
        </Button>
      </div>
    </form>
  );
};

export default TableQrCode;
