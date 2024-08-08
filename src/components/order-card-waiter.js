import React from 'react';
import {
  EyeOutlined,
  UserOutlined,
  ContainerOutlined,
  CarOutlined,
  DollarOutlined,
  PayCircleOutlined,
  BorderlessTableOutlined,
  FieldTimeOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Avatar, Card, List, Skeleton, Space } from 'antd';
import { IMG_URL } from '../configs/app-global';
import numberToPrice from '../helpers/numberToPrice';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { BsTruck } from 'react-icons/bs';

const { Meta } = Card;

const OrderCardWaiter = ({ data: item, goToShow, loading }) => {
  const { t } = useTranslation();
  const data = [
    {
      title: 'Number of products',
      icon: <ContainerOutlined />,
      data: item?.order_details_count,
    },
    {
      title: 'Delivery type',
      icon: <BsTruck />,
      data: item?.delivery_type,
    },
    {
      title: 'Table',
      icon: <TableOutlined />,
      data: item?.table?.name || t('unspecified'),
    },
    {
      title: 'Amount',
      icon: <DollarOutlined />,
      data: numberToPrice(item.total_price, item.currency?.symbol),
    },
    {
      title: 'Payment type',
      icon: <PayCircleOutlined />,
      data: item.transaction?.payment_system?.tag || '-',
    },
    {
      title: 'Created at',
      icon: <FieldTimeOutlined />,
      data: moment(item?.created_at).format('YYYY-MM-DD') || '-',
    },
  ];

  return (
    <Card
      actions={[<EyeOutlined key='setting' onClick={() => goToShow(item)} />]}
      className='order-card'
    >
      <Skeleton loading={loading} avatar active>
        <Meta
          avatar={
            <Avatar src={IMG_URL + item.user?.img} icon={<UserOutlined />} />
          }
          description={`#${item.id}`}
          title={`${item.user?.firstname || '-'} ${item.user?.lastname || '-'}`}
        />
        <List
          itemLayout='horizontal'
          dataSource={data}
          renderItem={(item, key) => (
            <List.Item key={key}>
              <Space>
                {item.icon}
                {`${item.title}:  ${item.data}`}
              </Space>
            </List.Item>
          )}
        />
      </Skeleton>
    </Card>
  );
};

export default OrderCardWaiter;
