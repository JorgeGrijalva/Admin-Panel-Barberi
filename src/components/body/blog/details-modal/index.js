import { Descriptions, Image, Rate } from 'antd';
import { useTranslation } from 'react-i18next';

const BlogDetailsBody = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Descriptions bordered>
      <Descriptions.Item label={t('id')} span={3}>
        {data?.id || 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label={t('image')} span={3}>
        <Image
          src={data?.img}
          width={150}
          height={100}
          placeholder={!data?.img?.length}
          className='rounded'
          style={{ objectFit: 'contain' }}
        />
      </Descriptions.Item>
      <Descriptions.Item label={t('title')} span={3}>
        {data?.translation?.title || 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label={t('short.description')} span={3}>
        {data?.translation?.short_desc || 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label={t('review.average')} span={3}>
        <Rate allowHalf disabled defaultValue={data?.r_avg || 0} />
      </Descriptions.Item>
      <Descriptions.Item label={t('review.count')} span={3}>
        {data?.r_count || 0}
      </Descriptions.Item>
      <Descriptions.Item label={t('review.sum')} span={3}>
        {data?.r_sum || 0}
      </Descriptions.Item>
    </Descriptions>
  );
};
export default BlogDetailsBody;
