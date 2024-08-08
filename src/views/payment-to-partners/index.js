import { Row, Col, Card } from 'antd';
import { Link } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import getSystemIcons from 'helpers/getSystemIcons';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PaymentToPartners() {
  const { t } = useTranslation();
  const { type } = useParams();
  const constructedName = `payment.to.${type}`;
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const list = user.urls
    .filter((item) => item?.name === 'customer')?.[0]
    ?.submenu?.filter((item) => item?.name === constructedName)?.[0]?.children;

  return (
    <div className='product-container'>
      <Row gutter={8}>
        {list?.map((item) => (
          <Col span={8} key='1'>
            <Card className='card-view' hoverable>
              <Link to={`/${item?.url}`} className='d-flex align-items-center'>
                <span>{getSystemIcons(item.icon)}</span>
                <span className='text'>{t(item.name)}</span>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
