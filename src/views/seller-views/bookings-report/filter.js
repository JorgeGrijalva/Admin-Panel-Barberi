import { Button, Card, DatePicker, Modal, Row, Col, Select, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import moment from 'moment';
const { RangePicker } = DatePicker;

const BookingsReportFilter = ({ filterData, setFilterData }) => {
  const { t } = useTranslation();
  const rangeTypes = [
    {
      label: t('today'),
      value: [
        moment().startOf('day').format('YYYY-MM-DD'),
        moment().endOf('day').format('YYYY-MM-DD'),
      ].join(','),
    },
    {
      label: t('yesterday'),
      value: [
        moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD'),
        moment().subtract(1, 'day').endOf('day').format('YYYY-MM-DD'),
      ].join(','),
    },
    {
      label: t('this.week'),
      value: [
        moment().startOf('week').format('YYYY-MM-DD'),
        moment().endOf('week').format('YYYY-MM-DD'),
      ].join(','),
    },
    {
      label: t('last.week'),
      value: [
        moment().subtract(1, 'week').startOf('week'),
        moment().subtract(1, 'week').endOf('week'),
      ].join(','),
    },
    {
      label: t('this.month'),
      value: [
        moment().startOf('month').format('YYYY-MM-DD'),
        moment().endOf('month').format('YYYY-MM-DD'),
      ].join(','),
    },
    {
      label: t('last.month'),
      value: [
        moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
        moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
      ].join(','),
    },
    {
      label: t('this.year'),
      value: [
        moment().startOf('year').format('YYYY-MM-DD'),
        moment().endOf('year').format('YYYY-MM-DD'),
      ].join(','),
    },
    {
      label: t('last.year'),
      value: [
        moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
        moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
      ].join(','),
    },
  ];
  const options = ['day', 'week', 'month', 'year'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRangeType, setCurrentRangeType] = useState(
    [
      filterData?.date_from?.format('YYYY-MM-DD'),
      filterData?.date_to?.format('YYYY-MM-DD'),
    ].join(','),
  );
  const [customRange, setCustomRange] = useState({
    label: t('custom'),
    value: [
      filterData?.date_from?.format('YYYY-MM-DD'),
      filterData?.date_to?.format('YYYY-MM-DD'),
    ].join(','),
  });

  const handleApply = () => {
    const body = {
      label: currentRangeType?.label,
      date_from: moment(currentRangeType?.value?.split(',')?.[0]),
      date_to: moment(currentRangeType?.value?.split(',')?.[1]),
    };
    setFilterData((prev) => ({ ...prev, ...body }));
    setIsModalOpen(false);
  };

  useEffect(() => {
    setCurrentRangeType(customRange);
  }, [customRange?.value]);

  return (
    <Card>
      <Space wrap>
        <Button
          icon={<CalendarOutlined />}
          type='primary'
          onClick={() => setIsModalOpen(true)}
        >
          {filterData?.label}
        </Button>
        <Select
          style={{ width: '200px' }}
          value={filterData?.type}
          onSelect={(e) => setFilterData((prev) => ({ ...prev, type: e }))}
        >
          {options.map((item) => (
            <Select.Option value={item} key={item}>
              {t(item)}
            </Select.Option>
          ))}
        </Select>
      </Space>
      {isModalOpen && (
        <Modal
          key='bookings-report-filter'
          footer={[
            <Button type='primary' onClick={handleApply}>
              {t('apply')}
            </Button>,
            <Button>{t('cancel')}</Button>,
          ]}
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          title={t('select.range')}
          width={610}
          bodyStyle={{ height: 470 }}
        >
          <Row gutter={12}>
            <Col span={24}>
              <Select
                options={rangeTypes}
                className='w-100 mb-4'
                value={currentRangeType?.value}
                onSelect={(e) => {
                  setCurrentRangeType(
                    rangeTypes.filter((item) => item?.value === e)?.[0],
                  );
                }}
              />
            </Col>
            <Col span={24}>
              <RangePicker
                label={t('date')}
                value={currentRangeType?.value
                  ?.split(',')
                  ?.map((item) => moment(item))}
                onChange={(values) => {
                  const obj = {
                    label: t('custom'),
                    value: values
                      ?.map((item) => item?.format('YYYY-MM-DD'))
                      ?.join(','),
                  };
                  setCustomRange(obj);
                  setCurrentRangeType(obj);
                }}
                allowClear={false}
                className='w-100'
                open={true}
                destroyOnClose={true}
              />
            </Col>
          </Row>
        </Modal>
      )}
    </Card>
  );
};

export default BookingsReportFilter;
