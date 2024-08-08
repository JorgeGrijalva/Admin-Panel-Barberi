import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Space } from 'antd';

const AddonsItem = ({
  showExtras,
  addonCalculate,
  selectedValues,
  handleChange,
}) => {
  return (
    <Space direction='vertical' size='middle'>
      {showExtras.stock?.addons
        ?.filter((item) => !!item.product)
        .map((item) => {
          const selected = selectedValues.includes(String(item.addon_id));
          return (
            <div key={item.id}>
              <Checkbox
                id={String(item.id)}
                name={String(item.id)}
                checked={selected}
                onChange={() => handleChange(item)}
              />
              <label htmlFor={String(item.id)}>
                {selected && (
                  <Space size={0}>
                    <Button
                      type='text'
                      className='minus-button'
                      style={{ padding: 0, height: 'max-content' }}
                      size='small'
                      icon={<MinusOutlined />}
                      disabled={item.product.quantity === 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        addonCalculate(
                          item.addon_id,
                          item.product.quantity - 1
                        );
                      }}
                    />
                    <span className='ml-2'>
                      {item.product.quantity || item.product.min_qty}
                    </span>
                    <Button
                      type='text'
                      className='plus-button'
                      style={{ padding: 0, height: 'max-content' }}
                      size='small'
                      icon={<PlusOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        addonCalculate(
                          item.addon_id,
                          item.product.quantity
                            ? item.product.quantity + 1
                            : item.product.min_qty + 1
                        );
                      }}
                    />
                  </Space>
                )}
                <span className='ml-2'>{item.product?.translation?.title}</span>
              </label>
            </div>
          );
        })}
    </Space>
  );
};

export default AddonsItem;
