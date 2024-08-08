import React, { useContext, useEffect, useState } from 'react';
import {
  ClearOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  MessageOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Table,
  Image,
  Card,
  Space,
  Switch,
  Tag,
  Tabs,
  Modal,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { export_url, IMG_URL } from '../../configs/app-global';
import { Context } from '../../context/context';
import CustomModal from '../../components/modal';
import { shallowEqual, useDispatch, useSelector, batch } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import productService from '../../services/product';
import { fetchProducts } from '../../redux/slices/product';
import useDidUpdate from '../../helpers/useDidUpdate';
import brandService from '../../services/brand';
import categoryService from '../../services/category';
import shopService from '../../services/restaurant';
import SearchInput from '../../components/search-input';
import formatSortType from '../../helpers/formatSortType';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../../components/delete-button';
import ProductStatusModal from './productStatusModal';
import FilterColumns from '../../components/filter-column';
import RiveResult from '../../components/rive-result';
import { CgExport, CgImport } from 'react-icons/cg';
import { InfiniteSelect } from 'components/infinite-select';
import DigitalProductModal from './digital-product';
const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];
const roles = ['all', 'pending', 'published', 'unpublished'];
const { TabPane } = Tabs;

const ProductCategories = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [active, setActive] = useState(null);
  const [text, setText] = useState(null);
  const [role, setRole] = useState('all');
  const [links, setLinks] = useState(null);
  const [product_id, setProductId] = useState(null);
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

  const goToEdit = (uuid) => {
    dispatch(
      addMenu({
        id: `product-edit`,
        url: `product/${uuid}`,
        name: t('edit.product'),
      }),
    );
    clearData();
    navigate(`/product/${uuid}`);
  };

  const goToClone = (uuid) => {
    dispatch(
      addMenu({
        id: `product-clone`,
        url: `product-clone/${uuid}`,
        name: t('clone.product'),
      }),
    );
    clearData();
    navigate(`/product-clone/${uuid}`);
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
            height={100}
            src={IMG_URL + img}
            placeholder
            style={{ borderRadius: 4, objectFit: 'cover' }}
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
        return row.shop?.translation?.title;
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
      title: t('status'),
      is_show: true,
      dataIndex: 'status',
      key: 'status',
      render: (status, row) => {
        return (
          <div>
            {status === 'pending' ? (
              <Tag color='blue'>{t(status)}</Tag>
            ) : status === 'unpublished' ? (
              <Tag color='error'>{t(status)}</Tag>
            ) : (
              <Tag color='cyan'>{t(status)}</Tag>
            )}
            <EditOutlined onClick={() => setProductDetails(row)} />
          </div>
        );
      },
    },
    {
      title: t('digital.file'),
      is_show: true,
      dataIndex: 'digital_file',
      key: 'digital.file',
      render: (digital_file, row) => {
        return row?.digital ? (
          <div>
            {!digital_file ? (
              <Button
                icon={<FileAddOutlined onClick={() => setProductId(row.id)} />}
              />
            ) : (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setProductId(row.id)}
                />
              </Space>
            )}
          </div>
        ) : (
          <Tag color='blue'>{t('no.digital')}</Tag>
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
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row.uuid)}
            />

            {row?.status === 'unpublished' && row?.status_note && (
              <Button
                onClick={() => {
                  setIsVisibleMsgModal(true);
                  setModalText(row.status_note);
                }}
                icon={<MessageOutlined />}
              />
            )}
            <Button
              icon={<CopyOutlined />}
              onClick={() => goToClone(row.uuid)}
            />
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

  const [id, setId] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { products, meta, loading, params } = useSelector(
    (state) => state.product,
    shallowEqual,
  );
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    brand_id: data?.selectedBrand?.value,
    category_id: data?.selectedCategory?.value,
    shop_id: data?.selectedShop?.value,
    sort: data?.sort,
    status: immutable === 'all' ? undefined : immutable,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
  };

  const goToImport = () => {
    dispatch(
      addMenu({
        id: 'product-import',
        url: `catalog/product/import`,
        name: t('product.import'),
      }),
    );
    navigate(`/catalog/product/import`);
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
        dispatch(fetchProducts(paramsData));
        setText(null);
        setActive(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleActive = () => {
    setLoadingBtn(true);
    productService
      .setActive(id)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchProducts(paramsData));
        toast.success(t('successfully.updated'));
        setActive(false);
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
    dispatch(fetchProducts(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchProducts(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const excelExport = () => {
    setDownloading(true);
    productService
      .export(paramsData)
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownloading(false));
  };

  const goToAddProduct = () => {
    dispatch(
      addMenu({
        id: 'product-add',
        url: `product/add`,
        name: t('add.product'),
      }),
    );
    clearData();
    navigate(`/product/add`);
  };

  async function fetchBrands({ search, page }) {
    const params = {
      search: search?.length === 0 ? undefined : search,
      page: page,
    };
    return brandService.search(params).then((res) => {
      setLinks(res.links);
      return res.data.map((item) => ({
        label: item.title,
        value: item.id,
      }));
    });
  }

  async function fetchCategories({ search, page }) {
    const params = {
      search: search?.length === 0 ? undefined : search,
      type: 'main',
      page: page,
    };
    return categoryService.search(params).then((res) => {
      setLinks(res.links);
      return res.data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }));
    });
  }

  async function fetchUserShop({ search, page }) {
    const params = {
      search: search?.length === 0 ? undefined : search,
      status: 'approved',
      page: page,
    };
    return shopService.search(params).then((res) => {
      setLinks(res.links);
      return res.data.map((item) => ({
        label: item.translation !== null ? item.translation.title : 'no name',
        value: item.id,
      }));
    });
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

  const handleClear = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: undefined,
      }),
    );
  };

  return (
    <React.Fragment>
      <Card className='p-0'>
        <Space wrap size={[14, 20]}>
          <SearchInput
            placeholder={t('search')}
            handleChange={(e) => handleFilter({ search: e })}
            defaultValue={activeMenu.data?.search}
            resetSearch={!activeMenu.data?.search}
            style={{ minWidth: 300 }}
          />
          <InfiniteSelect
            placeholder={t('select.shop')}
            hasMore={links?.next}
            loading={loading}
            fetchOptions={fetchUserShop}
            style={{ minWidth: 180 }}
            onChange={(e) => handleFilter({ selectedShop: e })}
            value={activeMenu.data?.selectedShop}
          />

          <InfiniteSelect
            placeholder={t('select.category')}
            fetchOptions={fetchCategories}
            hasMore={links?.next}
            loading={loading}
            style={{ minWidth: 180 }}
            onChange={(e) => handleFilter({ selectedCategory: e })}
            value={activeMenu.data?.selectedCategory}
          />
          <InfiniteSelect
            placeholder={t('select.brand')}
            fetchOptions={fetchBrands}
            hasMore={links?.next}
            loading={loading}
            style={{ minWidth: 180 }}
            onChange={(e) => handleFilter({ selectedBrand: e })}
            value={activeMenu.data?.selectedBrand}
          />

          <Button onClick={goToImport}>
            <CgImport className='mr-2' />
            {t('import')}
          </Button>
          <Button loading={downloading} onClick={excelExport}>
            <CgExport className='mr-2' />
            {t('export')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAddProduct}
          >
            {t('add.product')}
          </Button>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>

          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            disabled={!activeMenu.data}
            style={{ minWidth: 150 }}
          />
        </Space>
      </Card>

      <Card title={t('product')}>
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
      {productDetails && (
        <ProductStatusModal
          orderDetails={productDetails}
          handleCancel={() => setProductDetails(null)}
          paramsData={paramsData}
        />
      )}
      <DigitalProductModal
        product_id={product_id}
        handleCancel={() => setProductId(null)}
        handleRefetch={() => {
          batch(() => {
            dispatch(fetchProducts(paramsData));
            dispatch(disableRefetch(activeMenu));
          });
        }}
      />
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
            {t('close')}
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default ProductCategories;
