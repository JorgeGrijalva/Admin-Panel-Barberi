import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  message,
  Modal,
  Row,
  Space,
  Table,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setMenuData } from 'redux/slices/menu';
import productService from 'services/product';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DeleteButton from 'components/delete-button';
import propertyService from 'services/property';
import { DebounceSelect } from 'components/search';

const ProductProperty = ({ next, prev }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { uuid } = useParams();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [dataSource, setDataSource] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [groupSelected, setGroupSelected] = useState(null);

  const column = [
    {
      key: '2',
      title: t('property.group'),
      dataIndex: 'group',
      render: (group, row) => group?.translation?.title || '-',
    },
    {
      key: '4',
      title: t('property.value'),
      dataIndex: 'value',
      render: (value, row) => value?.value || '-',
    },
    {
      key: '5',
      title: t('options'),
      render: (record) => {
        return (
          <Space>
            <DeleteButton
              type='primary'
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDeleteProduct(record)}
            />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (dataSource.length && uuid) {
      const properties = dataSource;
      dispatch(
        setMenuData({
          activeMenu,
          data: { ...activeMenu.data, properties },
        }),
      );
    }
  }, [dataSource]);

  const addProperties = (data) => {
    productService
      .properties(uuid, { properties: data })
      .then(() => {
        message.success(t('product.properties.saved'));
        getPropduct(uuid);
      })
      .finally(() => setLoadingBtn(false));
  };

  const onDeleteProduct = (record) => {
    Modal.confirm({
      title: t('delete.product'),
      okText: t('yes'),
      okType: 'danger',
      onOk: () => {
        const data = dataSource
          ?.filter((item) => item.id !== record.id)
          ?.map((item) => item?.value?.id);
        addProperties(data);
      },
    });
  };

  const getPropduct = (id) => {
    setFetching(true);
    productService
      .getById(id)
      .then(({ data }) => {
        setDataSource(data?.properties?.filter((item) => item?.value));
        form.resetFields();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setFetching(false);
      });
  };
  useEffect(() => {
    if (uuid) {
      getPropduct(uuid);
    }
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const valuesProperties = values.propertyValue.map((item) => item.value);
    const oldIds = dataSource?.map((item) => item?.value?.id);
    const set = new Set([...valuesProperties, ...oldIds]);
    const setArray = Array.from(set);
    addProperties({ ...setArray });
  };

  async function fetchPropertyValueList(search) {
    const params = { perPage: 10, active: 1, search };
    return propertyService.getAllValues(params).then((res) =>
      res?.data?.map((item) => ({
        value: item?.id,
        label: item?.value,
        key: item?.id,
      })),
    );
  }

  const fetchPropertyGroup = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
    };

    return propertyService.getAllGroups(params).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };
  const fetchPropertyValue = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      group_id: groupSelected?.value,
    };

    return propertyService.getAllValues(params).then((res) =>
      res.data.map((item) => ({
        label: item?.value,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  return (
    <Card>
      <Form
        name='property-form'
        layout='vertical'
        form={form}
        onFinish={onFinish}
      >
        <Row
          gutter={24}
          className='mb-3'
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Col span={10}>
            <Form.Item
              name={'propertyGroup'}
              label={t('property.group')}
              rules={[{ required: true, message: t('required') }]}
            >
              <DebounceSelect
                fetchOptions={fetchPropertyGroup}
                placeholder={t('select.group')}
                onSelect={(item) => {
                  setGroupSelected(item);
                  form.setFieldsValue({ propertyValue: [] });
                }}
                onClear={() => {
                  setGroupSelected(null);
                  form.setFieldsValue({ propertyValue: [] });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name={'propertyValue'}
              label={t('property.value')}
              rules={[{ required: true, message: t('required') }]}
            >
              <DebounceSelect
                fetchOptions={fetchPropertyValue}
                placeholder={t('select.value')}
                refetchOptions={true}
                disabled={!groupSelected}
                mode='multiple'
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('save')}
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        scroll={{ x: true }}
        columns={column}
        dataSource={dataSource}
        pagination={false}
        rowKey={(record) => record.id}
        loading={isFetching}
      />
      <Space className='mt-4'>
        <Button onClick={prev}>{t('prev')}</Button>
        <Button type='primary' onClick={next}>
          {t('next')}
        </Button>
      </Space>
    </Card>
  );
};

export default ProductProperty;
