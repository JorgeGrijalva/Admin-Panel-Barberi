import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, Space, Switch, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import CustomModal from '../../components/modal';
import { fetchEmailProvider } from '../../redux/slices/emailProvider';
import emailService from '../../services/emailSettings';
import { toast } from 'react-toastify';
import { Context } from '../../context/context';
import { addMenu, disableRefetch, setRefetch } from '../../redux/slices/menu';
import moment from 'moment';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import hideEmail from '../../components/hideEmail';
import useDemo from '../../helpers/useDemo';
import DeleteButton from '../../components/delete-button';

export default function EmailProvider() {
  const { t } = useTranslation();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [modalType, setModalType] = useState('delete'); // delete | active
  const { setIsModalVisible } = useContext(Context);
  const { isDemo } = useDemo();
  const { emailProvider, loading } = useSelector(
    (state) => state.emailProvider,
    shallowEqual,
  );

  const goToAddEmailProviders = () => {
    dispatch(
      addMenu({
        id: 'add_email_providers',
        url: `settings/emailProviders/add`,
        name: t('add_email_providers'),
      }),
    );
    navigate(`/settings/emailProviders/add`);
  };

  function goToEditEmailProviders(row) {
    dispatch(
      addMenu({
        url: `settings/emailProviders/${row.id}`,
        id: 'edit_email_providers',
        name: t('edit.email.providers'),
      }),
    );
    navigate(`/settings/emailProviders/${row.id}`, { state: 'edit' });
  }

  const columns = [
    {
      title: t('from_site'),
      dataIndex: 'from_site',
      key: 'from_site',
    },
    {
      title: t('from.to'),
      dataIndex: 'from_to',
      key: 'from_to',
      render: (from_to) => (isDemo ? hideEmail(from_to) : from_to),
    },
    {
      title: t('active'),
      dataIndex: 'active',
      render: (active, row) => {
        return (
          <Switch
            onChange={() => {
              setModalType('active');
              setIsModalVisible(true);
              setId(row.id);
            }}
            checked={active}
          />
        );
      },
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => moment(created_at).format('YYYY-MM-DD'),
    },
    {
      title: t('options'),
      key: 'id',
      dataIndex: 'id',
      is_show: true,
      render: (id, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEditEmailProviders(row)}
            />
            <DeleteButton onClick={() => confirmDelete(id)} />
          </Space>
        );
      },
    },
  ];

  const confirmDelete = (id) => {
    if (!id) {
      toast.warning(t('no.id'));
    } else {
      setModalType('delete');
      setId([id]);
      setIsModalVisible(true);
    }
  };

  const handleDeleteConditions = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    emailService
      .delete(params)
      .then(() => {
        setId(null);
        setIsModalVisible(false);
        toast.success(t('successfully.deleted'));
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoadingBtn(false));
  };

  const setDefaultLang = () => {
    setLoadingBtn(true);
    emailService
      .setActive(id)
      .then(() => {
        toast.success(t('successfully.updated'));
        setIsModalVisible(false);
        dispatch(fetchEmailProvider());
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchEmailProvider());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('email.provider')}
      extra={
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAddEmailProviders}
          >
            {t('add.email.provider')}
          </Button>
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={emailProvider}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={false}
      />
      <CustomModal
        click={modalType === 'delete' ? handleDeleteConditions : setDefaultLang}
        text={
          modalType === 'delete'
            ? t('are.you.sure.to.delete')
            : t('set.active.email.provider')
        }
        loading={loadingBtn}
      />
    </Card>
  );
}
