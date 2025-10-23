import axios from 'axios';

// const domain = 'https://ranglerzbeta.in/nutrabiotics/';
const domain = 'https://admin.nutrabioticsapp.com/';
const baseUrl = domain + 'api/';
const Google_Map_API_Key = 'AIzaSyA5VajG6zbWb_yIBiO-WkUDbPvDMVL-1TQ';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

const configureDefaultHeaders = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

const requests = {
  get: url => axios.get(`${baseUrl}${url}`),
  post: (url, data) => axios.post(`${baseUrl}${url}`, data),
};

const authRequests = {
  register: data => requests.post('register', data),
  login: data => requests.post('login', data),
  social_login: data => requests.post('socialLogin', data),
  logout: () => requests.post('logout'),
  forgotPassword: data => requests.post('forget-password', data),
  confirmOTP: data => requests.post('confirm-token', data),
  resetPassword: data => requests.post('reset-password', data),
  changePassword: data => requests.post('change-password', data),
  getCountries: () => requests.get('country'),
};
const productRequests = {
  home: () => requests.get('home'),
  category: () => requests.get('category'),
  subCategory: id => requests.get(`subcategory/${id}`),
  allProducts: data => requests.post(`product`, data),
  populars: data => requests.post(`most-selling`, data),
  deals: data => requests.post(`deal`, data),
  productDetail: data => requests.post(`location`, data),
  updateProfile: data => requests.post(`update-profile`, data),
  order: (id, data) => requests.post(`post-order/${id}`, data),
  coupen: countryName => requests.get(`coupon/${countryName}`),
  notifications: data => requests.post(`all-notification`, data),
  notificationSeen: id => requests.get(`seen-notification/${id}`),
  orderApprove: data => requests.post(`order-approve`, data),
  productSearch: str => requests.get(`search/${str}`),
  availablePharmacy: coupon => requests.get(`couponPharmacy/${coupon}`),
};

export {
  authRequests,
  productRequests,
  configureDefaultHeaders,
  domain,
  baseUrl,
  Google_Map_API_Key,
};
