import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Modal } from 'antd';
import { useQueryParams } from 'helpers/useQueryParams';
import shopService from 'services/shop';
import ShopDetailsBody from 'components/body/shop/details-modal';

const ShopDetailsModal = () => {
  const { t } = useTranslation();
  const queryParams = useQueryParams();
  const id = queryParams.values?.shopId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchShop = () => {
        shopService
          .getById(id)
          .then((res) => setData(res?.data))
          .catch((error) => {
            console.error(error);
          })
          .finally(() => setLoading(false));
      };

      fetchShop();
    }
  }, [id]);

  if (!id) {
    return null;
  }

  const handleClose = () => {
    queryParams.clear();
    setData(null);
  };

  return (
    <Modal
      title={`shop.details #${id}`}
      onCancel={handleClose}
      visible={!!id}
      footer={<Button onClick={handleClose}>{t('close')}</Button>}
      width={1000}
    >
      <Card loading={loading}>
        <ShopDetailsBody data={data} />
      </Card>
    </Modal>
  );
};

export default ShopDetailsModal;
