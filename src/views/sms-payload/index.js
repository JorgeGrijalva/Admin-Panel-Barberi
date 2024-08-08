import React, { useEffect } from 'react';
import { Button, Card, Space, Table } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { disableRefetch } from '../../redux/slices/menu';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchSms } from '../../redux/slices/sms-geteways';
import { useNavigate } from 'react-router-dom';
import { addMenu } from '../../redux/slices/menu';

export default function SmsGateways() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { smsGatewaysList, loading } = useSelector(
    (state) => state.sms,
    shallowEqual
  );

  const goToEdit = (type) => {
    dispatch(
      addMenu({
        id: 'sms-payload-edit',
        url: `settings/sms-payload/${type}`,
        name: t('edit.sms.payload'),
      })
    );
    navigate(`/settings/sms-payload/${type}`);
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'sms-payload-add',
        url: 'settings/sms-payload/add',
        name: t('add.sms.payload'),
      })
    );
    navigate('/settings/sms-payload/add');
  };

  const columns = [
    {
      title: t('type'),
      dataIndex: 'type',
      width: '80%',
    },
    // {
    //   title: t('twilio.number'),
    //   dataIndex: 'twilio_number',
    //   render: (_, row) => row.payload?.twilio_number,
    // },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row.type)}
            />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSms());
      dispatch(disableRefetch(activeMenu));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('sms.payload')}
      extra={
        <Space>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAdd}
          >
            {t('add.sms.payload')}
          </Button>
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={smsGatewaysList}
        pagination={false}
        loading={loading}
      />
    </Card>
  );
}
