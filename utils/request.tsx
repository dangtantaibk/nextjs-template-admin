import axios from 'axios';
import { AUTH_DOMAIN, ECODE } from 'constant';

const request = axios.create({
  baseURL: AUTH_DOMAIN,
  timeout: 10000,
  withCredentials: true,
});

const addAuthorizationHeader = (config) => {
  let token: any;
  if (typeof window !== "undefined") {
    token = window.localStorage.getItem("auth");
  }
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
    window.location.href = `${AUTH_DOMAIN}/login/?refType=DMS_ADMIN&redirect_url=${encodeURI(location.href)}`;
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
