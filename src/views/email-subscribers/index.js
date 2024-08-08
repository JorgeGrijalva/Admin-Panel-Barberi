import React from 'react';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import getSystemIcons from '../../helpers/getSystemIcons';

export default function EmailSubscriber() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const list = user.urls
    .flatMap((item) => item.submenu)
    .find((el) => el?.url === 'email/subscriber');

  const addMenuItem = (payload) => {
    const data = { ...payload, icon: undefined };
    dispatch(addMenu(data));
  };

  return (
    <div className='product-container'>
      <Row gutter={12}>
        {list?.children?.map((item) => (
          <Col span={8} key={item.id}>
            <Card className='card-view' hoverable>
              <Link
                to={`/${item.url}`}
                className='d-flex align-items-center'
                onClick={() => addMenuItem(item)}
              >
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
