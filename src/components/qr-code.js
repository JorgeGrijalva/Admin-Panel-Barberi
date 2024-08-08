import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-toastify';
import { Tag, Button } from 'antd';
import axios from 'axios';
import {
  API_KEY,
  DYNAMIC_LINK_DOMAIN,
  WEBSITE_URL,
  ANDROID_PACKAGE_NAME,
  IOS_BUNDLE_ID,
} from 'configs/app-global';
import Loading from 'components/loading';

const firebaseUrl = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${API_KEY}`;

export default function QrCode({ orderId, showLink = true, size = 2 }) {
  const { t } = useTranslation();

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQrCodeUrl = async () => {
    setLoading(true);

    const requestData = {
      dynamicLinkInfo: {
        domainUriPrefix: DYNAMIC_LINK_DOMAIN,
        link: `${WEBSITE_URL}/orders/${orderId}`,
        androidInfo: {
          androidPackageName: ANDROID_PACKAGE_NAME,
        },
        iosInfo: {
          iosBundleId: IOS_BUNDLE_ID,
        },
      },
    };

    try {
      const { data } = await axios.post(firebaseUrl, requestData);
      setError(null);
      setQrCodeUrl(data?.shortLink);
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodeUrl();
  }, [orderId]);

  return (
    <>
      <h3>{t('qr_code')}:</h3>
      <div>
        {!loading && !error ? (
          <>
            <div
              style={{
                width: `${size * 100}px`,
                height: `${size * 100}px`,
                borderRadius: '10px',
                overflow: !error ? 'hidden' : 'none',
              }}
            >
              <QRCodeCanvas
                size={500}
                id='qrCode'
                includeMargin
                value={qrCodeUrl}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  height: '100%',
                }}
                bgColor={'#fff'}
                level={'H'}
              />
            </div>
            <br />
            {showLink && (
              <Button
                type={'primary'}
                href={qrCodeUrl}
                target={'_blank'}
                rel={'noreferrer'}
                style={{ width: `${size * 100}px` }}
              >
                {t('link.to.order')}
              </Button>
            )}
          </>
        ) : !!error ? (
          <Tag color='red'>{t('smth.went.wrong')}</Tag>
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
}
