import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd';
import {
  fetchCardsBookingsReport,
  fetchMastersBookingsReport,
  fetchPaymentsReport,
  fetchStatisticsBookingsReport,
  fetchSummaryBookingsReport,
} from 'redux/slices/bookings-report';
import { useEffect, useState } from 'react';
import useDidUpdate from 'helpers/useDidUpdate';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch } from 'redux/slices/menu';
import BookingReportPayments from './payments';
import BookingsReportFilter from './filter';
import moment from 'moment';
import BookingsReportMasters from './masters';
import BookingsReportCards from './cards';
import BookingsReportStatistics from './statistics';
import BookingsReportSummary from './summary';

export default function BookingsReport() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const {
    loading,
    paymentsData,
    mastersData,
    cardData,
    statisticsData,
    summaryData,
  } = useSelector((state) => state.bookingsReport.seller, shallowEqual);
  const [filtersData, setFiltersData] = useState({
    type: 'day',
    label: t('this.week'),
    date_from: moment().startOf('week'),
    date_to: moment().endOf('week'),
  });

  const paramsData = {
    payments: {
      type: filtersData?.type,
    },
    masters: {
      date_from: filtersData?.date_from?.format('YYYY-MM-DD'),
      date_to: filtersData?.date_to?.format('YYYY-MM-DD'),
      perPage: 5,
      page: 1,
    },
    cards: {
      date_from: filtersData?.date_from?.format('YYYY-MM-DD'),
      date_to: filtersData?.date_to?.format('YYYY-MM-DD'),
    },
    statistics: {
      date_from: filtersData?.date_from?.format('YYYY-MM-DD'),
      date_to: filtersData?.date_to?.format('YYYY-MM-DD'),
    },
    summary: { type: filtersData?.type },
    date_to: filtersData?.date_to?.format('YYYY-MM-DD'),
    type: filtersData?.type,
  };

  const fetchAll = () => {
    batch(() => {
      dispatch(fetchPaymentsReport(paramsData.payments));
      dispatch(fetchMastersBookingsReport(paramsData.masters));
      dispatch(fetchCardsBookingsReport(paramsData.cards));
      dispatch(fetchStatisticsBookingsReport(paramsData.statistics));
      dispatch(fetchSummaryBookingsReport(paramsData.summary));
    });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        fetchAll();
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    fetchAll();
  }, [paramsData?.date_to, paramsData?.type]);

  return (
    <>
      <BookingsReportFilter
        filterData={filtersData}
        setFilterData={setFiltersData}
      />
      <Row gutter={12}>
        <Col span={12}>
          <BookingReportPayments
            paymentsData={paymentsData}
            loading={loading}
          />
        </Col>
        <Col span={12}>
          <BookingsReportSummary summaryData={summaryData} loading={loading} />
        </Col>
        <Col span={24}>
          <BookingsReportStatistics statisticsData={statisticsData} />
        </Col>
        <Col span={24}>
          <BookingsReportCards cardsData={cardData} loading={loading} />
        </Col>
        <Col span={24}>
          <BookingsReportMasters
            mastersData={mastersData}
            loading={mastersData.loading}
            paramsData={paramsData.masters}
            fetchBookingsReportMaster={fetchMastersBookingsReport}
          />
        </Col>
      </Row>
    </>
  );
}
