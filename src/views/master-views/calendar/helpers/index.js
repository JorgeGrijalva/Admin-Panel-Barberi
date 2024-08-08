import currencyService from 'services/currency';
import paymentService from 'services/rest/payment';
import mastersService from 'services/rest/masters';
import servicesMasterService from 'services/master/serviceMaster';
import shopService from 'services/shop';
import masterUserService from 'services/master/user';

export async function fetchUsers(search) {
  const params = {
    search,
    perPage: 10,
  };
  return masterUserService.getAll(params).then(({ data }) => {
    return data.map((item) => ({
      label: `${item?.firstname} ${item?.lastname}`,
      value: item?.id,
      key: item?.id,
    }));
  });
}

export async function fetchMasterList({ service_id, shop_id }) {
  const params = {
    perPage: 10,
    role: 'master',
    service_id,
    shop_id,
  };
  return mastersService.getAll(params).then(({ data }) => {
    return data.map((item) => ({
      label: `${item?.firstname} ${item?.lastname}`,
      value: item?.id,
      key: item?.id,
    }));
  });
}

export const fetchService = async (params) => {
  return await servicesMasterService.get(params).then(({ data }) => {
    return data?.map((item) => ({
      label: item?.service?.translation?.title,
      value: item?.id,
      key: `${item?.id} ${item.type}`,
    }));
  });
};

export async function fetchShops(search) {
  const params = { search, status: 'approved' };
  return shopService.getAll(params).then(({ data }) =>
    data.map((item) => ({
      label: item.translation?.title,
      value: item.id,
      key: item.id,
    }))
  );
}
export async function fetchPayments() {
  return paymentService.getAll().then(({ data }) => {
    return data
      .filter((item) => item.active)
      .map((item) => ({
        value: item.id,
        label: item.tag,
        key: item.id,
      }));
  });
}
export async function fetchCurrency() {
  return currencyService.getAll().then(({ data }) => {
    return data
      .filter((item) => item.active)
      .map((item) => ({
        value: item.id,
        label: `${item.title} (${item.symbol || ''})`,
        key: item.id,
      }));
  });
}
