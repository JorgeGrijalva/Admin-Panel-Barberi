import React, { useState, useEffect, useMemo } from 'react';
import Loading from 'components/loading';
import moment from 'moment';
import workingDays from 'services/warehouseWorkingDays';
import closeDates from 'services/warehouseClosedDays';
import { weeks } from 'components/shop/weeks';
import { Form } from 'antd';
import WorkingDays from './date-form';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchWarehouses } from 'redux/slices/warehouse';
import { removeFromMenu } from 'redux/slices/menu';

const WorkingDate = ({ prev }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [days, setDays] = useState([]);
  const [lines, setLines] = useState(new Array(7).fill(false));
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const uuid = useMemo(() => activeMenu?.data?.id, [activeMenu?.data]);
  const onFinish = (values) => {
    setLoadingBtn(true);
    const closeDatesBody = {
      warehouse_id: uuid,
      dates: days
        ? days.map((item) => moment(item).format('YYYY-MM-DD'))
        : undefined,
    };

    const workingDaysBody = {
      warehouse_id: uuid,
      dates: values.working_days.map((item) => ({
        day: item.title,
        from: moment(item.from ? item.from : '00').format('HH:mm'),
        to: moment(item.to ? item.to : '00').format('HH:mm'),
        disabled: item.disabled,
      })),
    };

    if (values.working_days.length !== 0) {
      workingDays
        .update(uuid, workingDaysBody)
        .then(() => {})
        .finally(() => setLoadingBtn(false));
    }
    closeDates
      .update(uuid, closeDatesBody)
      .then(() => {
        const nextUrl = 'warehouse';
        // dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        // dispatch(fetchWarehouses());
      })
      .finally(() => setLoadingBtn(false));
  };

  const getDays = () => {
    setLoading(true);
    closeDates.getById(uuid).then((res) => {
      setDays(
        res.data.closed_dates
          .filter((date) => date.day > moment(new Date()).format('YYYY-MM-DD'))
          .map((itm) => new Date(itm.day))
      );
    });

    workingDays
      .getById(uuid)
      .then((res) => {
        setLines(
          res.data.dates.length !== 0
            ? res.data.dates.map((item) => item.disabled)
            : []
        );

        res.data.dates.length !== 0 &&
          form.setFieldsValue({
            working_days: res.data.dates.map((item) => ({
              title: item.day,
              from: moment(item.from, 'HH:mm:ss'),
              to: moment(item.to, 'HH:mm:ss'),
              disabled: Boolean(item.disabled),
            })),
          });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    form.setFieldsValue({
      working_days: weeks,
    });
    if (uuid) getDays();
  }, []);

  return (
    <>
      {!loading ? (
        <WorkingDays
          onFinish={onFinish}
          prev={prev}
          form={form}
          lines={lines}
          loadingBtn={loadingBtn}
          days={days}
          setDays={setDays}
          setLines={setLines}
          weeks={weeks}
        />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default WorkingDate;
