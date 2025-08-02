// src/common/SummaryApi.js

const baseURL = 'http://localhost:8080';

const build = (path) => `${baseURL}${path}`;

const SummaryApi = {
  register: {
    url: build('/api/user/register'),
    method: 'post',
  },
  login: {
    url: build('/api/user/login'),
    method: 'post',
  },
  forgot_password: {
    url: build('/api/user/forgot-password'),
    method: 'put',
  },
  forgot_password_otp_verification: {
    url: build('/api/user/verify-forgot-password-otp'),
    method: 'put',
  },
  resetPassword: {
    url: build('/api/user/reset-password'),
    method: 'put',
  },
  refreshToken: {
    url: build('/api/user/refresh-token'),
    method: 'post',
  },
  userDetails: {
    url: build('/api/user/user-details'),
    method: 'get',
  },
  logout: {
    url: build('/api/user/logout'),
    method: 'get',
  },
  uploadAvatar: {
    url: build('/api/user/upload-avatar'),
    method: 'put',
  },
  updateUserDetails: {
    url: build('/api/user/update-user'),
    method: 'put',
  },
  addCategory: {
    url: build('/api/category/add-category'),
    method: 'post',
  },
  uploadImage: {
    url: build('/api/file/upload'),
    method: 'post',
  },
  getCategory: {
    url: build('/api/category/get'),
    method: 'get',
  },
  updateCategory: {
    url: build('/api/category/update'),
    method: 'put',
  },
  deleteCategory: {
    url: build('/api/category/delete'),
    method: 'delete',
  },
  createSubCategory: {
    url: build('/api/subcategory/create'),
    method: 'post',
  },
  getSubCategory: {
    url: build('/api/subcategory/get'),
    method: 'post',
  },
  updateSubCategory: {
    url: build('/api/subcategory/update'),
    method: 'put',
  },
  deleteSubCategory: {
    url: build('/api/subcategory/delete'),
    method: 'delete',
  },
  createProduct: {
    url: build('/api/product/create'),
    method: 'post',
  },
  getProduct: {
    url: build('/api/product/get'),
    method: 'post',
  },
  getProductByCategory: {
    url: build('/api/product/get-product-by-category'),
    method: 'post',
  },
  getProductByCategoryAndSubCategory: {
    url: build('/api/product/get-product-by-category-and-subcategory'),
    method: 'post',
  },
  getProductDetails: {
    url: build('/api/product/get-product-details'),
    method: 'post',
  },
  updateProductDetails: {
    url: build('/api/product/update-product-details'),
    method: 'put',
  },
  deleteProduct: {
    url: build('/api/product/delete-product'),
    method: 'delete',
  },
  searchProduct: {
    url: build('/api/product/search-product'),
    method: 'post',
  },
  addTocart: {
    url: build('/api/cart/create'),
    method: 'post',
  },
  getCartItem: {
    url: build('/api/cart/get'),
    method: 'get',
  },
  updateCartItemQty: {
    url: build('/api/cart/update-qty'),
    method: 'put',
  },
  deleteCartItem: {
    url: build('/api/cart/delete-cart-item'),
    method: 'delete',
  },
  createAddress: {
    url: build('/api/address/create'),
    method: 'post',
  },
  getAddress: {
    url: build('/api/address/get'),
    method: 'get',
  },
  updateAddress: {
    url: build('/api/address/update'),
    method: 'put',
  },
  disableAddress: {
    url: build('/api/address/disable'),
    method: 'delete',
  },
  CashOnDeliveryOrder: {
    url: build('/api/order/cash-on-delivery'),
    method: 'post',
  },
  payment_url: {
    url: build('/api/order/checkout'),
    method: 'post',
  },
  getOrderItems: {
    url: build('/api/order/order-list'),
    method: 'get',
  },
};

export default SummaryApi;
