import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import orderService from 'services/order';
import Loading from 'components/loading';
import LanguageList from 'components/language-list';
import moment from 'moment';
import { EditOutlined, SendOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

export default function OrderStatusModal({
  orderId,
  handleCancel,
  refetchPage,
}) {
  const { statusList } = useSelector(
    (state) => state.orderStatus,
    shallowEqual,
  );
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );

  const [form] = Form.useForm();
  const { t } = useTranslation();

  const changeInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [statuses, setStatuses] = useState(
    !!statusList?.length
      ? statusList?.map((item) => ({
          value: item?.name,
          label: t(item?.name),
          key: item?.id,
        }))
      : [],
  );
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState(null);
  const [changeNote, setChangeNote] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchOrderById = () => {
    setLoading(true);
    orderService
      .getById(orderId)
      .then((res) => {
        setData(res.data);
        setNotes(res.data?.notes?.filter((item) => !!item?.notes?.length));
        setStatus(res.data?.status);
        form.setFieldsValue({ status: res?.data?.status });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrderById();
  }, [orderId]);

  useEffect(() => {
    if (data?.status === 'pause') {
      setStatuses(
        statusList?.map((item) => ({
          value: item?.name,
          label: t(item?.name),
          key: item?.id,
        })),
      );
      return;
    }

    const statusIndex = statusList.findIndex(
      (item) => item.name === data?.status,
    );

    const newStatuses =
      statusIndex >= 0
        ? [
            statusList[statusIndex],
            statusIndex < statusList.length - 1
              ? statusList[statusIndex + 1]?.name === 'pause'
                ? statusList[statusIndex + 2]
                : statusList[statusIndex + 1]
              : null,
          ]
        : [
            statusIndex < statusList.length - 1
              ? statusList[statusIndex + 1]
              : null,
          ];

    if (statusList[statusIndex]?.name === 'on_a_way') {
      newStatuses.push(statusList[statusIndex + 4]);
    }

    if (statusList?.filter((item) => item?.name === 'pause' && item?.active)) {
      newStatuses?.push(
        statusList?.filter(
          (item) => item?.name === 'pause' && item?.active,
        )?.[0],
      );
    }

    newStatuses.push({
      name: 'canceled',
      id: 8,
      active: true,
      sort: statusList?.length + 1,
    });

    setStatuses(
      newStatuses.filter(Boolean).map((item) => ({
        value: item?.name,
        label: t(item?.name),
        key: item?.id,
      })),
    ); // Remove null values
  }, [data]);

  const removeUndefinedValues = (obj) => {
    const filteredEntries = Object.entries(obj).filter(([_, value]) => !!value);

    if (filteredEntries?.length === 0) {
      return;
    }

    return Object.fromEntries(filteredEntries);
  };

  const onFinish = (values) => {
    let updatedNoteTitle = null;

    setLoadingBtn(true);

    if (!!changeNote && values?.status === data?.status) {
      updatedNoteTitle = {
        ...Object.assign(
          {},
          ...languages.map((lang) => ({
            [lang.locale]: values[`title[${lang.locale}]`],
          })),
        ),
      };
      updatedNoteTitle = removeUndefinedValues(updatedNoteTitle);
    }

    const currentNotes = removeUndefinedValues({
      ...Object.assign(
        {},
        ...languages.map((lang) => ({
          [lang.locale]: values[`note[${lang.locale}]`],
        })),
      ),
    });

    const title = !!currentNotes ? { title: currentNotes } : null;

    const previousNotes =
      data?.status === values?.status
        ? data?.notes
            ?.filter((item) => item?.status === values?.status)
            .flatMap((item) =>
              item?.notes?.map((note, index) =>
                index === changeNote?.index
                  ? { ...note, title: { ...note?.title, ...updatedNoteTitle } }
                  : note,
              ),
            )
            .filter(Boolean)
        : [];

    const params = {
      status: values?.status,
      notes: [...previousNotes, title].filter(Boolean),
    };

    orderService
      .updateStatus(data.id, params)
      .then(() => {
        handleCancel();
        refetchPage();
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    form.setFieldsValue({
      [`title[${defaultLang || 'en'}]`]:
        changeNote?.title?.[defaultLang || 'en'],
    });
  }, [defaultLang]);

  return (
    <Modal
      visible={!!orderId}
      title={[t('order.status')]}
      onCancel={handleCancel}
      footer={[
        <Button
          key='save-form'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>,
        <Button key='cansel-modal' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      {!loading ? (
        <>
          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
            name='order-status-change-form'
          >
            <Row gutter={12} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <LanguageList />
              </Col>
            </Row>

            {!!data?.notes?.some((item) => !!item?.notes?.length) && (
              <>
                <Collapse>
                  {notes?.map((item) => (
                    <Panel header={t(item?.status)} key={item?.id}>
                      {item?.notes?.map((note, index) => (
                        <Row
                          style={{
                            marginBottom: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                          gutter={12}
                          key={index}
                        >
                          <Col
                            span={
                              item?.status === data?.status &&
                              status === data?.status
                                ? 22
                                : 24
                            }
                          >
                            <div style={{ display: 'flex', columnGap: '10px' }}>
                              <span style={{ marginTop: '3px' }}>
                                {index + 1}.{' '}
                              </span>
                              <div style={{ width: '100%' }}>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: '15px',
                                    wordBreak: 'break-all',
                                  }}
                                  hidden={
                                    changeNote?.orderId === item?.id &&
                                    changeNote?.index === index &&
                                    data?.status === status
                                  }
                                >
                                  {note?.title?.[defaultLang || 'en'] || '--'}
                                </p>
                                {
                                  <Form.Item
                                    name={`title[${defaultLang || 'en'}]`}
                                    hidden={
                                      changeNote?.orderId !== item?.id ||
                                      changeNote?.index !== index ||
                                      data?.status !== status
                                    }
                                  >
                                    <Input.TextArea
                                      maxLength={200}
                                      key={index}
                                      style={{
                                        width: '100%',
                                      }}
                                      rows={
                                        Math.floor(
                                          note?.title?.[defaultLang || 'en']
                                            ?.length / 41 || 0,
                                        ) + 1
                                      }
                                      ref={changeInputRef}
                                    />
                                  </Form.Item>
                                }
                              </div>
                            </div>
                            <p
                              style={{
                                fontSize: '12px',
                                margin: 0,
                                float: 'right',
                              }}
                            >
                              {moment(note?.created_at).format(
                                'DD-MM-YYYY HH:mm',
                              )}
                            </p>
                          </Col>
                          {item?.status === data?.status &&
                            data?.status === status && (
                              <Col span={2}>
                                {changeNote?.orderId === item?.id &&
                                index === changeNote?.index ? (
                                  <Button
                                    type='primary'
                                    icon={<SendOutlined />}
                                    size={'small'}
                                    onClick={() => form.submit()}
                                    loading={loadingBtn}
                                  />
                                ) : (
                                  item?.status === data?.status && (
                                    <Button
                                      icon={<EditOutlined />}
                                      size='small'
                                      onClick={() => {
                                        changeInputRef.current.focus();
                                        setChangeNote({
                                          orderId: item?.id,
                                          index: index,
                                          title: note?.title,
                                        });
                                        form.setFieldsValue({
                                          [`title[${defaultLang || 'en'}]`]:
                                            note?.title?.[defaultLang || 'en'],
                                        });
                                      }}
                                    />
                                  )
                                )}
                              </Col>
                            )}
                        </Row>
                      )) || '--'}
                    </Panel>
                  ))}
                </Collapse>
                <Divider />
              </>
            )}

            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  label={t('status')}
                  name='status'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <Select
                    options={statuses}
                    onSelect={(item) => setStatus(item)}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                {languages.map((item) => (
                  <Form.Item
                    name={`note[${item?.locale}]`}
                    key={`note_${item?.id}`}
                    label={t('note')}
                    hidden={item?.locale !== defaultLang}
                  >
                    <Input.TextArea maxLength={200} />
                  </Form.Item>
                ))}
              </Col>
            </Row>
          </Form>
        </>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
