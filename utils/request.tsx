// import { extend } from 'umi-request';
// import { AUTH_DOMAIN, ECODE } from 'constant';

// const request = extend({
//   prefix: `https://${AUTH_DOMAIN[location.host]}`,
//   timeout: 10000,
//   credentials: 'include',
// });

// request.use(async (ctx, next) => {
//   const token = localStorage.getItem('auth');
//   if (token) {
//     ctx.req.options.headers = {
//       ...ctx.req.options.headers,
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json;charset=UTF-8;multipart/form-data;'
//     };
//   }
//   await next();
// });

// request.interceptors.response.use((response: any, options) => {
//   if (response?.code === ECODE.SESSION_INVALID) {
//     window.location.href = `https://${AUTH_DOMAIN[location.host]}/login/?refType=DMS_ADMIN&redirect_url=${encodeURI(location.href)}`;
//   } else if (response?.code === ECODE.PERMISSION_DENIED) {
//     if (window.location.href !== '/403') {
//       window.location.href = `/403?redirect_url=${encodeURI(location.href)}`;
//     }
//   }
//   return response;
// });

// export default request;

import axios from 'axios';
import { AUTH_DOMAIN, ECODE } from 'constant';

const request = axios.create({
  baseURL: `https://${AUTH_DOMAIN[location.host]}`,
  timeout: 10000,
  withCredentials: true,
});

const addAuthorizationHeader = (config) => {
  const token = localStorage.getItem('auth');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8;',
    };
  }
  return config;
};

const handleErrorResponse = (error) => {
  if (error.response?.data?.code === ECODE.SESSION_INVALID) {
    window.location.href = `https://${AUTH_DOMAIN[location.host]}/login/?refType=DMS_ADMIN&redirect_url=${encodeURI(location.href)}`;
  } else if (error.response?.data?.code === ECODE.PERMISSION_DENIED) {
    if (window.location.href !== '/403') {
      window.location.href = `/403?redirect_url=${encodeURI(location.href)}`;
    }
  }
  return Promise.reject(error);
};

request.interceptors.request.use(addAuthorizationHeader);
request.interceptors.response.use((response) => response, handleErrorResponse);

export default request;
