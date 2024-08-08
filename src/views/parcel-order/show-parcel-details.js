import React, { useState, useEffect } from 'react';
import { Button, Col, Descriptions, Modal, Row, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import parcelOrderService from 'services/parcelOrder';
import Loading from 'components/loading';
import numberToPrice from 'helpers/numberToPrice';
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';
import TransactionStatusModal from './transaction-status-modal';

const ShowParcelDetails = ({ id, handleCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);
  const [transactionStatusModal, setTransactionStatusModal] = useState(false);

  function fetchParcelDetails() {
    setLoading(true);
    parcelOrderService
      .getById(id)
      .then(({ data }) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchParcelDetails();
  }, []);

  return (
    <>
      <Modal
        visible={!!id}
        title={`${t('parcel.id')} #${id}`}
        onCancel={() => handleCancel()}
        footer={[
          <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
            {t('cancel')}
          </Button>,
        ]}
        className='large-modal'
      >
        {!loading ? (
          <>
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions title={t('sender.details')} bordered>
                  <Descriptions.Item label={t('username')} span={3}>
                    {data?.username_from}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('phone')} span={3}>
                    {data?.phone_from}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('address')} span={3}>
                    {data?.address_from?.address}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('house')} span={3}>
                    {data?.address_from?.house}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('stage')} span={3}>
                    {data?.address_from?.stage}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('room')} span={3}>
                    {data?.address_from?.room}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions title={t('receiver.details')} bordered>
                  <Descriptions.Item label={t('username')} span={3}>
                    {data?.username_to}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('phone')} span={3}>
                    {data?.phone_to}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('address')} span={3}>
                    {data?.address_to?.address}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('house')} span={3}>
                    {data?.address_to?.house}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('stage')} span={3}>
                    {data?.address_to?.stage}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('room')} span={3}>
                    {data?.address_to?.room}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={24}>
                <Descriptions bordered className='mt-4'>
                  <Descriptions.Item label={t('client')} span={3}>
                    {data?.user?.firstname} {data?.user?.lastname}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('delivery.date.&.time')} span={3}>
                    {data?.delivery_date}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('price')} span={3}>
                    {numberToPrice(data?.total_price)}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('created.at')} span={3}>
                    {moment(data?.created_at).format('YYYY-MM-DD HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('note')} span={3}>
                    {data?.note ?? '---'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('transaction')} span={3}>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => setTransactionStatusModal(true)}
                    >
                      {data?.transaction?.status} <EditOutlined />
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            {transactionStatusModal && (
              <TransactionStatusModal
                handleCancel={() => setTransactionStatusModal(false)}
                data={data}
                fetchParcelDetails={fetchParcelDetails}
              />
            )}
          </>
        ) : (
          <Loading />
        )}
      </Modal>
    </>
  );
};

export default ShowParcelDetails;
