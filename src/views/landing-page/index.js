import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from 'redux/slices/menu';
import { fetchLandingPages } from 'redux/slices/landing-page';
import { useTranslation } from 'react-i18next';
import FilterColumns from 'components/filter-column';
import RiveResult from 'components/rive-result';

const LandingPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { data, loading } = useSelector(
    (state) => state.landingPage,
    shallowEqual
  );

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      is_show: true,
      render: (type) => t(type),
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
        </Space>
      ),
    },
  ]);

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'settings/landing-page/add',
        url: 'settings/landing-page/add',
        name: t('add.landing.page'),
      })
    );
    navigate('/settings/landing-page/add');
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        id: 'settings/landing-page/edit',
        url: `settings/landing-page/${row.type}`,
        name: t('edit.landing.page'),
      })
    );
    navigate(`/settings/landing-page/${row.type}`);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchLandingPages());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('landing.page')}
      extra={
        <Space>
          {!data?.length && (
            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              onClick={goToAdd}
            >
              {t('add.landing.page')}
            </Button>
          )}

          <FilterColumns setColumns={setColumns} columns={columns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={data}
        pagination={false}
        rowKey={(record) => record.id}
        locale={{
          emptyText: <RiveResult />,
        }}
        loading={loading}
      />
    </Card>
  );
};

export default LandingPage;
