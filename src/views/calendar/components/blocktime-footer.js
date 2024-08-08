import React, { useContext } from 'react';
import { BookingContext } from '../provider';
import { Button, Col, Popconfirm, Row } from 'antd';
import { t } from 'i18next';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { fetchMasterDisabledTimesAsAdmin } from 'redux/slices/disabledTimes';
import { masterDisabledTimesServices } from 'services/master-disabled-times';

const BlockTimeFooter = () => {
  const dispatch = useDispatch();
  const { blocktimeForm, disabled_slot_id, setViewContent } =
    useContext(BookingContext);

  const handleDelete = () => {
    masterDisabledTimesServices
      .delete({ 'ids[0]': disabled_slot_id })
      .then(() => {
        setViewContent('');
        dispatch(fetchMasterDisabledTimesAsAdmin({ perPage: 100 }));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Row gutter={6}>
      {Boolean(disabled_slot_id) && (
        <Col span={2}>
          <Popconfirm
            title='Delete the task'
            description='Are you sure to delete this task?'
            onConfirm={handleDelete}
            okText='Yes'
            cancelText='No'
          >
            <Button type='danger' icon={<DeleteOutlined />} />
          </Popconfirm>
        </Col>
      )}
      <Col span={Boolean(disabled_slot_id) ? 22 : 24}>
        <Button
          type='primary'
          className='w-100'
          onClick={() => blocktimeForm.submit()}
        >
          {t('submit')}
        </Button>
      </Col>
    </Row>
  );
};

export default BlockTimeFooter;
