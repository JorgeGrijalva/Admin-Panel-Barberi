import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch } from 'redux/slices/menu';
import {
  fetchDeliverymanStatisticsCount,
  fetchSellerStatisticsCount,
  fetchStatistics,
} from 'redux/slices/statistics/count';
import { fetchTopCustomers } from 'redux/slices/statistics/topCustomers';
import {
  fetchSellerTopProducts,
  fetchTopProducts,
} from 'redux/slices/statistics/topProducts';
import Loading from 'components/loading';
import {
  fetchOrderCounts,
  fetchSellerOrderCounts,
} from 'redux/slices/statistics/orderCounts';
import {
  fetchOrderSales,
  fetchSellerOrderSales,
} from 'redux/slices/statistics/orderSales';
import {
  fetchStatisticsBookingsReportAdmin,
  fetchStatisticsBookingsReport,
  fetchStatisticsBookingsReportMaster,
} from 'redux/slices/bookings-report';
import GeneralDashboard from './generalDashboard';
import DeliverymanDashboard from './deliverymanDashboard';
import ManagerDashboard from './managerDashboard';
import ModeratorDashboard from './moderatorDashboard';
import { Navigate } from 'react-router-dom';
import MasterDashboard from './masterDashboard';
import moment from 'moment/moment';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const { loading } = useSelector(
    (state) => state.statisticsCount,
    shallowEqual
  );
  const { master } = useSelector((state) => state.bookingsReport, shallowEqual);

  function getDashboardsByRole() {
    const body = { time: 'subMonth' };
    const bookingsBody = {
      date_from: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      date_to: moment().format('YYYY-MM-DD'),
    };
    const masterBody = {
      date_from: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      date_to: moment().format('YYYY-MM-DD'),
    };
    switch (user?.role) {
      case 'admin':
        dispatch(fetchStatistics(body));
        dispatch(fetchTopCustomers(body));
        dispatch(fetchTopProducts(body));
        dispatch(fetchOrderCounts(body));
        dispatch(fetchOrderSales(body));
        dispatch(fetchStatisticsBookingsReportAdmin(bookingsBody));
        break;
      case 'manager':
        dispatch(fetchTopCustomers(body));
        dispatch(fetchTopProducts(body));
        break;
      case 'seller':
        dispatch(fetchSellerStatisticsCount(body));
        dispatch(fetchSellerTopProducts(body));
        dispatch(fetchSellerOrderCounts(body));
        dispatch(fetchSellerOrderSales(body));
        dispatch(fetchStatisticsBookingsReport(bookingsBody));
        break;
      case 'moderator':
        break;
      case 'deliveryman':
        dispatch(fetchDeliverymanStatisticsCount({}));
        break;
      case 'master':
        dispatch(fetchStatisticsBookingsReportMaster(masterBody));
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      getDashboardsByRole();
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'admin':
        return <GeneralDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'seller':
        return <GeneralDashboard isSeller={true} />;
      case 'moderator':
        return <ModeratorDashboard />;
      case 'deliveryman':
        return <DeliverymanDashboard />;
      case 'waiter':
        return <Navigate to='/waiter/orders-board' replace />;
      case 'master':
        return <MasterDashboard />;

      default:
        return null;
    }
  };

  return (
    <div className='h-100'>
      {!loading && !master.loading ? (
        renderDashboardByRole()
      ) : (
        <Loading size='large' />
      )}
    </div>
  );
}
