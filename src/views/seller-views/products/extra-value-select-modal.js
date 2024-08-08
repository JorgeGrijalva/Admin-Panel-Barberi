import { Badge, Button, Checkbox, Empty, List, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import extraService from 'services/extra';
import ExtraValueModal from './Extras/extra-value-modal';
import { PlusOutlined } from '@ant-design/icons';
import { GetColorName } from 'hex-color-to-color-name';
import Scrollbars from 'react-custom-scrollbars';

const ExtraValueSelectModal = ({ extra, onClose, onSelect }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [extraValues, setExtraValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleChange = (values) => {
    setSelectedValues(values);
  };

  const handleSelect = () => {
    const list = [];
    extraValues.forEach((extraValue) => {
      selectedValues.forEach((value) => {
        if (extraValue.value === value) {
          list.push(extraValue);
        }
      });
    });
    onSelect(extra?.value, list);
    onClose();
  };

  function fetchExtra(id) {
    setLoading(true);
    extraService
      .getGroupById(id)
      .then((res) =>
        setExtraValues(
          res.data.extra_values.map((item) => ({
            label: item.value,
            value: item.id,
            group_type: item.group.type,
          })),
        ),
      )
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    if (!!extra?.value && !isAddModalOpen) {
      fetchExtra(extra.value);
      setSelectedValues(extra?.values?.map((value) => value.value) || []);
    }
  }, [extra?.value, isAddModalOpen]);

  return (
    <>
      <Modal
        visible={!!extra}
        onCancel={onClose}
        footer={[
          <Button onClick={onClose}>{t('cancel')}</Button>,
          !loading && extraValues.length > 0 && (
            <Button onClick={handleSelect} type='primary'>
              {t('save')}
            </Button>
          ),
        ]}
      >
        <Scrollbars
          autoHide
          autoHeight
          autoHeightMin={'60vh'}
          autoHeightMax={'60vh'}
        >
          <Checkbox.Group
            value={selectedValues}
            onChange={handleChange}
            className='w-100'
          >
            {extraValues?.length === 0 && !loading ? (
              <Empty />
            ) : (
              <List
                dataSource={extraValues}
                loading={loading}
                renderItem={(item) => (
                  <List.Item>
                    <Checkbox value={item.value}>
                      {item.group_type === 'color' ? (
                        <Space size='small'>
                          <Badge
                            className='extras-color-badge'
                            color={item?.label}
                          />
                          {GetColorName(item?.label)}
                          <span>({item?.label})</span>
                        </Space>
                      ) : (
                        <span>{item?.label}</span>
                      )}
                    </Checkbox>
                  </List.Item>
                )}
              />
            )}
          </Checkbox.Group>
        </Scrollbars>
        {!loading ? (
          <Button
            type='link'
            onClick={() => setIsAddModalOpen(true)}
            style={{ paddingLeft: 0 }}
            icon={<PlusOutlined />}
          >
            {t('add.new.extra')}
          </Button>
        ) : null}
      </Modal>
      {extra && (
        <ExtraValueModal
          isVisible={isAddModalOpen}
          modal={{
            label: extra?.label,
            value: extra?.id,
            key: extra?.id,
          }}
          handleCancel={() => setIsAddModalOpen(false)}
          groupId={extra?.value}
          onSuccess={() => fetchExtra(extra?.value)}
        />
      )}
    </>
  );
};

export default ExtraValueSelectModal;
