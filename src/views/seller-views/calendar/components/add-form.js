import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Menu, Modal } from 'antd';
import { BookingContext } from '../provider';
import { t } from 'i18next';
import formOptionsRestService from 'services/rest/form-options';
import FormItems from './form-items';

const AddForm = () => {
  const { isAddForm, setIsAddForm } = useContext(BookingContext);
  const [formList, setFormList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleCancel = () => {
    setIsAddForm(false);
  };

  const items = formList.map((item) => {
    return {
      key: item.id,
      label: item.translation.title,
    };
  });

  const getFormItems = () => {
    formOptionsRestService
      .getAll()
      .then(({ data }) => {
        setFormList(data);
        setSelectedId(data[0].id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectedItem = useMemo(() => {
    const item = formList.find((item) => item.id === selectedId);

    return item;
  }, [selectedId, formList]);

  useEffect(() => {
    getFormItems();
  }, []);

  return (
    <Modal
      centered
      width={912}
      footer={null}
      visible={isAddForm}
      onCancel={handleCancel}
      title={t('select.a.form')}
    >
      <div className='d-flex gap-2'>
        <Menu
          style={{
            width: 256,
          }}
          mode='vertical'
          items={items}
          onClick={({ key }) => setSelectedId(Number(key))}
        />
        <FormItems item={selectedItem} formList={formList} />
      </div>
    </Modal>
  );
};

export default AddForm;
