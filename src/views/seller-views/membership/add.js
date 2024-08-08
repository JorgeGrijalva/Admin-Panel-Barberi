import { Form } from 'antd';
import membershipService from 'services/seller/membership';
import MembershipForm from './form';

export default function AddMembership() {
  const [form] = Form.useForm();

  const handleSubmit = (body) => {
    return membershipService.create(body);
  };

  return <MembershipForm form={form} handleSubmit={handleSubmit} />;
}
