import React from 'react';
import { BsFolder } from 'react-icons/bs';
import { Card, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { colLg } from '../../components/card-responsive';
import { useTranslation } from 'react-i18next';
import Meta from 'antd/lib/card/Meta';

const folder = [
  'shops',
  'deliveryman',
  'banners',
  'brands',
  'blogs',
  'categories',
  'coupons',
  'discounts',
  'extras',
  'reviews',
  'receipts',
  'order_refunds',
  'users',
  'products',
  'languages',
  'referral',
  'shop-tags',
];

const Gallery = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card title={t('gallery')} className='gallery-container'>
      <Row gutter={[24, 24]}>
        {folder.map((item, index) => (
          <Col {...colLg} key={index}>
            <Card
              cover={<BsFolder className='icon-folder' />}
              onClick={() => navigate(`/gallery/${item}`)}
              className='folder'
            >
              <Meta title={t(`${item}`)} />
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default Gallery;
