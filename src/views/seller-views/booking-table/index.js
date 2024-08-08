import React, { useContext, useEffect, useState } from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';
import useDidUpdate from '../../../helpers/useDidUpdate';
import formatSortType from '../../../helpers/formatSortType';
import { fetchBookingTable } from '../../../redux/slices/booking-tables';
import sellerBookingTable from '../../../services/seller/booking-table';
import { Button, Card, Modal, Space, Table, Tooltip } from 'antd';
import TableQrCode from './table-qrcode';

const BookingTables = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [text, setText] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const data = activeMenu?.data;

  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    search: data?.search ? data.search : undefined,
    perPage: data?.perPage || 10,
    page: data?.page || 1,
  };

  const { tables, meta, loading } = useSelector(
    (state) => state.bookingTable,
    shallowEqual
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        id: 'booking-table-edit',
        url: `seller/booking/table/${row.id}`,
        name: t('booking.table.edit'),
      })
    );
    navigate(`/seller/booking/table/${row.id}`);
  };

  const goToClone = (row) => {
    dispatch(
      addMenu({
        id: 'booking-table-clone',
        url: `seller/booking/table/clone/${row.id}`,
        name: t('booking.table.clone'),
      })
    );
    navigate(`/seller/booking/table/clone/${row.id}`);
  };

  const goToAddBox = () => {
    dispatch(
      addMenu({
        id: 'booking-table-add',
        url: 'seller/booking/table/add',
        name: t('booking.table.add'),
      })
    );
    navigate('/seller/booking/table/add');
  };

  const openQrCode = (row) => {
    setSelectedTable(row);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
      sorter: true,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      is_show: true,
      render: (_, row) => row?.name,
    },
    {
      title: t('sected.zone'),
      key: 'name',
      is_show: true,
      render: (_, row) => row.shop_section?.translation?.title,
    },
    {
      title: t('chair.count'),
      dataIndex: 'chair_count',
      key: 'chair_count',
      is_show: true,
    },
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
              onClick={() => goToEdit(row)}
            />
            <Button icon={<CopyOutlined />} onClick={() => goToClone(row)} />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
            />
            <Tooltip title={t('show.qrcode')}>
              <Button
                icon={<QrcodeOutlined />}
                onClick={() => openQrCode(row)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ]);

  const brandDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    sellerBookingTable
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchBookingTable(paramsData));
        setIsModalVisible(false);
        setText(null);
        setId(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, perPage, page, column, sort },
      })
    );
  }

  useDidUpdate(() => {
    dispatch(fetchBookingTable(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchBookingTable(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

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

  return (
    <>
      <Card className='p-0'>
        <Space wrap className='justify-content-end w-100'>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAddBox}
          >
            {t('add.booking.table')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      </Card>

      <Card title={t('booking.tables')}>
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={tables}
          pagination={{
            pageSize: meta.per_page,
            page: meta.current_page,
            total: meta.total,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
          loading={loading}
        />
      </Card>
      <CustomModal
        click={brandDelete}
        text={text ? t('delete') : t('all.delete')}
        setText={setId}
        loading={loadingBtn}
      />
      <Modal
        width={400}
        visible={!!selectedTable}
        footer={null}
        onCancel={() => setSelectedTable(null)}
      >
        <TableQrCode table={selectedTable} />
      </Modal>
    </>
  );
};

export default BookingTables;
