import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from 'redux/slices/menu';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DeleteButton from 'components/delete-button';
import { fetchMessageSubscriber } from 'redux/slices/messegeSubscriber';
import messageSubscriberService from 'services/messageSubscriber';
import moment from 'moment';
import FilterColumns from 'components/filter-column';

const MessageSubscribed = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `message/subscriber/${row.id}`,
        id: 'subciribed_edit',
        name: t('edit.subscriber'),
      }),
    );
    navigate(`/message/subscriber/${row.id}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('send.to'),
      dataIndex: 'send_to',
      key: 'send_to',
      is_show: true,
      render: (expired_at) => (
        <div>
          {moment(new Date()).isBefore(expired_at) ? (
            <Tag color='blue'>{expired_at}</Tag>
          ) : (
            <Tag color='error'>{expired_at}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (created_at) => moment(created_at).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => goToEdit(row)}
          />
          <DeleteButton
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setId([row.id]);
              setType(false);
              setText(true);
            }}
          />
        </Space>
      ),
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [text, setText] = useState(null);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { subscribers, loading } = useSelector(
    (state) => state.messageSubscriber,
    shallowEqual,
  );

  const subscriberDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    messageSubscriberService
      .delete(params)
      .then(() => {
        dispatch(fetchMessageSubscriber());
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
        setText(null);
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchMessageSubscriber());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchMessageSubscriber({ perPage: pageSize, page: current }));
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'message_subscriber_add',
        url: `message/subscriber/add`,
        name: t('add.subciribed'),
      }),
    );
    navigate(`/message/subscriber/add`);
  };

  return (
    <Card
      title={t('message.subscriber')}
      extra={
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.subscriber')}
          </Button>

          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={subscribers}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal
        click={subscriberDelete}
        text={
          type ? t('set.active.banner') : text ? t('delete') : t('all.delete')
        }
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
};

export default MessageSubscribed;
