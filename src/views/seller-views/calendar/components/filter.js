import { Card, Col, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import mastersService from 'services/rest/masters';
import { fetchSellerBookingList } from 'redux/slices/booking';
import { fetchMasterDisabledTimesAsSeller } from 'redux/slices/disabledTimes';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SearchInput from '../../../../components/search-input';

const BookingFilter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [filterValues, setFilterValues] = useState({});

  function fetchMasterList() {
    const params = {
      perPage: 100,
      role: 'master',
    };
    mastersService.getAll(params).then(({ data }) => {
      const masters = data.map((item) => ({
        label: `${item?.firstname} ${item?.lastname}`,
        value: item?.id,
        key: item?.id,
      }));
      setOptions(masters);
    });
  }

  const handleFilter = (newFilterParam) => {
    setFilterValues((prev) => ({ ...prev, ...newFilterParam }));
  };

  const fetchFilteredData = () => {
    dispatch(fetchSellerBookingList(filterValues));
    dispatch(
      fetchMasterDisabledTimesAsSeller({
        perPage: 100,
        ...filterValues,
      }),
    );
  };

  useEffect(() => {
    fetchFilteredData();
  }, [filterValues]);

  useEffect(() => {
    fetchMasterList();
  }, []);

  return (
    <Card>
      <Row gutter={24}>
        <Col span={5}>
          <Select
            className='w-100'
            defaultValue={{
              label: `All`,
              value: null,
              key: null,
            }}
            onChange={(_, option) => handleFilter(option)}
          >
            {options.map((item) => (
              <Select.Option key={item.key} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={5}>
          <SearchInput
            defaultValue={filterValues.search}
            // resetSearch={!data?.search}
            placeholder={t('search')}
            handleChange={(search) => handleFilter({ search })}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default BookingFilter;
