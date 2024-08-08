import { useQueryParams } from 'helpers/useQueryParams';
import { Button, Card, Modal } from 'antd';
import { useState, useEffect } from 'react';
import blogService from 'services/blog';
import { useTranslation } from 'react-i18next';
import BlogDetailsBody from 'components/body/blog/details-modal';

const BlogDetailsModal = () => {
  const { t } = useTranslation();
  const queryParam = useQueryParams();
  const id = queryParam.values?.blogId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchBlog = () => {
        blogService
          .getById(id)
          .then((res) => setData(res?.data))
          .catch((error) => {
            console.error(error);
          })
          .finally(() => setLoading(false));
      };

      fetchBlog();
    }
  }, [id]);

  if (!id) {
    return null;
  }

  const handleClose = () => {
    queryParam.clear();
    setData(null);
  };

  return (
    <Modal
      title={`blog.details #${id}`}
      onCancel={handleClose}
      visible={!!id}
      footer={<Button onClick={handleClose}>{t('close')}</Button>}
      width={800}
    >
      <Card loading={loading}>
        <BlogDetailsBody data={data} />
      </Card>
    </Modal>
  );
};

export default BlogDetailsModal;
