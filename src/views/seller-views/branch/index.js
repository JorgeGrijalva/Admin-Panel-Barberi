import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from '../../../redux/slices/menu';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { fetchBranch } from '../../../redux/slices/branch';
import branchService from '../../../services/seller/branch';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';

const SellerBranch = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { branches, meta, loading } = useSelector(
    (state) => state.branch,
    shallowEqual
  );

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('title'),
      is_show: true,
      dataIndex: 'title',
      key: 'title',
      render: (_, row) => {
        return <>{row?.translation?.title}</>;
      },
    },
    {
      title: t('address'),
      is_show: true,
      dataIndex: 'address',
      key: 'address',
      render: (_, row) => {
        return <>{row?.address?.address}</>;
      },
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      dataIndex: 'options',
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
              setText(true);
            }}
          />
        </Space>
      ),
    },
  ]);

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/branch/${row.id}`,
        id: 'branch_edit',
        name: t('edit.branch'),
      })
    );
    navigate(`/seller/branch/${row.id}`);
  };

  const branchDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };

    branchService
      .delete(params)
      .then(() => {
        dispatch(fetchBranch());
        toast.success(t('successfully.deleted'));
        setId(null);
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchBranch());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchBranch({ perPage: pageSize, page: current }));
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

  const goToAddBranch = () => {
    dispatch(
      addMenu({
        url: `seller/branch/add`,
        id: 'add.branch',
        name: t('add.branch'),
      })
    );
    navigate(`/seller/branch/add`);
  };

  return (
    <Card
      title={t('branch')}
      extra={
        <Space wrap>
          <Button
            size='small'
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAddBranch}
          >
            {t('add.branch')}
          </Button>
          <DeleteButton type='danger' onClick={allDelete}>
            {t('delete.all')}
          </DeleteButton>

          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={branches}
        pagination={{
          pageSize: meta?.per_page,
          page: meta?.current_page,
          total: meta?.total,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal
        click={branchDelete}
        text={text ? t('delete') : t('all.delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
};

export default SellerBranch;
