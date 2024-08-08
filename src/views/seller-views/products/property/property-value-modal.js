import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ImageUploadSingle from 'components/image-upload-single';
import createImage from 'helpers/createImage';
import { fetchSellerPropertyValue } from 'redux/slices/propertyValue';
import propertyService from 'services/seller/property';
import { DebounceSelect } from 'components/search';

export default function PropertyValueModal({
  modal,
  handleCancel,
  onSuccess,
  groupId,
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [type, setType] = useState('text');
  const [image, setImage] = useState(null);
  const [color, setColor] = useState('');

  useEffect(() => {
    if (modal?.id) {
      setType(modal.group.type);
      const body = {
        ...modal,
        property_group_id: {
          label: modal?.group?.translation?.title,
          value: modal?.group?.id,
        },
        value: modal.value,
      };
      switch (modal.group.type) {
        case 'color':
          setColor(modal.value);
          break;

        case 'image':
          setImage(createImage(modal.value));
          break;

        default:
          break;
      }
      form.setFieldsValue(body);
    }
    if (groupId) {
      form.setFieldsValue({
        property_group_id: {
          value: groupId,
        },
      });
    }
  }, [modal, groupId]);

  const updateProperty = (id, body) => {
    setLoadingBtn(true);
    propertyService
      .updateValue(id, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        handleCancel();
        dispatch(fetchSellerPropertyValue());
      })
      .finally(() => setLoadingBtn(false));
  };

  const createProperty = (body) => {
    setLoadingBtn(true);
    propertyService
      .createValue(body)
      .then(() => {
        toast.success(t('successfully.created'));
        handleCancel();
        dispatch(fetchSellerPropertyValue());
        !!onSuccess && onSuccess();
      })
      .finally(() => setLoadingBtn(false));
  };

  const onFinish = (values) => {
    const body = {
      property_group_id: values?.property_group_id?.value,
      value: getValue(type, values.value),
    };

    if (modal?.id) {
      updateProperty(modal.id, body);
    } else {
      createProperty(body);
    }
  };

  function getValue(type, value) {
    switch (type) {
      case 'color':
        return value.hex;
      case 'text':
        return value;
      case 'image':
        return value.name;
      default:
        return '';
    }
  }

  const renderPropertyValue = (type) => {
    switch (type) {
      case 'color':
        return (
          <SketchPicker
            onChangeComplete={(color) => setColor(color.hex)}
            color={color}
            disableAlpha={true}
          />
        );
      case 'text':
        return <Input placeholder={t('enter.property.value')} />;

      case 'image':
        return (
          <ImageUploadSingle
            type='property'
            image={image}
            setImage={setImage}
            form={form}
            name='value'
          />
        );

      default:
        return '';
    }
  };

  async function fetchPropertyGroupList(search) {
    const params = { perPage: 10, active: 1, search };
    return propertyService.getAllGroups(params).then((res) =>
      res?.data?.map((item) => ({
        value: item?.id,
        label: item?.translation?.title,
        key: item?.id,
      }))
    );
  }

  return (
    <Modal
      title={modal?.id ? t('edit.property') : t('add.property')}
      visible={!!modal}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        name='property-form'
        layout='vertical'
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name='property_group_id'
          label={t('property.group')}
          hidden={!!groupId}
          rules={[{ required: true, message: '' }]}
        >
          <DebounceSelect fetchOptions={fetchPropertyGroupList} />
        </Form.Item>
        <Form.Item
          name='value'
          label={t('value')}
          rules={[{ required: true, message: '' }]}
        >
          {renderPropertyValue(type)}
        </Form.Item>
      </Form>
    </Modal>
  );
}
