import React, { useContext, useEffect, useState } from 'react';
import { Card, Image, Table, Button, Space, Tag, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import getImage from '../../../helpers/getImage';
import CreateCategory from './createCategory';
import { EditOutlined, MessageOutlined } from '@ant-design/icons';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
import FilterColumns from '../../../components/filter-column';
import formatSortType from '../../../helpers/formatSortType';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { fetchSellerRequestModels } from 'redux/slices/request-models';
import { HiArrowNarrowRight } from 'react-icons/hi';
import DeleteButton from 'components/delete-button';
import requestModelsService from 'services/seller/request-models';

const body = {
  type: 'category',
};

export default function SellerCategoryRequests({ parentId }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [isVisibleMsgModal, setIsVisibleMsgModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const {
    data: requests,
    meta,
    loading,
    params,
  } = useSelector((state) => state.requestModels, shallowEqual);
  const data = activeMenu.data;
  const { uuid: parentUuid } = useParams();

  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    parent_id: parentId,
    type: 'category',
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/category-request/${row.id}`,
        id: 'request_edit',
        name: t('request.edit'),
      })
    );
    navigate(`/seller/category-request/${row.id}`, {
      state: { parentId, parentUuid },
    });
  };

  const [columns, setColumns] = useState([
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      is_show: true,
      render: (_, row) => (
        <Space>
          {row.model?.translation?.title} <HiArrowNarrowRight />{' '}
          {row.data?.title[row?.model?.translation?.locale]}
        </Space>
      ),
    },
    {
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Image
              src={getImage(row?.model?.img)}
              alt='img_gallery'
              width={100}
              className='rounded'
              preview
              placeholder
            />
            <HiArrowNarrowRight />
            <Image
              src={getImage(row?.data?.images.at(0))}
              alt='img_gallery'
              width={100}
              className='rounded'
              preview
              placeholder
            />
          </Space>
        );
      },
    },
    {
      title: t('status'),
      dataIndex: 'status',
      is_show: true,
      render: (status) => (
        <div>
          {status === 'new' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'canceled' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => goToEdit(row)} />
            {row?.status === 'cancelled' && row?.status_note && (
              <Button
                icon={<MessageOutlined />}
                onClick={() => {
                  setIsVisibleMsgModal(true);
                  setModalText(row.status_note);
                }}
              />
            )}
            <DeleteButton
              danger
              type='primary'
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

  useEffect(() => {
    dispatch(fetchSellerRequestModels(paramsData));
    dispatch(disableRefetch(activeMenu));
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchSellerRequestModels(paramsData));
  }, [activeMenu.data]);

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      })
    );
  }

  const categoryDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    requestModelsService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerRequestModels(body));
        setIsModalVisible(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleCancel = () => setIsModalOpen(false);

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      })
    );
  };

  return (
    <Card
      title={t('requests')}
      extra={
        <Space wrap>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={requests}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        rowKey={(record) => record.key}
        onChange={onChangePagination}
        loading={loading}
      />
      {isModalOpen && (
        <CreateCategory handleCancel={handleCancel} isModalOpen={isModalOpen} />
      )}
      <CustomModal
        click={categoryDelete}
        text={t('delete')}
        setText={setId}
        loading={loadingBtn}
      />
      <Modal
        title='Reject message'
        closable={false}
        visible={isVisibleMsgModal}
        footer={null}
        centered
      >
        <p>{modalText}</p>
        <div className='d-flex justify-content-end'>
          <Button
            type='primary'
            className='mr-2'
            onClick={() => setIsVisibleMsgModal(false)}
          >
            {t('close')}
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
