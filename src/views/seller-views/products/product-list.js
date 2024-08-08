import React, { useContext, useEffect, useState } from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Table,
  Image,
  Card,
  Space,
  Tag,
  Tabs,
  Switch,
  Modal,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { export_url, IMG_URL } from '../../../configs/app-global';
import { Context } from '../../../context/context';
import CustomModal from '../../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import productService from '../../../services/seller/product';
import { fetchSellerProducts } from '../../../redux/slices/product';
import { useTranslation } from 'react-i18next';
import formatSortType from '../../../helpers/formatSortType';
import useDidUpdate from '../../../helpers/useDidUpdate';
import SearchInput from '../../../components/search-input';
import { DebounceSelect } from '../../../components/search';
import brandService from '../../../services/rest/brand';
import categoryService from '../../../services/rest/category';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';
import { CgExport, CgImport } from 'react-icons/cg';
import RiveResult from '../../../components/rive-result';

const { TabPane } = Tabs;
const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];
const roles = ['all', 'published', 'pending', 'unpublished'];

const ProductList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [role, setRole] = useState('all');
  const [id, setId] = useState(null);
  const [isVisibleMsgModal, setIsVisibleMsgModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const clearData = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: null,
      }),
    );
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        id: 'product-edit',
        url: `seller/product/${row.uuid}`,
        name: t('edit.product'),
      }),
    );
    clearData();
    navigate(`/seller/product/${row.uuid}`);
  };

  const goToClone = (row) => {
    dispatch(
      addMenu({
        id: `product-clone`,
        url: `seller/product-clone/${row.uuid}`,
        name: t('clone.product'),
      }),
    );
    clearData();
    navigate(`/seller/product-clone/${row.uuid}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('image'),
      dataIndex: 'img',
      is_show: true,
      render: (img, row) => {
        return (
          <Image
            width={100}
            src={IMG_URL + img}
            placeholder
            style={{ borderRadius: 4 }}
          />
        );
      },
    },
    {
      title: t('name'),
      dataIndex: 'name',
      is_show: true,
    },
    {
      title: t('status'),
      is_show: true,
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div>
          {status === 'published' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'unpublished' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('translations'),
      dataIndex: 'locales',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            {row.locales?.map((item, index) => (
              <Tag className='text-uppercase' color={[colors[index]]}>
                {item}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: t('shop'),
      dataIndex: 'shop_id',
      is_show: true,
      render: (_, row) => {
        return row?.shop?.translation?.title;
      },
    },
    {
      title: t('category'),
      dataIndex: 'category_name',
      is_show: true,
    },
    {
      title: t('active'),
      dataIndex: 'active',
      is_show: true,
      render: (active, row) => {
        return (
          <Switch
            onChange={() => {
              setIsModalVisible(true);
              setId(row.uuid);
              setActive(true);
            }}
            checked={active}
          />
        );
      },
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            {row?.status === 'unpublished' && row?.status_note && (
              <Button
                icon={<MessageOutlined />}
                onClick={() => {
                  setIsVisibleMsgModal(true);
                  setModalText(row.status_note);
                }}
              />
            )}
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <Button icon={<CopyOutlined />} onClick={() => goToClone(row)} />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setId([row.id]);
                setText(true);
                setActive(false);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [text, setText] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { products, meta, loading, params } = useSelector(
    (state) => state.product,
    shallowEqual,
  );
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    brand_id: data?.brand?.value,
    category_id: data?.category?.value,
    status: immutable === 'all' ? undefined : immutable,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
  };

  const productDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    productService
      .delete(params)
      .then(() => {
        setIsModalVisible(false);
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerProducts(params));
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleActive = () => {
    setLoadingBtn(true);
    productService
      .setActive(id)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchSellerProducts(paramsData));
        toast.success(t('successfully.updated'));
        setActive(true);
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
        data: { ...activeMenu.data, perPage, page, column, sort },
      }),
    );
  }

  useDidUpdate(() => {
    dispatch(fetchSellerProducts(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerProducts(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const goToAddProduct = () => {
    dispatch(
      addMenu({
        id: 'product-add',
        url: 'seller/product/add',
        name: t('add.product'),
      }),
    );
    clearData();
    navigate('/seller/product/add');
  };

  const goToImport = () => {
    dispatch(
      addMenu({
        id: 'seller-product-import',
        url: `seller/product/import`,
        name: t('product.import'),
      }),
    );
    navigate(`/seller/product/import`);
  };

  async function fetchBrands(search) {
    const params = {
      shop_id: myShop?.id,
      search,
    };
    return brandService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.title,
        value: item.id,
      })),
    );
  }

  async function fetchCategories(search) {
    const params = {
      // shop_id: myShop?.id,
      search: search.length === 0 ? null : search,
      type: 'main',
      perPage: 5,
    };
    return categoryService.search(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      })),
    );
  }

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

  const excelExport = () => {
    setDownloading(true);
    const body = {
      shop_id: myShop?.id,
      category_id: activeMenu?.data?.category?.value,
      brand_id: activeMenu?.data?.brand?.value,
    };
    productService
      .export(body)
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownloading(false));
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
  return (
    <React.Fragment>
      <Card
        className='p-0'
        title={t('product.list')}
        extra={
          <Space wrap>
            <DebounceSelect
              placeholder={t('select.category')}
              fetchOptions={fetchCategories}
              style={{ minWidth: 150 }}
              onChange={(e) => handleFilter({ category: e })}
              value={activeMenu.data?.category}
            />
            <DebounceSelect
              placeholder={t('select.brand')}
              fetchOptions={fetchBrands}
              style={{ minWidth: 150 }}
              onChange={(e) => handleFilter({ brand: e })}
              value={activeMenu.data?.brand}
            />
            <Button
              icon={<PlusCircleOutlined />}
              type='primary'
              onClick={goToAddProduct}
            >
              {t('add.product')}
            </Button>
            <FilterColumns columns={columns} setColumns={setColumns} />
          </Space>
        }
      >
        <div className='d-flex justify-content-between'>
          <SearchInput
            placeholder={t('search')}
            handleChange={(e) => handleFilter({ search: e })}
            defaultValue={activeMenu.data?.search}
            resetSearch={!activeMenu.data?.search}
            className={'w-25'}
          />

          <Space wrap>
            <Button onClick={goToImport}>
              <CgImport className='mr-2' />
              {t('import')}
            </Button>
            <Button loading={downloading} onClick={excelExport}>
              <CgExport className='mr-2' />
              {t('export')}
            </Button>

            <DeleteButton size='' onClick={allDelete}>
              {t('delete.selected')}
            </DeleteButton>
          </Space>
        </div>
      </Card>
      <Card>
        <Tabs
          className='mt-3'
          activeKey={immutable}
          onChange={(key) => {
            handleFilter({ role: key, page: 1 });
            setRole(key);
          }}
          type='card'
        >
          {roles.map((item) => (
            <TabPane tab={t(item)} key={item} />
          ))}
        </Tabs>
        <Table
          locale={{
            emptyText: <RiveResult />,
          }}
          scroll={{ x: true }}
          rowSelection={rowSelection}
          loading={loading}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={products}
          pagination={{
            pageSize: params.perPage,
            page: activeMenu.data?.page || 1,
            total: meta.total,
            defaultCurrent: activeMenu.data?.page,
            current: activeMenu.data?.page,
          }}
          onChange={onChangePagination}
          rowKey={(record) => record.id}
        />
      </Card>
      <CustomModal
        click={active ? handleActive : productDelete}
        text={
          active
            ? t('set.active.product')
            : text
            ? t('delete')
            : t('all.delete')
        }
        loading={loadingBtn}
        setText={setId}
        setActive={setActive}
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
            Close
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default ProductList;
