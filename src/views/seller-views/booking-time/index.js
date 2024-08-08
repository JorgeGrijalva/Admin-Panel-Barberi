import React, { useContext, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { Context } from '../../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from '../../../redux/slices/menu';
import { fetchBookingTime } from '../../../redux/slices/booking-time';
import { useTranslation } from 'react-i18next';
import CustomModal from '../../../components/modal';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';
import sellerBookingTime from '../../../services/seller/booking-time';
import { useNavigate } from 'react-router-dom';
import RiveResult from 'components/rive-result';

const BookingTables = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const data = activeMenu?.data;
  const navigate = useNavigate();

  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    search: data?.search ? data.search : undefined,
    perPage: data?.perPage,
    page: data?.page,
  };

  const { data: time } = useSelector(
    (state) => state.bookingTime,
    shallowEqual
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/booking/time/${row.id}`,
        id: 'booking_time_edit',
        name: t('edit.booking.time'),
      })
    );
    navigate(`/seller/booking/time/${row.id}`);
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        url: `seller/booking/time/add`,
        id: 'booking_time_add',
        name: t('add.booking.time'),
      })
    );
    navigate(`/seller/booking/time/add`);
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
      render: (_, row) => {
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
                setId([row.id]);
                setIsModalVisible(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const bookingtableDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    sellerBookingTime
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchBookingTime(paramsData));
        setIsModalVisible(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchBookingTime(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <>
      <Card className='p-0'>
        <Space wrap className='justify-content-end w-100'>
          <Button
            hidden={time?.length > 0}
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => goToAdd(true)}
          >
            {t('add.reservation.time')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      </Card>

      <Card title={t('reservation.time')}>
        <Table
          scroll={{ x: true }}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={time}
          rowKey={(record) => record?.id}
          locale={{
            emptyText: <RiveResult id='nosell' />,
          }}
        />
      </Card>
      <CustomModal
        click={bookingtableDelete}
        text={t('delete')}
        setText={setId}
        loading={loadingBtn}
        setActive={setId}
      />
    </>
  );
};

export default BookingTables;
