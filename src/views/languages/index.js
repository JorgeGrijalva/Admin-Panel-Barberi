import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Image, Space, Tag, Card } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Context } from '../../context/context';
import { toast } from 'react-toastify';
import CustomModal from '../../components/modal';
import languagesService from '../../services/languages';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import getImage from '../../helpers/getImage';
import DeleteButton from '../../components/delete-button';
import { fetchLang } from '../../redux/slices/languages';
import FilterColumns from '../../components/filter-column';
import useDemo from '../../helpers/useDemo';

const Languages = () => {
  const { t } = useTranslation();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState('');
  const { setIsModalVisible } = useContext(Context);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDemo, demoFunc } = useDemo();
  const { allLanguages, loading } = useSelector(
    (state) => state.languages,
    shallowEqual,
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `language/${row.id}`,
        id: 'language_edit',
        name: t('edit.language'),
      }),
    );
    navigate(`/language/${row.id}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      is_show: true,
    },
    {
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      is_show: true,
      render: (img, row) => {
        return (
          <Image
            src={getImage(img)}
            alt='img_gallery'
            width={100}
            className='rounded'
            preview
            placeholder
            key={img + row.id}
          />
        );
      },
    },
    {
      title: t('status'),
      dataIndex: 'active',
      key: 'active',
      is_show: true,
      render: (active) =>
        active ? (
          <Tag color='cyan'> {t('active')}</Tag>
        ) : (
          <Tag color='yellow'>{t('inactive')}</Tag>
        ),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (data, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            {!row?.default && (
              <DeleteButton
                icon={<DeleteOutlined />}
                onClick={() => {
                  if (allLanguages?.length === 1) {
                    toast.error(t('at.least.one.language'));
                    return;
                  }
                  setId([row.id]);
                  setType('deleteLang');
                  setIsModalVisible(true);
                }}
              />
            )}
          </Space>
        );
      },
    },
  ]);

  const setDefaultLang = () => {
    setLoadingBtn(true);
    languagesService
      .setDefault(id)
      .then(() => {
        toast.success(t('successfully.updated'));
        setIsModalVisible(false);
        dispatch(fetchLang());
      })
      .finally(() => setLoadingBtn(false));
  };

  const deleteLang = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    languagesService
      .delete(params)
      .then(() => {
        setIsModalVisible(false);
        toast.success(t('successfully.deleted'));
        dispatch(fetchLang());
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchLang());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add.language',
        url: `language/add`,
        name: t('add.language'),
      }),
    );
    navigate(`/language/add`);
  };

  return (
    <Card
      title={t('languages')}
      extra={
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.language')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={allLanguages}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={false}
        rowSelection={{
          selectedRowKeys: [allLanguages.find((item) => item.default)?.id],
          type: 'radio',
          onChange: (values) => {
            if (isDemo) {
              demoFunc();
              return;
            }
            setIsModalVisible(true);
            setId(values[0]);
            setType(true);
          },
        }}
      />
      <CustomModal
        click={type === 'deleteLang' ? deleteLang : setDefaultLang}
        text={
          type !== 'deleteLang' ? t('change.default.language') : t('delete')
        }
        loading={loadingBtn}
      />
    </Card>
  );
};

export default Languages;
