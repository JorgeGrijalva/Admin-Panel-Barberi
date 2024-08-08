import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'qs';

export const useQueryParams = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

  const set = (name, value) =>
    navigate({ search: qs.stringify({ ...queryParams, [name]: value }) });
  const clear = () => navigate({ search: qs.stringify({}) });
  const merge = (values) =>
    navigate({ search: qs.stringify({ ...queryParams, ...values }) });
  const reset = (name) => {
    const newParams = { ...queryParams };
    if (newParams[name]) {
      delete newParams[name];
    }

    navigate({ search: qs.stringify({ ...newParams }) });
  };

  return { values: queryParams, set, reset, clear, merge };
};
