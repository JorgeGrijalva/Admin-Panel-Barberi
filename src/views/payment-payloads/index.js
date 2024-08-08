import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { addMenu, disableRefetch } from '../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import CustomModal from '../../components/modal';
import { toast } from 'react-toastify';
import { Context } from '../../context/context';
import { useNavigate } from 'react-router-dom';
import DeleteButton from '../../components/delete-button';
import FilterColumns from '../../components/filter-column';
import { fetchPaymentPayloads } from '../../redux/slices/paymentPayload';
import { paymentPayloadService } from '../../services/paymentPayload';

export default function PaymentPayloads() {
  const { t } = useTranslation();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const navigate = useNavigate();
  const [text, setText] = useState(null);
  const { payloads, loading } = useSelector(
    (state) => state.paymentPayload,
    shallowEqual
  );
  const [columns, setColumns] = useState([
    {
      title: t('payment.id'),
      is_show: true,
      dataIndex: 'payment_id',
      key: 'payment_id',
    },
    {
      title: t('title'),
      is_show: true,
      dataIndex: 'title',
      key: 'title',
      render: (title, row) => {
        return <>{row.payment?.tag}</>;
      },
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      dataIndex: 'options',
      render: (data, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.payment_id]);
                setIsModalVisible(true);
                setText(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `payment-payloads/edit/${row.payment_id}`,
        id: 'edit.payment.payloads',
        name: t('edit.payment.payloads'),
      })
    );
    navigate(`/payment-payloads/edit/${row.payment_id}`);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchPaymentPayloads());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchPaymentPayloads({ perPage: pageSize, page: current }));
  };

  const paymentDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    paymentPayloadService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchPaymentPayloads());
        setIsModalVisible(false);
        setText(null);
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setId(newSelectedRowKeys);
  };

  const rowSelection = {
    id,
    onChange: onSelectChange,
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
        id: 'add.payment.payloads',
        url: 'payment-payloads/add',
        name: t('add.payment.payloads'),
      })
    );
    navigate('/payment-payloads/add');
  };

  return (
    <Card
      title={t('payment')}
      extra={
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.payment.payloads')}
          </Button>
          <DeleteButton className='' onClick={allDelete}>
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
        dataSource={payloads}
        rowKey={(record) => record.payment_id}
        onChange={onChangePagination}
        loading={loading}
      />
      <CustomModal
        click={paymentDelete}
        text={text ? t('delete') : t('all.delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
}
