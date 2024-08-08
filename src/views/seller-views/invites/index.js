import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tag } from 'antd';
import inviteService from '../../../services/seller/invites';
import InviteModal from './invite-modal';
import { Context } from '../../../context/context';
import CustomModal from '../../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchInvites } from '../../../redux/slices/invite';
import { disableRefetch, setMenuData } from '../../../redux/slices/menu';
import formatSortType from '../../../helpers/formatSortType';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { useTranslation } from 'react-i18next';
import FilterColumns from '../../../components/filter-column';

export default function Invites() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { loading, invites, params, meta } = useSelector(
    (state) => state.invite,
    shallowEqual,
  );
  const [inviteId, setInviteId] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('fullname'),
      dataIndex: 'user',
      key: 'user',
      is_show: true,
      render: (user) => (
        <>
          {user?.firstname} {user?.lastname || ''}
        </>
      ),
    },
    {
      title: t('role'),
      dataIndex: 'role',
      key: 'role',
      is_show: true,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status) => (
        <Tag
          color={
            status === 'rejected' ? 'red' : status === 'new' ? 'blue' : 'cyan'
          }
        >
          {t(status)}
        </Tag>
      ),
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (data, row) => {
        return (
          <Space>
            <Button
              type='primary'
              onClick={() => setInviteId(row)}
              disabled={row.status === 'accepted'}
            >
              {t('accept')}
            </Button>
            <Button
              type='primary'
              danger
              onClick={() => {
                setIsModalVisible(true);
                setId(row.id);
              }}
              disabled={row.status === 'rejected'}
            >
              {t('reject')}
            </Button>
          </Space>
        );
      },
    },
  ]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchInvites());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({ activeMenu, data: { perPage, page, column, sort } }),
    );
  }

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      sort: data?.sort,
      column: data?.column,
      perPage: data?.perPage,
      page: data?.page,
    };
    dispatch(fetchInvites(paramsData));
  }, [activeMenu.data]);

  function rejectInvite() {
    setLoadingBtn(true);
    inviteService
      .statusUpdate(id)
      .then(() => {
        setIsModalVisible(false);
        setId(null);
        dispatch(fetchInvites());
      })
      .finally(() => setLoadingBtn(false));
  }

  return (
    <Card
      title={t('invites')}
      extra={
        <Space>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={invites}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
        loading={loading}
      />

      {!!inviteId && (
        <InviteModal
          inviteId={inviteId}
          handleCancel={() => setInviteId(null)}
        />
      )}

      <CustomModal
        click={rejectInvite}
        text={t('reject.invite')}
        loading={loadingBtn}
      />
    </Card>
  );
}
