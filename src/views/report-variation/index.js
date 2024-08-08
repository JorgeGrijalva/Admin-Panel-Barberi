import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Table,
  Tag,
  Button,
  Checkbox,
  Dropdown,
  Menu,
  Divider,
  DatePicker,
} from 'antd';
import React from 'react';
import {
  MoreOutlined,
  DownOutlined,
  LineChartOutlined,
  BarChartOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import ChartWidget from 'components/chart-widget';
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const ReportVariation = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='http://www.alipay.com/'
        >
          1st menu item
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Row gutter={24} className='mb-4'>
        <Col span={12}>
          <Space size='large'>
            <Dropdown overlay={menu}>
              <Button icon={<FilterOutlined />}>Filter by date range</Button>
            </Dropdown>
            <RangePicker />
          </Space>
        </Col>
      </Row>
      <Row gutter={24} className='report-products'>
        <Col span={8}>
          <Card>
            <Row className='mb-5'>
              <Col>
                <Text>Item Sold</Text>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Title level={2}>50</Title>
              </Col>
              <Col span={12} className='d-flex justify-content-end'>
                <Tag color='geekblue' className='d-flex align-items-center'>
                  5%
                </Tag>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Row className='mb-5'>
              <Col>
                <Text>Not Sales</Text>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Title level={2}>1950 UZS</Title>
              </Col>
              <Col span={12} className='d-flex justify-content-end'>
                <Tag color='gold' className='d-flex align-items-center'>
                  2%
                </Tag>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card className='active'>
            <Row className='mb-5'>
              <Col>
                <Text>Orders</Text>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Title level={2}>10</Title>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <Row gutter={24}>
              <Col span={22}>
                <Row gutter={24}>
                  <Col span={9}>
                    <Space size='large' className='d-flex'>
                      <Title level={3} className='mb-0'>
                        Items Sold
                      </Title>
                      <Checkbox className='d-flex'>
                        Last month (Nov 1-30, 2022)
                      </Checkbox>
                      <Text>39</Text>
                    </Space>
                  </Col>
                  <Col span={8} className='d-flex justify-content-between'>
                    <Checkbox>Previous period (Nov 1-30, 2022)</Checkbox>
                    <Text className='flex-grow-0'>39</Text>
                  </Col>
                  <Col span={7} className='d-flex justify-content-end'>
                    <Dropdown overlay={menu}>
                      <Space>
                        Hover me <DownOutlined />
                      </Space>
                    </Dropdown>
                  </Col>
                </Row>
              </Col>
              <Col span={2}>
                <Divider type='vertical' style={{ height: '100%' }} />
                <Space>
                  <LineChartOutlined style={{ fontSize: '22px' }} />
                  <BarChartOutlined style={{ fontSize: '22px' }} />
                </Space>
              </Col>
            </Row>
            <Divider />
            <ChartWidget />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <Row gutter={24} className='align-items-center mb-2'>
              <Col span={22}>
                <Space>
                  <Title level={2} className='mb-0'>
                    Variations
                  </Title>
                </Space>
              </Col>
              <Col span={2}>
                <Space>
                  <Tag color='geekblue'>Compare</Tag>
                  <MoreOutlined style={{ fontSize: '26px' }} />
                </Space>
              </Col>
            </Row>
            <Table scroll={{ x: true }} columns={columns} dataSource={data} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportVariation;
