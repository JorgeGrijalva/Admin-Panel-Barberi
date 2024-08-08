import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Row, Spin } from 'antd';
import subscriptionService from 'services/seller/subscriptions';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SellerSubscriptionModal from './subscriptionModal';
import { useDispatch } from 'react-redux';
import { disableRefetch } from 'redux/slices/menu';

const features = [];

export default function SellerSubscriptions() {
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const colCount = data.length;
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();

  const fetchSubscriptionList = () => {
    setLoading(true);
    subscriptionService
      .getAll()
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchSubscriptionList();
    }
  }, [activeMenu.refetch]);

  return (
    <>
      <Card className='h-100'>
        {!loading ? (
          <div>
            <div className='text-center mb-4'>
              <h2 className='font-weight-semibold'>Pick a base plan</h2>
              <Row type='flex' justify='center'>
                <Col sm={24} md={12} lg={8}>
                  <p>
                    Space, the final frontier. These are the voyages of the
                    Starship Enterprise. Its five-year mission.
                  </p>
                </Col>
              </Row>
            </div>
            <Row>
              {data.map((elm, i) => (
                <Col
                  key={`price-column-${i}`}
                  span={6}
                  className={colCount === i + 1 ? '' : 'border-right'}
                >
                  <Badge.Ribbon
                    text={t('active')}
                    color='red'
                    className={
                      myShop?.subscription?.subscription?.id === elm.id
                        ? ''
                        : 'd-none'
                    }
                  >
                    <div className='p-3'>
                      <div className='text-center'>
                        <h1 className='display-4 mt-4'>
                          <span
                            className='font-size-md d-inline-block mr-1'
                            style={{ transform: 'translate(0px, -17px)' }}
                          >
                            {defaultCurrency?.symbol}
                          </span>
                          <span>{elm.price}</span>
                        </h1>
                        <p className='mb-0 text-lowercase'>
                          {elm.month} {t('month')}
                        </p>
                      </div>
                      <div className='mt-4'>
                        <h2 className='text-center font-weight-semibold'>
                          {elm.type}
                        </h2>
                      </div>
                      <div className='d-flex justify-content-center mt-3'>
                        <div>
                          {features?.map((elm, i) => {
                            return (
                              <p key={`pricing-feature-${i}`}>
                                <Badge color={'blue'} />
                                <span>{elm}</span>
                              </p>
                            );
                          })}
                        </div>
                      </div>
                      <div className='mt-3 text-center'>
                        <Button type='default' onClick={() => setModal(elm)}>
                          {t('purchase')}
                        </Button>
                      </div>
                    </div>
                  </Badge.Ribbon>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <Col className='ant-col-spin d-flex justify-content-center'>
            <Spin size='large' />
          </Col>
        )}
      </Card>
      {modal && (
        <SellerSubscriptionModal
          modal={modal}
          handleCancel={() => setModal(null)}
          refetch={fetchSubscriptionList}
        />
      )}
    </>
  );
}
