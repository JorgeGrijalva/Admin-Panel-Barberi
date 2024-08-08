import React, { useContext, useEffect, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions } from 'antd';
import Loading from '../../components/loading';
import informationService from '../../services/rest/information';
import CustomModal from '../../components/modal';
import { Context } from '../../context/context';

const accessInfo = [
  {
    title: 'PHP Version',
    version: '7.4.30',
  },
  {
    title: 'Laravel Version',
    version: '8.1.0',
  },
  {
    title: 'MySql Version',
    version: '5.7.23',
  },
  {
    title: 'NodeJs Version',
    version: '14.15.0',
  },
  {
    title: 'NPM Version',
    version: '6.14.8',
  },
  {
    title: 'Composer Version',
    version: '1.0.0',
  },
];

export default function ProjectAccessInfo({ next }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(accessInfo);
  const { setIsModalVisible } = useContext(Context);

  useEffect(() => {
    setLoading(true);
    informationService
      .systemInformation()
      .then((res) => {
        setData(res.data);
        checkAccess(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  function checkAccess(data) {
    const newList = list.map((item) => {
      const system = data[item.title]
        ?.split('.')
        .map((item) => item.replace(/[^0-9]+/g, ''))
        .filter((item) => !!item);
      const minimum = item.version
        .split('.')
        .map((item) => item.replace(/[^0-9]+/g, ''))
        .filter((item) => !!item);

      const systemMajor = Number(system[0]);
      const systemMinor = Number(system[1]);
      const minimumMajor = Number(minimum[0]);
      const minimumMinor = Number(minimum[1]);
      if (systemMajor > minimumMajor) {
        return {
          ...item,
          success: true,
        };
      } else if (systemMajor === minimumMajor && systemMinor >= minimumMinor) {
        return {
          ...item,
          success: true,
        };
      } else {
        return {
          ...item,
          success: false,
        };
      }
    });
    setList(newList);
  }

  const handleNext = () => {
    const isValidVersion = list.every((item) => item.success);
    if (!isValidVersion) {
      setIsModalVisible(true);
      return;
    }
    next();
  };

  return (
    <Card
      title='Project access info'
      className='w-100'
      extra={<p>System requirements</p>}
    >
      {!loading ? (
        <Descriptions bordered>
          {list.map((item, index) => (
            <Descriptions.Item label={item.title} key={index} span={3}>
              {data[item.title]}
              <span className='ml-2'>
                {item.success ? (
                  <CheckOutlined style={{ color: '#18a695', fontSize: 18 }} />
                ) : (
                  <CloseOutlined style={{ color: '#e74c3c', fontSize: 18 }} />
                )}
              </span>
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <Loading />
      )}
      <Button className='mt-4' type='primary' onClick={handleNext}>
        Next
      </Button>

      <CustomModal
        click={() => {
          setIsModalVisible(false);
          next();
        }}
        text='Your system configuration is not recommended for this project. Are you sure to continue installation?'
      />
    </Card>
  );
}
