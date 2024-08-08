import { Card, Col, Row, Space, Typography, Divider, Select } from 'antd';
import React, { useMemo } from 'react';
import { LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import ChartWidget from '../chart-widget';
import { COLORS } from '../../constants/ChartConstant';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ReportContext } from '../../context/report';
const { Title } = Typography;

const ReportChart = ({ reportData = {} }) => {
  const { by_time, options, handleByTime, chart_type, setChartType } =
    useContext(ReportContext);
  const { t } = useTranslation();
  const categories = useMemo(
    () => reportData?.chart?.map((item) => item.time),
    [reportData?.chart]
  );

  const chartData = useMemo(() => {
    if (Boolean(reportData.charts)) {
      return reportData.charts.map((item) => {
        return {
          name: item.translation.title,
          data: item.stocks?.map(
            (item) =>
              item.total_order_quantity ||
              item.avg_quantity ||
              item.quantity ||
              item.count ||
              item.price ||
              item.order_details_sum_quantity ||
              0
          ) || [],
        };
      });
    } else
      return [
        {
          name: t('orders'),
          data: reportData?.chart?.map(
            (item) => 
              parseInt(item.count ||
              item.total_price ||
              item.quantity ||
              item.price ||
              item.products_count ||
              item.order_details_avg_quantity ||
              item.order_details_avg_total_price ||
              item.order_details_sum_quantity ||
              item.avg_price ||
              item.avg_quantity ||
              0, 10)
          ) || [],
        },
      ];
  }, [reportData?.chart]);

  return (
    <Row gutter={24}>
      <Col span={24}>
        <Card>
          <Row gutter={24} className='w-100'>
            <div className='d-flex justify-content-between w-100'>
              <Space size='large' className='d-flex'>
                <Title level={3} className='mb-0'>
                  {t('item.sold')}
                </Title>
              </Space>

              <div className='d-flex'>
                <Select
                  style={{ width: 100 }}
                  onChange={handleByTime}
                  options={options}
                  defaultValue={by_time}
                />

                <Divider type='vertical' style={{ height: '100%' }} />
                <Space>
                  <LineChartOutlined
                    style={{
                      fontSize: '22px',
                      cursor: 'pointer',
                      color: chart_type === 'area' ? 'green' : '',
                    }}
                    onClick={() => setChartType('area')}
                  />
                  <BarChartOutlined
                    style={{
                      fontSize: '22px',
                      cursor: 'pointer',
                      color: chart_type === 'bar' ? 'green' : '',
                    }}
                    onClick={() => setChartType('bar')}
                  />
                </Space>
              </div>
            </div>
          </Row>
          <Divider />
          <ChartWidget
            type={chart_type || "area"}
            card={false}
            series={chartData}
            xAxis={categories}
            height={280}
            customOptions={{
              colors: [
                COLORS[1],
                COLORS[2],
                COLORS[3],
                COLORS[4],
                COLORS[5],
                COLORS[6],
                COLORS[0],
              ],
              legend: {
                show: false,
              },
              stroke: {
                width: 2.5,
                curve: 'smooth',
              },
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ReportChart;
