import { Button, Input, List, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import extraService from 'services/extra';
import ExtraGroupModal from './Extras/extra-group-modal';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import useDebounce from 'helpers/useDebounce';

const ExtraSelectModal = ({ open, onClose, selectedExtras, onSelect }) => {
  const { t } = useTranslation();
  const [extrasGroup, setExtrasGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const getExtraGroup = (query) => {
    setLoading(true);
    const params = { valid: 1, perPage: 100, search: query };
    extraService
      .getAllGroups(params)
      .then((res) => {
        const data = res.data.map((item) => ({
          id: item.id,
          label: item.translation?.title,
          value: item.id,
          shop_id: item.shop_id,
          group: {
            ...item,
          },
        }));
        setExtrasGroup(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) {
      getExtraGroup(debouncedSearch);
    }
  }, [open, debouncedSearch]);

  return (
    <>
      <Modal
        visible={open}
        onCancel={() => {
          onClose();
          setSearch('');
        }}
        footer={null}
      >
        <Input
          className='mt-3'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <List
          loading={loading}
          dataSource={extrasGroup.filter(
            (extraItem) =>
              !selectedExtras?.some(
                (selectedExtra) => selectedExtra.id === extraItem.id,
              ),
          )}
          renderItem={(item) => (
            <List.Item
              extra={!item?.shop_id ? <Tag>{t('admin')}</Tag> : null}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onSelect(item);
              }}
            >
              {item.label}
            </List.Item>
          )}
          footer={
            !loading ? (
              <Button
                type='link'
                onClick={() => setIsAddModalOpen(true)}
                style={{ paddingLeft: 0 }}
                icon={<PlusOutlined />}
              >
                {t('add.new.extra')}
              </Button>
            ) : null
          }
        />
      </Modal>
      <ExtraGroupModal
        modal={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        onSuccess={() => getExtraGroup()}
      />
    </>
  );
};

export default ExtraSelectModal;
